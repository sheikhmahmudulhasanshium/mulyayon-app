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
    title: { bn: "গ্রেড ও রিপোর্ট | মূল্যায়ন", en: "My Grades & Reports | Mulyayon" },
    description: { bn: "অর্জিত গ্রেড ও রিপোর্টের বিশদ বিবরণী", en: "Detailed View of Calculated Grades & Reports" },
    path: "/student/grades",
    locale,
  });
}

export default async function GradesPage({ params }: { params: Promise<{ lang: string }> }) {
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