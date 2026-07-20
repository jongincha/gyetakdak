import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { MENU_ITEMS } from "@/lib/constants";

const SAUCE_COLORS: Record<string, string> = {
  mala: "from-gochujang-500 to-iron-900",
  "hanbang-soy": "from-soy-500 to-iron-900",
  yakgochujang: "from-ember-500 to-gochujang-500",
  "cheese-galbi": "from-ember-400 to-ember-600",
};

export default function MenuPreview() {
  return (
    <section className="bg-iron-950 py-16 md:py-24 griddle-texture">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="SIGNATURE MENU"
            title="한 매장, 세 가지 불맛"
            description="같은 철판, 다른 소스로 손님 취향에 맞춘 라인업을 완성합니다."
            light
          />
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {MENU_ITEMS.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.06}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className={`h-32 bg-gradient-to-br ${SAUCE_COLORS[item.slug]}`} aria-hidden />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-ember-500/15 px-3 py-1 text-xs font-bold text-ember-300">
                      {item.tag}
                    </span>
                    <span className="text-xs text-ash-300">{"🌶️".repeat(item.spice) || "순한맛"}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-white">{item.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ash-300">{item.description}</p>
                  <p className="mt-3 text-sm font-semibold text-ember-300">{item.price}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-1 text-sm font-bold text-white underline decoration-ember-400 decoration-2 underline-offset-4"
            >
              전체 메뉴 보러가기 →
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
