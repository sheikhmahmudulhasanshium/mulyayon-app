import PageProvider from "@/providers/page-provider"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import Sidebar from "@/components/common/Sidebar"
import Body from "./body"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang === "bn" ? "bn" : "en"
  const isBn = locale === "bn"

  const title = isBn ? "সাইন আউট | মূল্যায়ন অ্যাপ" : "Sign Out - Mulyayon App"
  const description = isBn ? "সিস্টেম থেকে সাইন আউট করা হচ্ছে" : "Signing out of Mulyayon"
  
  return {
    title,
    description,
  }
}

export default async function SignOutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang === "bn" ? "bn" : "en"

  return (
    <PageProvider 
      header={<Header locale={locale} />} 
      footer={<Footer locale={locale} />} 
      navbar={<Navbar locale={locale} />} 
      sidebar={<Sidebar locale={locale} />}
    >    
      <Body locale={locale} />
    </PageProvider>
  )
}