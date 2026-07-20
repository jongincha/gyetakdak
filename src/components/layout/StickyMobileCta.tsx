"use client";

import { CONTACT } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export default function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex border-t border-iron-800/10 bg-white/95 backdrop-blur supports-backdrop-blur:bg-white/80 shadow-[0_-4px_16px_rgba(23,19,15,0.08)] md:hidden">
      <a
        href={CONTACT.phoneHref}
        onClick={() => trackEvent("cta_click_phone", { location: "sticky_bar" })}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-iron-900 active:bg-ash-100"
        style={{ minHeight: 56 }}
      >
        <span className="text-lg leading-none" aria-hidden>
          ☎
        </span>
        <span className="text-[13px] font-semibold">전화상담</span>
      </a>
      <a
        href={CONTACT.kakaoUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("cta_click_kakao", { location: "sticky_bar" })}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 border-x border-iron-800/10 py-2.5 text-iron-900 active:bg-ash-100"
        style={{ minHeight: 56 }}
      >
        <span className="text-lg leading-none" aria-hidden>
          💬
        </span>
        <span className="text-[13px] font-semibold">카톡상담</span>
      </a>
      <a
        href="/contact"
        onClick={() => trackEvent("cta_click_inquiry", { location: "sticky_bar" })}
        className="flex flex-[1.3] flex-col items-center justify-center gap-0.5 bg-ember-500 py-2.5 text-white active:bg-ember-600"
        style={{ minHeight: 56 }}
      >
        <span className="text-lg leading-none" aria-hidden>
          📝
        </span>
        <span className="text-[13px] font-bold">무료 창업문의</span>
      </a>
    </div>
  );
}
