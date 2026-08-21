import PageProvider from "@/providers/page-provider";
import Body from "./body";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import TeacherSidebar from "../TeacherSidebar";
import { constructMetadata } from "@/components/common/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang === "bn" ? "bn" : "en";

  return constructMetadata({
    title: { bn: "আমার কোর্সসমূহ | মূল্যায়ন অ্যাপ", en: "My Courses | Mulyayon App" },
    description: { bn: "কাজ হোক প্রমাণ", en: "Let Your Work Speak" },
    path: "/teacher/courses",
    locale,
  });
}

export default async function CoursesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang === "bn" ? "bn" : "en";

  return (
    <PageProvider 
      header={<Header locale={locale} />} 
      footer={<Footer locale={locale} />} 
      navbar={<Navbar locale={locale} />} 
      sidebar={<TeacherSidebar locale={locale} />}
    >
      <Body />
    </PageProvider>
  );
}