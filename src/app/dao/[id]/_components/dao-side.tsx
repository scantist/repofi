"use client"

import { usePathname } from "next/navigation"
import type React from "react"
import { Separator } from "~/components/ui/separator"

interface DaoSideProps {
  id: string
}

const DaoSide = ({ id }: DaoSideProps) => {
  const pathname = usePathname()

  const links = [
    { href: `/dao/${id}/edit/base`, label: "Basic Info" },
    { href: `/dao/${id}/edit/list`, label: "Articles" },
    { href: `/dao/${id}/edit/team`, label: "Team & Community" },
    { href: `/dao/${id}/edit/roadmap`, label: "Roadmap" },
    { href: `/dao/${id}/edit/information`, label: "Additional Content" }
  ]

  return (
    <aside className="lg:w-1/5">
      <nav className="flex space-x-2 lg:flex-col overflow-auto lg:space-y-1 lg:space-x-0">
        {links.map((link) => (
          <a
            key={link.href}
            className={`focus-visible:ring-ring inline-flex h-9 items-center justify-start gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
              pathname === link.href ? "hover:text-primary-foreground bg-primary hover:bg-primary" : "hover:text-accent-foreground hover:bg-transparent hover:underline"
            }`}
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <Separator className={"md:hidden mt-2"} />
    </aside>
  )
}

export default DaoSide
