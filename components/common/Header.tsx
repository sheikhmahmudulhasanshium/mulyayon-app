// components/common/Header.tsx
import Image from "next/image"
import { ModeToggle } from "./buttons/ModeToggleButton"
import LanguageToggleButton from "./buttons/LanguageToggleButton"

interface HeaderProps {
  locale: "en" | "bn"
}

export default function Header({ locale }: HeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 h-16">
        
        {/* Dynamic Typography Header Logo - Kept consistently dark to match brand logo */}
        <h1 className="flex items-center gap-2 font-extrabold text-2xl text-blue-900">
          <Image 
            src="/logo/icon.png" 
            alt="Logo Icon" 
            width={32} 
            height={32} 
            className="object-contain"
            priority 
          />          
          <span>{locale === "bn" ? "মূল্যায়ন" : "Mulyayon"}</span>
        </h1>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
            <LanguageToggleButton />
            <ModeToggle />
        </div>
      </div>
    </header>
  )
}