import Link from "next/link"
import { ModeToggle } from "./buttons/ModeToggleButton"

interface NavbarProps {
  locale: "en" | "bn"
}

export default function Navbar({ locale }: NavbarProps) {
  const isBn = locale === "bn"

  return (
    <nav className="border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-12 items-center justify-between px-4 sm:px-6">
        {/* Public navigation */}
        <div className="flex items-center gap-1">
          <Link
            href={`/${locale}`}
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {isBn ? "হোম" : "Home"}
          </Link>

          <Link
            href={`/${locale}/about`}
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isBn ? "পরিচিতি" : "About"}
          </Link>

          <Link
            href={`/${locale}/faq`}
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isBn ? "সাধারণ জিজ্ঞাসা" : "FAQ"}
          </Link>
        </div>

        {/* Theme */}
        <ModeToggle />
      </div>
    </nav>
  )
}