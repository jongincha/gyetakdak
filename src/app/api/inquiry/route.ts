import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { detectDevice, inquirySchema } from "@/lib/inquiry";
import { buildStoredInquiry, saveInquiry } from "@/lib/db";
import { appendInquiryToSheet } from "@/lib/googleSheets";
import { sendInquiryNotification } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot: a hidden field real users never fill. If populated, pretend success.
    if (typeof body?.website === "string" && body.website.length > 0) {
      return NextResponse.json({ success: true, message: "문의가 정상 접수되었습니다." });
    }

    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = z.treeifyError(parsed.error);
      return NextResponse.json(
        { success: false, message: "입력값을 다시 확인해주세요.", issues: firstIssue },
        { status: 400 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const userAgent = request.headers.get("user-agent") ?? "unknown";

    const inquiry = buildStoredInquiry(parsed.data, {
      ip,
      userAgent,
      device: detectDevice(userAgent),
    });

    await saveInquiry(inquiry);

    const results = await Promise.allSettled([
      appendInquiryToSheet(inquiry),
      sendInquiryNotification(inquiry),
    ]);

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Inquiry side-effect failed:", result.reason);
      }
    }

    return NextResponse.json({ success: true, message: "문의가 정상 접수되었습니다." });
  } catch (error) {
    console.error("Failed to process inquiry:", error);
    return NextResponse.json(
      { success: false, message: "잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
