import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type { InquiryInput, StoredInquiry } from "@/lib/inquiry";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE = "inquiries";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL as string, SUPABASE_SERVICE_ROLE_KEY as string, {
      auth: { persistSession: false },
    })
  : null;

// Local fallback store for environments without Supabase configured (e.g. local dev).
// NOTE: most serverless hosts (Vercel, etc.) have a read-only or ephemeral filesystem in
// production, so this file will NOT persist across deploys/instances there — configure
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY for production use.
const LOCAL_DB_PATH = path.join(process.cwd(), ".data", "inquiries.json");

async function readLocalInquiries(): Promise<StoredInquiry[]> {
  try {
    const raw = await fs.readFile(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(raw) as StoredInquiry[];
  } catch {
    return [];
  }
}

async function writeLocalInquiry(inquiry: StoredInquiry): Promise<void> {
  const existing = await readLocalInquiries();
  existing.unshift(inquiry);
  await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
  await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(existing, null, 2), "utf-8");
}

export function buildStoredInquiry(
  input: InquiryInput,
  meta: { ip: string; userAgent: string; device: StoredInquiry["device"] },
): StoredInquiry {
  return {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...meta,
  };
}

export async function saveInquiry(inquiry: StoredInquiry): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from(TABLE).insert({
      id: inquiry.id,
      created_at: inquiry.createdAt,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email || null,
      region: inquiry.region,
      store: inquiry.store,
      budget: inquiry.budget,
      channel: inquiry.channel || null,
      memo: inquiry.memo || null,
      ip: inquiry.ip,
      user_agent: inquiry.userAgent,
      device: inquiry.device,
      utm_source: inquiry.utmSource || null,
      utm_medium: inquiry.utmMedium || null,
      utm_campaign: inquiry.utmCampaign || null,
    });
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return;
  }

  await writeLocalInquiry(inquiry);
}

export async function listInquiries(): Promise<StoredInquiry[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase select failed: ${error.message}`);
    return (data ?? []).map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      name: row.name,
      phone: row.phone,
      email: row.email ?? "",
      region: row.region,
      store: row.store,
      budget: row.budget,
      channel: row.channel ?? "",
      memo: row.memo ?? "",
      ip: row.ip,
      userAgent: row.user_agent,
      device: row.device,
      utmSource: row.utm_source ?? "",
      utmMedium: row.utm_medium ?? "",
      utmCampaign: row.utm_campaign ?? "",
      privacyConsent: true,
    })) as StoredInquiry[];
  }

  return readLocalInquiries();
}
