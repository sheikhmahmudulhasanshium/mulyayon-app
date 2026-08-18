import PageProvider from "@/providers/page-provider";
import Body from "./body";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { constructMetadata } from "@/components/common/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang === "bn" ? "bn" : "en";

  return constructMetadata({
    title: {
      bn: "সাধারণ জিজ্ঞাসা | মূল্যায়ন",
      en: "Frequently Asked Questions | Mulyayon",
    },
    description: {
      bn: "মূল্যায়ন প্ল্যাটফর্ম সম্পর্কে সাধারণ প্রশ্নের উত্তর।",
      en: "Answers to common questions about the Mulyayon platform.",
    },
    path: "/faq",
    locale,
  });
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
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