import Link from "next/link";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/constants";

export default function FinalCta() {
  return (
    <section className="bg-gradient-to-br from-ember-600 via-ember-500 to-gochujang-500 py-16 md:py-20">
      <Container className="text-center">
        <Reveal>
          <h2 className="font-display text-3xl text-white md:text-4xl">
            지금, 계탉닭과 함께 시작하세요
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            상권 분석부터 오픈까지, 본사가 끝까지 함께합니다. 부담 없이 무료 상담을 신청해보세요.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="flex items-center justify-center rounded-xl bg-white px-8 text-base font-bold text-ember-600 transition-transform hover:scale-[1.02]"
              style={{ minHeight: 56 }}
            >
              무료 창업 상담 신청하기
            </Link>
            <a
              href={CONTACT.phoneHref}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/60 px-8 text-base font-bold text-white"
              style={{ minHeight: 56 }}
            >
              ☎ {CONTACT.phone}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
