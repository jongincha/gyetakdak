import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import MonthlyRevenueChart from "@/components/sections/MonthlyRevenueChart";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { CONTACT, NATIONWIDE_STORE_COUNT, REGIONAL_STORES, SUCCESS_CASES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "성공사례 | 가맹점 매출 · 전국매장",
  description:
    "계탉닭 가맹점의 실제 성공사례와 월매출 추이, 전국 87개 매장 현황을 확인하세요. 데이터로 증명하는 안정적인 창업 파트너입니다.",
  alternates: { canonical: "/success" },
};

export default function SuccessPage() {
  const totalStores = REGIONAL_STORES.reduce((sum, r) => sum + r.count, 0);

  return (
    <>
      <section className="bg-iron-950 py-16 md:py-20 griddle-texture">
        <Container>
          <Reveal>
            <p className="text-sm font-bold tracking-wide text-ember-300">SUCCESS STORY</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-white md:text-5xl">
              숫자와 목소리로 증명하는 계탉닭
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ash-200 md:text-lg">
              전국 {NATIONWIDE_STORE_COUNT}개 가맹점의 실제 매출 데이터와 점주 인터뷰를 가감 없이 공개합니다.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ash-50 py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="MONTHLY REVENUE" title="가맹점 월매출 추이" />
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <MonthlyRevenueChart />
          </Reveal>
        </Container>
      </section>

      <section className="bg-ash-100 py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="FRANCHISEE VOICE" title="점주들이 직접 전하는 계탉닭" />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SUCCESS_CASES.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-iron-900/8 bg-white p-6 shadow-sm">
                  <p className="text-sm leading-relaxed text-iron-800">&ldquo;{c.quote}&rdquo;</p>
                  <div className="mt-5 border-t border-iron-900/8 pt-4">
                    <p className="text-sm font-bold text-iron-950">{c.name}</p>
                    <p className="text-xs text-iron-500">{c.region} · {c.openedAt}</p>
                    <p className="mt-2 text-xs font-semibold text-ember-500">{c.revenueGrowth}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ash-50 py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="NATIONWIDE STORES"
              title="전국 어디서나, 계탉닭"
              description="지도 기반 매장 찾기는 카카오맵 연동 시 제공됩니다. 아래는 권역별 가맹점 현황입니다."
            />
          </Reveal>

          <Reveal delay={0.1} className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="relative overflow-hidden rounded-2xl border border-iron-900/8 bg-iron-950 p-8">
              <div className="griddle-texture absolute inset-0" />
              <div className="relative flex h-full flex-col items-center justify-center text-center">
                <CountUp to={totalStores} suffix="개" className="font-display text-5xl text-white md:text-6xl" />
                <p className="mt-2 text-sm text-ash-300">전국 가맹점 (2025년 기준)</p>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-3">
              {REGIONAL_STORES.map((region) => (
                <li
                  key={region.region}
                  className="flex items-center justify-between rounded-xl border border-iron-900/8 bg-white px-4 py-3"
                >
                  <span className="text-sm font-medium text-iron-800">{region.region}</span>
                  <span className="font-display text-lg text-ember-500">{region.count}개</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="bg-iron-950 py-16 text-center md:py-20">
        <Container>
          <Reveal>
            <h2 className="font-display text-2xl text-white md:text-3xl">
              다음 성공사례의 주인공이 되어보세요
            </h2>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="flex items-center justify-center rounded-xl bg-ember-500 px-7 text-base font-bold text-white"
                style={{ minHeight: 56 }}
              >
                무료 창업 상담 신청하기
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
              { name: "성공사례", path: "/success" },
            ]),
          ),
        }}
      />
    </>
  );
}
