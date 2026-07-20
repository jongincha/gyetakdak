import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { STARTUP_STEPS } from "@/lib/constants";

export default function StartupStepsPreview() {
  const steps = STARTUP_STEPS.slice(0, 4);

  return (
    <section className="bg-ash-100 py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="STARTUP PROCESS"
            title="상담부터 오픈까지, 평균 40일"
            description="상담 신청 후 표준화된 6단계 프로세스로 빠르고 안정적인 오픈을 지원합니다."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.06}>
              <div className="h-full rounded-2xl bg-white p-6 shadow-sm">
                <span className="font-display text-3xl text-ember-500/80">{step.step}</span>
                <h3 className="mt-3 text-base font-bold text-iron-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-iron-700">{step.desc}</p>
                <p className="mt-3 text-xs font-semibold text-iron-600">소요기간 {step.duration}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 text-center">
            <Link
              href="/startup"
              className="inline-flex items-center gap-1 text-sm font-bold text-iron-950 underline decoration-ember-500 decoration-2 underline-offset-4"
            >
              창업절차 전체 & 개설비용 확인하기 →
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
