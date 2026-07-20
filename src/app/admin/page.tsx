import type { Metadata } from "next";
import { verifyAdminSession } from "@/lib/dal";
import { listInquiries } from "@/lib/db";
import { STORE_OPTIONS } from "@/lib/inquiry";
import { isGoogleSheetsConfigured } from "@/lib/googleSheets";
import { isSupabaseConfigured } from "@/lib/db";
import { logoutAction } from "@/app/admin/actions";
import CsvExportButton from "@/components/admin/CsvExportButton";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  await verifyAdminSession();
  const inquiries = await listInquiries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-iron-950">창업문의 목록</h1>
          <p className="mt-1 text-sm text-iron-600">총 {inquiries.length}건의 문의가 접수되었습니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <CsvExportButton inquiries={inquiries} />
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-iron-900/15 px-4 py-2 text-sm font-semibold text-iron-600 hover:border-gochujang-500 hover:text-gochujang-500"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span
          className={`rounded-full px-3 py-1 font-semibold ${
            isSupabaseConfigured ? "bg-ember-500/10 text-ember-600" : "bg-iron-900/5 text-iron-500"
          }`}
        >
          Supabase {isSupabaseConfigured ? "연동됨" : "미연동 (로컬 파일 저장 중)"}
        </span>
        <span
          className={`rounded-full px-3 py-1 font-semibold ${
            isGoogleSheetsConfigured ? "bg-ember-500/10 text-ember-600" : "bg-iron-900/5 text-iron-500"
          }`}
        >
          Google Sheets {isGoogleSheetsConfigured ? "연동됨" : "미연동"}
        </span>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-iron-900/8 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-iron-900/8 bg-ash-50 text-iron-600">
              <th className="px-4 py-3 font-semibold">접수일시</th>
              <th className="px-4 py-3 font-semibold">고객명</th>
              <th className="px-4 py-3 font-semibold">연락처</th>
              <th className="px-4 py-3 font-semibold">이메일</th>
              <th className="px-4 py-3 font-semibold">창업지역</th>
              <th className="px-4 py-3 font-semibold">점포보유</th>
              <th className="px-4 py-3 font-semibold">예상비용</th>
              <th className="px-4 py-3 font-semibold">유입경로</th>
              <th className="px-4 py-3 font-semibold">메모</th>
              <th className="px-4 py-3 font-semibold">Device</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-iron-400">
                  아직 접수된 문의가 없습니다.
                </td>
              </tr>
            )}
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="border-b border-iron-900/5 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-iron-600">
                  {new Date(inquiry.createdAt).toLocaleString("ko-KR")}
                </td>
                <td className="px-4 py-3 font-medium text-iron-900">{inquiry.name}</td>
                <td className="px-4 py-3 text-iron-800">{inquiry.phone}</td>
                <td className="px-4 py-3 text-iron-600">{inquiry.email || "-"}</td>
                <td className="px-4 py-3 text-iron-800">{inquiry.region}</td>
                <td className="px-4 py-3 text-iron-600">
                  {STORE_OPTIONS.find((o) => o.value === inquiry.store)?.label ?? inquiry.store}
                </td>
                <td className="px-4 py-3 text-iron-600">{inquiry.budget}</td>
                <td className="px-4 py-3 text-iron-600">{inquiry.channel || "-"}</td>
                <td className="max-w-[220px] truncate px-4 py-3 text-iron-600" title={inquiry.memo}>
                  {inquiry.memo || "-"}
                </td>
                <td className="px-4 py-3 text-iron-500">{inquiry.device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
