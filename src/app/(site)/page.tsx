import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import BrandPillars from "@/components/sections/BrandPillars";
import MenuPreview from "@/components/sections/MenuPreview";
import StartupStepsPreview from "@/components/sections/StartupStepsPreview";
import SuccessStats from "@/components/sections/SuccessStats";
import FaqSection from "@/components/sections/FaqSection";
import FinalCta from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "닭갈비 프랜차이즈 창업 | 계탉닭",
  description:
    "마라·한방간장·약고추장 3색 소스의 철판 닭갈비 프랜차이즈, 계탉닭. 소자본 외식창업을 고민 중이라면 지금 무료 상담을 받아보세요.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <BrandPillars />
      <MenuPreview />
      <StartupStepsPreview />
      <SuccessStats />
      <FaqSection />
      <FinalCta />
    </>
  );
}
