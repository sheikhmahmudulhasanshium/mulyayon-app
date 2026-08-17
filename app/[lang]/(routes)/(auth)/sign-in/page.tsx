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

  const title = isBn ? "সাইন ইন | মূল্যায়ন অ্যাপ" : "Sign In - Mulyayon App"
  const description = isBn ? "আপনার পোর্টালে প্রবেশ করতে সাইন ইন করুন" : "Sign in to access your portal"
  const siteUrl = "https://mulyayon.vercel.app"

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    icons: {
      icon: [
        {
          url: "/favicon/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/favicon/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/favicon/favicon.ico",
          sizes: "any",
        },
      ],
      apple: [
        {
          url: "/favicon/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    manifest: "/favicon/site.webmanifest",
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/sign-in`,
    },
  }
}

export default async function SignInPage({ params }: { params: Promise<{ lang: string }> }) {
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