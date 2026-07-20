import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import { AVG_MONTHLY_REVENUE, NATIONWIDE_STORE_COUNT } from "@/lib/constants";

const STATS = [
  { value: NATIONWIDE_STORE_COUNT, suffix: "개", label: "전국 가맹점 수" },
  { value: 96, suffix: "%", label: "가맹점 재계약률" },
  { value: 21, suffix: "개월", label: "평균 투자금 회수기간" },
];

export default function SuccessStats() {
  return (
    <section className="bg-ash-50 py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="SUCCESS STORY"
            title="숫자로 증명하는 계탉닭의 성장"
            description="실제 가맹점 데이터를 기반으로 안정적인 투자 회수 구조를 설계합니다."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="rounded-2xl border border-iron-900/8 bg-white p-6 text-center shadow-sm">
                <CountUp
                  to={stat.value}
                  suffix={stat.suffix}
                  className="font-display text-4xl text-ember-500 md:text-5xl"
                />
                <p className="mt-2 text-sm font-semibold text-iron-800">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-6 rounded-2xl bg-iron-950 p-6 text-center md:p-8">
            <p className="text-sm text-ash-300">가맹점 평균 월매출</p>
            <p className="mt-1 font-display text-4xl text-white md:text-5xl">{AVG_MONTHLY_REVENUE}</p>
            <p className="mt-2 text-xs text-ash-300">
              * 2025년 기준 전국 가맹점 실매출 데이터 평균이며 상권·규모에 따라 상이할 수 있습니다.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
