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
    title: { bn: "বাড়ির কাজসমূহ | মূল্যায়ন", en: "My Homework Workspace | Mulyayon" },
    description: { bn: "আপনার বাড়ির কাজ ও সমাধান জমা দেওয়ার ঘর", en: "Your Assignment and Submission Workspace" },
    path: "/student/assignments",
    locale,
  });
}

export default async function AssignmentsPage({ params }: { params: Promise<{ lang: string }> }) {
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