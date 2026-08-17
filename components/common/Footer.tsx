// components/common/Footer.tsx
import Image from "next/image"

interface FooterProps {
  locale: "en" | "bn"
}

export default function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6">
        
        {/* Left Side: Localized 2:1 Brand Logo */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Image 
            src={locale === "bn" ? "/logo/logo-bn.png" : "/logo/logo-en.png"}
            alt={locale === "bn" ? "মূল্যায়ন" : "Mulyayon"}
            width={160} // Maintained exact 2:1 aspect ratio (scaled down from 1774x887)
            height={80} 
            className="object-contain"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {locale === "bn" 
              ? `© ${currentYear} মূল্যায়ন। সর্বস্বত্ব সংরক্ষিত।` 
              : `© ${currentYear} Mulyayon. All rights reserved.`}
          </p>
        </div>

        {/* Right Side: Utility Links */}
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:underline transition-all">
            {locale === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy"}
          </a>
          <a href="#" className="hover:underline transition-all">
            {locale === "bn" ? "ব্যবহারের শর্তাবলী" : "Terms of Service"}
          </a>
        </div>

      </div>
    </footer>
  )
}