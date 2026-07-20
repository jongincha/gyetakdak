"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/constants";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-iron-900/8 rounded-2xl border border-iron-900/8 bg-white">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
              style={{ minHeight: 56 }}
            >
              <span className="text-base font-bold text-iron-950 md:text-lg">{item.q}</span>
              <span
                className={`shrink-0 text-xl text-ember-500 transition-transform ${isOpen ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            {isOpen && (
              <div id={`faq-panel-${i}`} className="px-5 pb-5 text-sm leading-relaxed text-iron-700 md:text-base">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
