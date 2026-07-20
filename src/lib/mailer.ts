import nodemailer from "nodemailer";
import type { StoredInquiry } from "@/lib/inquiry";
import { STORE_OPTIONS } from "@/lib/inquiry";
import { BRAND_NAME } from "@/lib/constants";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.INQUIRY_ADMIN_EMAIL;
const MAIL_FROM = process.env.MAIL_FROM ?? "no-reply@gyetakdak.co.kr";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

export const isEmailConfigured = Boolean(ADMIN_EMAIL && (RESEND_API_KEY || (SMTP_HOST && SMTP_USER && SMTP_PASS)));

function renderInquiryEmailHtml(inquiry: StoredInquiry): string {
  const storeLabel = STORE_OPTIONS.find((o) => o.value === inquiry.store)?.label ?? inquiry.store;
  const rows: [string, string][] = [
    ["접수일시", inquiry.createdAt],
    ["고객명", inquiry.name],
    ["연락처", inquiry.phone],
    ["이메일", inquiry.email || "-"],
    ["창업지역", inquiry.region],
    ["점포보유여부", storeLabel],
    ["예상창업비용", inquiry.budget],
    ["유입경로", inquiry.channel || "-"],
    ["메모", inquiry.memo || "-"],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e6dccb;font-weight:600;color:#3a3129;white-space:nowrap;">${label}</td><td style="padding:8px 12px;border:1px solid #e6dccb;color:#17130f;">${value}</td></tr>`,
    )
    .join("");

  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
    <h2 style="color:#d8430f;">${BRAND_NAME} 신규 창업문의</h2>
    <table style="border-collapse:collapse;width:100%;">${rowsHtml}</table>
  </div>`;
}

/** Notifies the admin inbox of a new inquiry via Resend (preferred) or SMTP. No-ops silently when unconfigured. */
export async function sendInquiryNotification(inquiry: StoredInquiry): Promise<void> {
  if (!isEmailConfigured || !ADMIN_EMAIL) return;

  const subject = `[${BRAND_NAME}] 신규 창업문의 - ${inquiry.name}님 (${inquiry.region})`;
  const html = renderInquiryEmailHtml(inquiry);

  if (RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [ADMIN_EMAIL],
        subject,
        html,
      }),
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: MAIL_FROM,
    to: ADMIN_EMAIL,
    subject,
    html,
  });
}
