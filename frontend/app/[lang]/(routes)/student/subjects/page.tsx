import PageProvider from "@/providers/page-provider";
import Body from "./body";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { constructMetadata } from "@/components/common/metadata";
import StudentSidebar from "../StudentSidebar";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang === "bn" ? "bn" : "en";

  return constructMetadata({
    title: { bn: "বিষয় এবং শিক্ষক | মূল্যায়ন", en: "My Subjects & Teachers | Mulyayon" },
    description: { bn: "চলমান কোর্সের বিষয় ও শিক্ষক তালিকা", en: "Enrolled Course Subject Directory" },
    path: "/student/subjects",
    locale,
  });
}

export default async function SubjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang === "bn" ? "bn" : "en";

  return (
    <PageProvider 
      header={<Header locale={locale} />} 
      footer={<Footer locale={locale} />} 
      navbar={<Navbar locale={locale} />} 
      sidebar={<StudentSidebar locale={locale} />}
    >
      <Body locale={locale} />
    </PageProvider>
  );
}