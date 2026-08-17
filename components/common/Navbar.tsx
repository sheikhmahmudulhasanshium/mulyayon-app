// components/common/Navbar.tsx
interface NavbarProps {
  locale: "en" | "bn"
}

export default function Navbar({ locale }: NavbarProps) {
  return (
    <nav className="p-2 bg-muted text-sm font-medium">
      <div className="flex gap-4 max-w-7xl mx-auto">
        <a href="#">{locale === "bn" ? "হোম" : "Home"}</a>
        <a href="#">{locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}</a>
      </div>
    </nav>
  )
}