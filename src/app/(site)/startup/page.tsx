import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { COST_ITEMS, CONTACT, FAQ_ITEMS, STARTUP_STEPS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "창업 안내 | 창업절차 · 개설비용",
  description:
    "계탉닭 가맹 창업절차 6단계와 평수별 개설비용을 안내합니다. 상담 신청부터 오픈까지 평균 40일, 투자금 회수기간 21개월.",
  alternates: { canonical: "/startup" },
};

const totalCost = COST_ITEMS.reduce((sum, item) => {
  const numeric = Number(item.amount.replace(/[^0-9]/g, ""));
  return sum + numeric;
}, 0);

export default function StartupPage() {
  return (
    <>
      <section className="bg-iron-950 py-16 md:py-20 griddle-texture">
        <Container>
          <Reveal>
            <p className="text-sm font-bold tracking-wide text-ember-300">STARTUP GUIDE</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-white md:text-5xl">
              창업절차와 개설비용, 투명하게 공개합니다
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ash-200 md:text-lg">
              상담 신청부터 오픈까지 평균 40일. 본사가 상권 분석, 시공, 교육을 함께 진행합니다.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ash-50 py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="STARTUP PROCESS" title="창업절차 6단계" />
          </Reveal>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STARTUP_STEPS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.05}>
                <li className="h-full rounded-2xl border border-iron-900/8 bg-white p-6 shadow-sm">
                  <span className="font-display text-3xl text-ember-500/80">{step.step}</span>
                  <h3 className="mt-3 text-base font-bold text-iron-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-iron-700">{step.desc}</p>
                  <p className="mt-3 text-xs font-semibold text-iron-600">소요기간 {step.duration}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-ash-100 py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="OPENING COST"
              title="개설비용 안내"
              description="33㎡(10평) 기준 예시이며, 실제 비용은 상권·평수·건물 상태에 따라 변동될 수 있습니다."
            />
          </Reveal>

          <Reveal delay={0.1} className="mt-10 overflow-hidden rounded-2xl border border-iron-900/8 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-iron-900/8 bg-ash-50 text-iron-600">
                    <th className="px-5 py-3 font-semibold">항목</th>
                    <th className="px-5 py-3 font-semibold">금액</th>
                    <th className="px-5 py-3 font-semibold">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_ITEMS.map((item) => (
                    <tr key={item.label} className="border-b border-iron-900/5 last:border-0">
                      <td className="px-5 py-4 font-medium text-iron-900">{item.label}</td>
                      <td className="px-5 py-4 font-semibold text-ember-500">{item.amount}</td>
                      <td className="px-5 py-4 text-iron-600">{item.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-iron-950">
                    <td className="px-5 py-4 font-bold text-white">총 예상 창업비용</td>
                    <td className="px-5 py-4 font-display text-lg text-ember-300" colSpan={2}>
                      약 {totalCost.toLocaleString("ko-KR")}원
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="mt-3 text-xs text-iron-500">
            * 부가세 별도, 점포 임대차 비용(보증금·권리금)은 별도이며 본사 개설비용에 포함되지 않습니다.
          </p>
        </Container>
      </section>

      <section className="bg-ash-50 py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="창업 문의 전 자주 묻는 질문" align="center" />
          </Reveal>
          <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
            <FaqAccordion />
          </Reveal>
        </Container>
      </section>

      <section className="bg-iron-950 py-16 text-center md:py-20">
        <Container>
          <Reveal>
            <h2 className="font-display text-2xl text-white md:text-3xl">
              나에게 맞는 창업 조건이 궁금하다면
            </h2>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="flex items-center justify-center rounded-xl bg-ember-500 px-7 text-base font-bold text-white"
                style={{ minHeight: 56 }}
              >
                맞춤 창업 상담 신청하기
              </Link>
              <a
                href={CONTACT.phoneHref}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 px-7 text-base font-bold text-white"
                style={{ minHeight: 56 }}
              >
                ☎ {CONTACT.phone}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "홈", path: "/" },
              { name: "창업안내", path: "/startup" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ_ITEMS)) }}
      />
    </>
  );
}
