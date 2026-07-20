"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTACT, NAV_LINKS } from "@/lib/constants";

export default function MobileNavToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`block h-0.5 w-6 bg-iron-950 transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`block h-0.5 w-6 bg-iron-950 transition-opacity ${open ? "opacity-0" : ""}`} />
        <span
          className={`block h-0.5 w-6 bg-iron-950 transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 top-16 bottom-0 z-30 overflow-y-auto bg-ash-50 px-6 py-8"
        >
          <nav className="flex flex-col gap-1" aria-label="모바일 메뉴">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-iron-900/5 py-4 text-lg font-semibold text-iron-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={CONTACT.phoneHref}
            className="mt-8 block w-full rounded-xl border-2 border-iron-900 py-4 text-center text-base font-bold text-iron-900"
            style={{ minHeight: 56 }}
          >
            ☎ {CONTACT.phone} 전화상담
          </a>
        </div>
      )}
    </div>
  );
}
