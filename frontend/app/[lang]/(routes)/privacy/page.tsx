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
      bn: "গোপনীয়তা নীতি | মূল্যায়ন",
      en: "Privacy Policy | Mulyayon",
    },
    description: {
      bn: "মূল্যায়ন কীভাবে ব্যবহারকারীর তথ্য পরিচালনা ও সুরক্ষিত রাখে।",
      en: "Learn how Mulyayon handles and protects user information.",
    },
    path: "/privacy",
    locale,
  });
}

export default async function PrivacyPage({
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