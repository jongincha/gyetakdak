import { google } from "googleapis";
import type { StoredInquiry } from "@/lib/inquiry";
import { STORE_OPTIONS } from "@/lib/inquiry";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const SHEET_TAB = process.env.GOOGLE_SHEET_TAB ?? "문의목록";

export const isGoogleSheetsConfigured = Boolean(SHEET_ID && CLIENT_EMAIL && PRIVATE_KEY);

const HEADER_ROW = [
  "접수일시",
  "고객명",
  "연락처",
  "이메일",
  "창업지역",
  "점포보유여부",
  "예상창업비용",
  "유입경로",
  "메모",
  "IP",
  "브라우저",
  "Device",
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
];

/** Appends one row to the Google Sheet configured via env vars. No-ops silently when not configured (e.g. local dev). */
export async function appendInquiryToSheet(inquiry: StoredInquiry): Promise<void> {
  if (!isGoogleSheetsConfigured) return;

  const auth = new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const storeLabel = STORE_OPTIONS.find((o) => o.value === inquiry.store)?.label ?? inquiry.store;

  const row = [
    inquiry.createdAt,
    inquiry.name,
    inquiry.phone,
    inquiry.email ?? "",
    inquiry.region,
    storeLabel,
    inquiry.budget,
    inquiry.channel ?? "",
    inquiry.memo ?? "",
    inquiry.ip,
    inquiry.userAgent,
    inquiry.device,
    inquiry.utmSource ?? "",
    inquiry.utmMedium ?? "",
    inquiry.utmCampaign ?? "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A:O`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

/** Ensures the sheet has a header row. Call once from an admin/setup script, not on every request. */
export async function ensureSheetHeader(): Promise<void> {
  if (!isGoogleSheetsConfigured) return;

  const auth = new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A1:O1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [HEADER_ROW] },
  });
}
