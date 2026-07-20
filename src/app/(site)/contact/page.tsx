import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import InquiryForm from "@/components/sections/InquiryForm";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "가맹문의",
  description:
    "계탉닭 가맹창업이 궁금하다면 지금 무료 상담을 신청하세요. 전화, 카카오톡, 온라인 문의 모두 가능합니다.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-iron-950 py-14 md:py-20 griddle-texture">
        <Container>
          <Reveal>
            <p className="text-sm font-bold tracking-wide text-ember-300">CONTACT</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-white md:text-5xl">
              가맹문의
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ash-200 md:text-lg">
              아래 정보를 남겨주시면 담당자가 영업일 기준 1일 이내로 연락드립니다. 급하신 경우
              전화나 카카오톡으로 바로 문의해주세요.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ash-50 py-12 md:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <Reveal className="space-y-4">
            <a
              href={CONTACT.phoneHref}
              className="flex items-center gap-4 rounded-2xl border border-iron-900/8 bg-white p-5 shadow-sm transition-colors hover:border-ember-500/40"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ember-500/10 text-xl">
                ☎
              </span>
              <div>
                <p className="text-sm text-iron-500">전화상담</p>
                <p className="text-lg font-bold text-iron-950">{CONTACT.phone}</p>
              </div>
            </a>

            <a
              href={CONTACT.kakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-iron-900/8 bg-white p-5 shadow-sm transition-colors hover:border-ember-500/40"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ember-500/10 text-xl">
                💬
              </span>
              <div>
                <p className="text-sm text-iron-500">카카오톡 상담</p>
                <p className="text-lg font-bold text-iron-950">{CONTACT.kakaoHandle}</p>
              </div>
            </a>

            <div className="rounded-2xl border border-iron-900/8 bg-white p-5 shadow-sm">
              <p className="text-sm text-iron-500">본사 안내</p>
              <p className="mt-1 text-sm leading-relaxed text-iron-800">{CONTACT.hqAddress}</p>
              <p className="mt-2 text-sm text-iron-800">{CONTACT.businessHours}</p>
              <p className="mt-2 text-sm text-iron-800">{CONTACT.email}</p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <InquiryForm />
          </Reveal>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "홈", path: "/" },
              { name: "가맹문의", path: "/contact" },
            ]),
          ),
        }}
      />
    </>
  );
}
