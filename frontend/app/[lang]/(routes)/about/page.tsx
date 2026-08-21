import type { Metadata } from "next";

import PageProvider from "@/providers/page-provider";
import Body from "./body";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { constructMetadata } from "@/components/common/metadata";

type Locale = "en" | "bn";

interface AboutPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = lang === "bn" ? "bn" : "en";

  return constructMetadata({
    title: {
      bn: "মূল্যায়ন সম্পর্কে | মূল্যায়ন",
      en: "About Mulyayon | Mulyayon",
    },
    description: {
      bn: "মূল্যায়ন হলো assignment, submission, evaluation এবং feedback পরিচালনার জন্য একটি role-based academic workspace।",
      en: "Mulyayon is a role-based academic workspace for managing assignments, submissions, evaluation, and feedback.",
    },
    path: "/about",
    locale,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const locale: Locale = lang === "bn" ? "bn" : "en";

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