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
      bn: "শর্তাবলি | মূল্যায়ন",
      en: "Terms & Conditions | Mulyayon",
    },
    description: {
      bn: "মূল্যায়ন platform ব্যবহারের নিয়ম ও শর্তাবলি।",
      en: "The rules and conditions for using the Mulyayon platform.",
    },
    path: "/terms",
    locale,
  });
}

export default async function TermsPage({
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