"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "~/components/auth/auth-context"
import { cn } from "~/lib/utils"
import { MobileMenu } from "./mobile-menu"
export const navItems = [
  {
    name: "Launchpad",
    href: "/",
    requiresLogin: false
  },
  {
    name: "Profile",
    href: "/profile",
    requiresLogin: false
  }
]

export default function Nav() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  return (
    <>
      <nav className="hidden items-center justify-center gap-4 text-sm md:flex">
        {navItems.map((item) => {
          if (item.requiresLogin && !isAuthenticated) {
            return null
          }
          return (
            <Link
              key={item.name}
              className={cn(
                "px-4 py-2 text-muted-foreground hover:text-foreground",
                item.href === "/" ? pathname === "/" && "font-bold text-primary " : pathname.startsWith(item.href) && "font-medium text-primary"
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
