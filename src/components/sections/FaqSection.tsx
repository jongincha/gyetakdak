import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { FAQ_ITEMS } from "@/lib/constants";
import { faqJsonLd } from "@/lib/jsonld";

export default function FaqSection() {
  return (
    <section className="bg-ash-100 py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="가맹 문의 전 자주 묻는 질문" align="center" />
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <FaqAccordion />
        </Reveal>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ_ITEMS)) }}
      />
    </section>
  );
}
