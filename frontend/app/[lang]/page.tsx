import PageProvider from "@/providers/page-provider";
import Body from "./landing/body";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { constructMetadata } from "@/components/common/metadata";
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang === "bn" ? "bn" : "en";

  return constructMetadata({
    title: { bn: "মূল্যায়ন অ্যাপ", en: "Mulyayon App" },
    description: { bn: "কাজ হোক প্রমাণ", en: "Let Your Work Speak" },
    path: "",
    locale,
  });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang === "bn" ? "bn" : "en";     

  return (
    <PageProvider 
      header={<Header locale={locale} />} 
      footer={<Footer locale={locale} />} 
      navbar={<Navbar locale={locale} />} 
      sidebar={<Sidebar locale={locale} />}
    >
      <Body locale={locale} />
    </PageProvider>
  );
}