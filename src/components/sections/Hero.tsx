"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AVG_MONTHLY_REVENUE, CONTACT, NATIONWIDE_STORE_COUNT } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import CountUp from "@/components/ui/CountUp";

const GROWTH_POINTS = [
  { year: "2020", value: 18 },
  { year: "2021", value: 27 },
  { year: "2022", value: 41 },
  { year: "2023", value: 58 },
  { year: "2024", value: 74 },
  { year: "2025", value: 87 },
];

function buildPath(points: number[], w: number, h: number) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const step = w / (points.length - 1);
  return points
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function Hero() {
  const values = GROWTH_POINTS.map((p) => p.value);
  const linePath = buildPath(values, 280, 90);

  return (
    <section className="relative overflow-hidden bg-iron-950 griddle-texture">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:gap-8 md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-bold tracking-wide text-ember-300">
            소자본 외식창업 · 닭갈비 프랜차이즈
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.15] text-white sm:text-5xl md:text-6xl">
            철판 위에서
            <br />
            <span className="text-ember-gradient">불맛</span>으로 완성하는
            <br />
            프리미엄 닭갈비
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ash-200 md:text-lg">
            마라·한방간장·약고추장, 계탉닭만의 3색 소스 라인업으로 상권 내 대체 불가능한 포지셔닝을 만듭니다.
            지금 무료 창업 상담을 받아보세요.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              onClick={() => trackEvent("cta_click_inquiry", { location: "hero" })}
              className="flex items-center justify-center rounded-xl bg-ember-500 px-7 text-base font-bold text-white transition-colors hover:bg-ember-600"
              style={{ minHeight: 56 }}
            >
              무료 창업 상담 받기
            </Link>
            <a
              href={CONTACT.phoneHref}
              onClick={() => trackEvent("cta_click_phone", { location: "hero" })}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 px-7 text-base font-bold text-white transition-colors hover:border-white/40"
              style={{ minHeight: 56 }}
            >
              ☎ {CONTACT.phone}
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div>
              <CountUp to={NATIONWIDE_STORE_COUNT} suffix="개" className="font-display text-2xl text-white md:text-3xl" />
              <p className="mt-1 text-xs text-ash-300 md:text-sm">전국 가맹점</p>
            </div>
            <div>
              <p className="font-display text-2xl text-white md:text-3xl">{AVG_MONTHLY_REVENUE}</p>
              <p className="mt-1 text-xs text-ash-300 md:text-sm">평균 월매출</p>
            </div>
            <div>
              <CountUp to={6} suffix="년" className="font-display text-2xl text-white md:text-3xl" />
              <p className="mt-1 text-xs text-ash-300 md:text-sm">브랜드 운영 노하우</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative mx-auto aspect-square max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-br from-iron-800 via-iron-900 to-iron-950 p-8 shadow-2xl">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-ember-500/30 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-gochujang-500/30 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ember-300">Griddle 210&deg;C</p>
                <div className="relative mt-4 h-40 w-full overflow-hidden rounded-2xl border border-white/10 bg-iron-950">
                  <div className="absolute inset-0 opacity-80" style={{
                    background:
                      "radial-gradient(circle at 30% 40%, rgba(239,90,31,0.55), transparent 55%), radial-gradient(circle at 70% 70%, rgba(194,42,60,0.5), transparent 50%), radial-gradient(circle at 50% 20%, rgba(248,129,63,0.35), transparent 45%)",
                  }} />
                  <div className="absolute inset-0 mix-blend-overlay" style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 24px)",
                  }} />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white/5 p-4">
                <p className="text-xs font-semibold text-ash-300">가맹점 성장 추이 (개점 누적)</p>
                <svg viewBox="0 0 280 90" className="mt-2 h-16 w-full" preserveAspectRatio="none">
                  <path d={linePath} fill="none" stroke="url(#heroGradient)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f8813f" />
                      <stop offset="100%" stopColor="#c22a3c" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="mt-1 flex justify-between text-[10px] text-ash-300">
                  <span>{GROWTH_POINTS[0].year}</span>
                  <span>{GROWTH_POINTS[GROWTH_POINTS.length - 1].year}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
