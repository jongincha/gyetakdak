import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const PILLARS = [
  {
    title: "표준화된 철판 조리법",
    desc: "온도·시간·계량을 표준화한 조리 매뉴얼로 조리 경험이 없어도 동일한 맛을 재현합니다.",
  },
  {
    title: "3색 시그니처 소스",
    desc: "마라·한방간장·약고추장 3가지 소스로 취향이 다른 손님까지 한 매장에서 모두 만족시킵니다.",
  },
  {
    title: "상권보호 & 본사 동행",
    desc: "계약 시 상권보호 범위를 명시하고, 오픈 전후 슈퍼바이저가 현장에 직접 방문해 지원합니다.",
  },
];

export default function BrandPillars() {
  return (
    <section className="bg-ash-50 py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="WHY 계탉닭"
            title="맛의 차별화가 곧 매출의 차별화입니다"
            description="계탉닭은 철판이라는 조리 방식 하나로 표준화, 차별화, 확장성을 동시에 해결합니다."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-iron-900/8 bg-white p-6 shadow-sm">
                <div className="h-1.5 w-10 rounded-full bg-gradient-to-r from-ember-400 to-gochujang-500" />
                <h3 className="mt-4 text-lg font-bold text-iron-950">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-iron-700">{pillar.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
