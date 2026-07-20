import type { Metadata } from "next";
import { Noto_Sans_KR, Black_Han_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyMobileCta from "@/components/layout/StickyMobileCta";
import { BRAND_NAME, BRAND_TAGLINE, SITE_URL } from "@/lib/constants";
import { organizationJsonLd, restaurantJsonLd } from "@/lib/jsonld";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const blackHanSans = Black_Han_Sans({
  variable: "--font-black-han-sans",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} 가맹창업 | ${BRAND_TAGLINE}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    "계탉닭은 마라·한방간장·약고추장 철판 닭갈비로 차별화된 소자본 외식창업 프랜차이즈입니다. 지금 무료 창업 상담을 받아보세요.",
  keywords: [
    "닭갈비 창업",
    "닭갈비 프랜차이즈",
    "철판닭갈비",
    "소자본창업",
    "프랜차이즈창업",
    "외식창업",
    "음식점창업",
    "마라닭갈비",
    "계탉닭",
    "닭갈비 맛집",
    "성수동 맛집",
    "홍대 맛집",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} 가맹창업 | ${BRAND_TAGLINE}`,
    description: "마라·한방간장·약고추장 철판 닭갈비 프랜차이즈, 계탉닭 창업 상담을 무료로 받아보세요.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: BRAND_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} 가맹창업 | ${BRAND_TAGLINE}`,
    description: "마라·한방간장·약고추장 철판 닭갈비 프랜차이즈, 계탉닭 창업 상담을 무료로 받아보세요.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const NAVER_ANALYTICS_ID = process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${blackHanSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-ash-50 text-iron-950">
        {GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        {META_PIXEL_ID && (
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
          </Script>
        )}
        {NAVER_ANALYTICS_ID && (
          <Script id="naver-analytics-script" strategy="afterInteractive" src="//wcs.naver.net/wcslog.js" />
        )}
        {NAVER_ANALYTICS_ID && (
          <Script id="naver-analytics-config" strategy="afterInteractive">
            {`if(!window.wcs_add) window.wcs_add={};window.wcs_add["wa"]="${NAVER_ANALYTICS_ID}";if(window.wcs){wcs_do();}`}
          </Script>
        )}

        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyMobileCta />
      </body>
    </html>
  );
}
