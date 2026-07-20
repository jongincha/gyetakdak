import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyMobileCta from "@/components/layout/StickyMobileCta";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyMobileCta />
    </>
  );
}
