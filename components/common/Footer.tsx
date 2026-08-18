import Image from "next/image"
import Link from "next/link"

interface FooterProps {
  locale: "en" | "bn"
}

export default function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const content = {
    en: {
      alt: "Mulyayon",
      copyright: `© ${currentYear} Mulyayon. All rights reserved.`,
      about: "About",
      faq: "FAQ",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
    bn: {
      alt: "মূল্যায়ন",
      copyright: `© ${currentYear} মূল্যায়ন। সর্বস্বত্ব সংরক্ষিত।`,
      about: "পরিচিতি",
      faq: "সাধারণ জিজ্ঞাসা",
      privacy: "গোপনীয়তা নীতি",
      terms: "ব্যবহারের শর্তাবলী",
    },
  }

  const t = content[locale]

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="py-8 sm:py-10">
          {/* Main row */}
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
            {/* Brand */}
            <Link
              href={`/${locale}`}
              aria-label={t.alt}
              className="shrink-0 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Image
                src={
                  locale === "bn"
                    ? "/logo/logo-bn.png"
                    : "/logo/logo-en.png"
                }
                alt={t.alt}
                width={160}
                height={80}
                className="h-auto w-40 object-contain"
                priority
              />
            </Link>

            {/* Links */}
            <nav
              aria-label={
                locale === "bn"
                  ? "ফুটার নেভিগেশন"
                  : "Footer navigation"
              }
              className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-muted-foreground sm:justify-end"
            >
              <Link
                href={`/${locale}/about`}
                className="whitespace-nowrap transition-colors hover:text-foreground"
              >
                {t.about}
              </Link>

              <Link
                href={`/${locale}/faq`}
                className="whitespace-nowrap transition-colors hover:text-foreground"
              >
                {t.faq}
              </Link>

              <Link
                href={`/${locale}/privacy`}
                className="whitespace-nowrap transition-colors hover:text-foreground"
              >
                {t.privacy}
              </Link>

              <Link
                href={`/${locale}/terms`}
                className="whitespace-nowrap transition-colors hover:text-foreground"
              >
                {t.terms}
              </Link>
            </nav>
          </div>

          {/* Copyright */}
          <div className="mt-8 border-t pt-5">
            <p className="text-center text-xs text-muted-foreground">
              {t.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}