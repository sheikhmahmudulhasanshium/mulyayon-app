import PageProvider from "@/providers/page-provider";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import Body from "./body";
import { constructMetadata } from "@/components/common/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang === "bn" ? "bn" : "en";

  return constructMetadata({
    title: { bn: "সাইন ইন | মূল্যায়ন অ্যাপ", en: "Sign In | Mulyayon App" },
    description: { bn: "আপনার পোর্টালে প্রবেশ করতে সাইন ইন করুন", en: "Sign in to access your portal" },
    path: "/sign-in",
    locale,
  });
}

export default async function SignInPage({ params }: { params: Promise<{ lang: string }> }) {
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