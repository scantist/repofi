"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"
import { useSession } from "next-auth/react"
import { MobileMenu } from "./mobile-menu"
export const navItems = [
  {
    name: "Launchpad",
    href: "/",
    requiresLogin: false
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    requiresLogin: false
  }
]

export default function Nav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.address

  return (
    <>
      <nav className="hidden items-center justify-center gap-4 text-sm md:flex">
        {navItems.map((item) => {
          if (item.requiresLogin && !isLoggedIn) {
            return null
          }
          return (
            <Link
              key={item.name}
              className={cn(
                "px-4 py-2 text-muted-foreground hover:text-foreground",
                item.href === "/"
                  ? pathname === "/" && "font-medium text-primary"
                  : pathname.startsWith(item.href) &&
                      "font-medium text-primary",
              )}
              href={item.href}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="block md:hidden">
        <MobileMenu navs={navItems} />
      </div>
    </>
  )
}
