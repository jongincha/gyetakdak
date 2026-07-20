import Link from "next/link";
import { BRAND_NAME, CONTACT, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-iron-900/10 bg-iron-950 pb-24 text-ash-200 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-2xl text-white">{BRAND_NAME}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ash-300">
              철판 위에서 완성하는 프리미엄 닭갈비 프랜차이즈. 전국 가맹 문의는 언제든 환영합니다.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm md:grid-cols-1" aria-label="푸터 메뉴">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-ash-300 hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="text-sm text-ash-300">
            <p>본사: {CONTACT.hqAddress}</p>
            <p className="mt-1">대표전화: {CONTACT.phone}</p>
            <p className="mt-1">이메일: {CONTACT.email}</p>
            <p className="mt-1">운영시간: {CONTACT.businessHours}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-ash-300/70">
          <p>사업자등록번호 000-00-00000 | 대표 홍길동 | 통신판매업신고 제0000-서울성동-0000호</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
