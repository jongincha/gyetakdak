import { MONTHLY_REVENUE_TREND } from "@/lib/constants";

export default function MonthlyRevenueChart() {
  const max = Math.max(...MONTHLY_REVENUE_TREND.map((d) => d.value));

  return (
    <div className="rounded-2xl border border-iron-900/8 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-iron-700">가맹점 평균 월매출 추이 (단위: 만원)</p>
        <p className="font-display text-2xl text-ember-500">
          {MONTHLY_REVENUE_TREND[MONTHLY_REVENUE_TREND.length - 1].value.toLocaleString("ko-KR")}
        </p>
      </div>

      <div className="mt-6 flex h-40 items-end gap-2 sm:gap-3">
        {MONTHLY_REVENUE_TREND.map((point) => (
          <div
            key={point.month}
            className="flex-1 rounded-t-md bg-gradient-to-t from-ember-600 to-ember-400"
            style={{ height: `${Math.max((point.value / max) * 100, 6)}%` }}
            role="img"
            aria-label={`${point.month} 평균 월매출 ${point.value.toLocaleString("ko-KR")}만원`}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3">
        {MONTHLY_REVENUE_TREND.map((point) => (
          <span key={point.month} className="flex-1 text-center text-[10px] text-iron-500 sm:text-xs">
            {point.month}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs text-iron-500">
        * 최근 12개월 전국 가맹점 실매출 평균 데이터이며, 상권·규모·계절 요인에 따라 변동될 수 있습니다.
      </p>
    </div>
  );
}
