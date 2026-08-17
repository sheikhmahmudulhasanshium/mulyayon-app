import { ModeToggle } from "./buttons/ModeToggleButton"

// components/common/Navbar.tsx
interface NavbarProps {
  locale: "en" | "bn"
}

export default function Navbar({ locale }: NavbarProps) {
  return (
    <nav className="p-2 bg-muted text-sm font-medium flex justify-between  items-center">
      <div className="flex gap-4 max-w-7xl mx-auto flex-1">
        <a href="#">{locale === "bn" ? "হোম" : "Home"}</a>
        <a href="#">{locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}</a>
      </div>
      <ModeToggle />
    </nav>
  )
}