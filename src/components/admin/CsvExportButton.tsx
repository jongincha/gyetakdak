"use client";

import type { StoredInquiry } from "@/lib/inquiry";

const HEADERS = [
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
  "Device",
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
];

function toCsvValue(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export default function CsvExportButton({ inquiries }: { inquiries: StoredInquiry[] }) {
  function handleExport() {
    const rows = inquiries.map((inquiry) => [
      inquiry.createdAt,
      inquiry.name,
      inquiry.phone,
      inquiry.email ?? "",
      inquiry.region,
      inquiry.store,
      inquiry.budget,
      inquiry.channel ?? "",
      inquiry.memo ?? "",
      inquiry.ip,
      inquiry.device,
      inquiry.utmSource ?? "",
      inquiry.utmMedium ?? "",
      inquiry.utmCampaign ?? "",
    ]);

    const csv = [HEADERS, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gyetakdak-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-lg border border-iron-900/15 px-4 py-2 text-sm font-semibold text-iron-800 hover:border-ember-500 hover:text-ember-500"
    >
      CSV 다운로드
    </button>
  );
}
