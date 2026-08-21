interface PageProviderProps {
  header: React.ReactNode
  footer: React.ReactNode
  navbar?: React.ReactNode
  sidebar?: React.ReactNode
  children: React.ReactNode
}

export default function PageProvider({
  header,
  footer,
  navbar,
  sidebar,
  children,
}: PageProviderProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {header}

      <div className="sticky top-0 z-40 bg-background">
        <div className="mx-4 flex h-12 items-center md:hidden">
          {sidebar}
        </div>

        <div className="hidden md:block">
          {navbar}
        </div>
      </div>

      <main className="min-h-[70vh] grow">
        {children}
      </main>

      {footer}
    </div>
  )
}