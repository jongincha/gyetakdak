import Link from "next/link";
import { BRAND_NAME, CONTACT, NAV_LINKS } from "@/lib/constants";
import MobileNavToggle from "@/components/layout/MobileNavToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-iron-900/5 bg-ash-50/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-8">
        <Link href="/" className="font-display text-2xl tracking-tight text-iron-950 md:text-3xl">
          {BRAND_NAME}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="주요 메뉴">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-iron-800 transition-colors hover:text-ember-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={CONTACT.phoneHref}
            className="text-sm font-semibold text-iron-800 hover:text-ember-500"
          >
            {CONTACT.phone}
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-ember-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-ember-600"
          >
            무료 상담 받기
          </Link>
        </div>

        <MobileNavToggle />
      </div>
    </header>
  );
}
