import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { CONTACT, MENU_ITEMS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "메뉴 소개",
  description:
    "마라 철판 닭갈비, 한방 간장 닭갈비, 약고추장 철판 닭갈비 등 계탉닭의 시그니처 메뉴 라인업을 소개합니다.",
  alternates: { canonical: "/menu" },
};

const SAUCE_COLORS: Record<string, string> = {
  mala: "from-gochujang-500 to-iron-900",
  "hanbang-soy": "from-soy-500 to-iron-900",
  yakgochujang: "from-ember-500 to-gochujang-500",
  "cheese-galbi": "from-ember-400 to-ember-600",
};

const SIDE_MENU = [
  { name: "볶음밥", price: "3,000원", desc: "철판에 남은 소스로 볶아내는 마무리 볶음밥" },
  { name: "치즈 추가", price: "3,000원", desc: "모짜렐라 치즈 토핑 추가" },
  { name: "사리 (당면/라면)", price: "2,500원", desc: "쫄깃한 당면 또는 라면사리 추가" },
  { name: "콜라 / 사이다", price: "2,000원", desc: "탄산음료 500ml" },
];

export default function MenuPage() {
  return (
    <>
      <section className="bg-iron-950 py-16 md:py-20 griddle-texture">
        <Container>
          <Reveal>
            <p className="text-sm font-bold tracking-wide text-ember-300">MENU</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-white md:text-5xl">
              한 철판, 세 가지 불맛
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ash-200 md:text-lg">
              마라·한방간장·약고추장, 취향이 다른 손님도 한 매장에서 모두 만족시키는 계탉닭 시그니처 라인업입니다.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ash-50 py-16 md:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {MENU_ITEMS.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.06}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-iron-900/8 bg-white shadow-sm">
                  <div
                    className={`flex h-40 items-end bg-gradient-to-br p-4 ${SAUCE_COLORS[item.slug]}`}
                    role="img"
                    aria-label={`${item.name} 이미지`}
                  >
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-xl font-bold text-iron-950">{item.name}</h2>
                      <span className="shrink-0 text-sm text-iron-600">{"🌶️".repeat(item.spice) || "순한맛"}</span>
                    </div>
                    <p className="text-xs font-medium text-iron-500">{item.nameEn}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-iron-700">{item.description}</p>
                    <p className="mt-4 text-lg font-bold text-ember-500">{item.price}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ash-100 py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="SIDE MENU" title="더 든든하게 즐기는 사이드 메뉴" />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SIDE_MENU.map((side, i) => (
              <Reveal key={side.name} delay={i * 0.05}>
                <div className="rounded-xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-iron-950">{side.name}</h3>
                    <span className="text-sm font-semibold text-ember-500">{side.price}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-iron-600">{side.desc}</p>
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
              이 메뉴, 내 상권에서도 통할까요?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-ash-200 md:text-base">
              희망 상권의 예상 매출과 경쟁 현황을 무료로 분석해드립니다.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="flex items-center justify-center rounded-xl bg-ember-500 px-7 text-base font-bold text-white"
                style={{ minHeight: 56 }}
              >
                무료 상권분석 신청하기
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
              { name: "메뉴", path: "/menu" },
            ]),
          ),
        }}
      />
    </>
  );
}
