import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { CONTACT, YEARS_IN_BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "브랜드 스토리",
  description:
    "철판 조리 방식으로 표준화한 맛, 마라·한방간장·약고추장 3색 소스. 계탉닭이 걸어온 브랜드 스토리와 철학을 소개합니다.",
  alternates: { canonical: "/brand" },
};

const TIMELINE = [
  { year: "2019", event: "성수동 1호점 오픈, 철판 닭갈비 조리 표준화 개발 착수" },
  { year: "2020", event: "약고추장 시그니처 소스 완성, 프랜차이즈 사업 준비" },
  { year: "2021", event: "가맹 1호점 오픈, 상권보호 정책 도입" },
  { year: "2022", event: "마라 철판 닭갈비 출시, 전국 가맹점 40개 돌파" },
  { year: "2024", event: "한방 간장 라인업 확장, 워크업 테이크아웃 매장 도입" },
  { year: "2025", event: "전국 가맹점 87개 돌파, 평균 재계약률 96% 달성" },
];

const VALUES = [
  {
    title: "철판, 표준의 시작",
    desc: "불맛은 감각이 아니라 온도와 시간의 함수입니다. 계탉닭은 철판 조리 공정을 수치화해 누구나 같은 결과를 낼 수 있도록 만들었습니다.",
  },
  {
    title: "소스가 브랜드다",
    desc: "마라의 얼얼함, 한방간장의 깊이, 약고추장의 전통 — 세 가지 색의 소스는 계탉닭을 다른 닭갈비 브랜드와 구분 짓는 가장 명확한 자산입니다.",
  },
  {
    title: "가맹점과 함께 만드는 확장",
    desc: "본사의 성장은 가맹점의 생존 위에 있습니다. 상권보호, 초기 매출 시뮬레이션, 슈퍼바이저 상주 지원으로 안정적인 확장을 최우선으로 합니다.",
  },
];

export default function BrandPage() {
  return (
    <>
      <section className="bg-iron-950 py-16 md:py-24 griddle-texture">
        <Container>
          <Reveal>
            <p className="text-sm font-bold tracking-wide text-ember-300">BRAND STORY</p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-white md:text-5xl">
              {YEARS_IN_BUSINESS}년간 철판 위에서
              <br />
              증명해온 맛의 표준
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ash-200 md:text-lg">
              계탉닭은 &ldquo;맛은 감각이 아니라 공정이다&rdquo;라는 철학으로 조리 표준화에 집중해온
              철판 닭갈비 전문 브랜드입니다.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ash-50 py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="BRAND VALUE" title="계탉닭이 지키는 세 가지 원칙" />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-iron-900/8 bg-white p-6 shadow-sm">
                  <div className="h-1.5 w-10 rounded-full bg-gradient-to-r from-ember-400 to-gochujang-500" />
                  <h3 className="mt-4 text-lg font-bold text-iron-950">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-iron-700">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ash-100 py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="BRAND HISTORY" title="계탉닭의 시간" />
          </Reveal>
          <div className="mt-10 space-y-0">
            {TIMELINE.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.05}>
                <div className="flex gap-6 border-l-2 border-iron-900/10 py-5 pl-6 first:pt-0">
                  <span className="font-display text-xl text-ember-500 md:w-20 md:shrink-0">{item.year}</span>
                  <p className="text-sm leading-relaxed text-iron-800 md:text-base">{item.event}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-iron-950 py-16 text-center md:py-20">
        <Container>
          <Reveal>
            <h2 className="font-display text-2xl text-white md:text-3xl">
              계탉닭의 철학에 공감하셨다면
            </h2>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="flex items-center justify-center rounded-xl bg-ember-500 px-7 text-base font-bold text-white"
                style={{ minHeight: 56 }}
              >
                무료 창업 상담 받기
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
              { name: "브랜드", path: "/brand" },
            ]),
          ),
        }}
      />
    </>
  );
}
