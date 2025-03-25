import { Menu, XIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import WalletButton from "~/components/auth/wallet-button"
import { Button } from "~/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetClose } from "~/components/ui/sheet"
import { cn } from "~/lib/utils"

export const MobileMenu = ({
  navs
}: {
  navs: Array<{ name: string; href: string; requiresLogin: boolean }>
}) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const { data: session } = useSession()
  const isLoggedIn = !!session?.address

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="overflow-auto p-0 shadow-lg shadow-primary/20">
        <SheetHeader>
          <header className="top-0 z-20 mx-auto flex w-full items-center justify-between border-b border-border bg-background/70 px-4 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4 pr-2">

              <SheetClose>
                <XIcon className="size-6" />
              </SheetClose>
            </div>
          </header>
        </SheetHeader>
        <div className="relative px-6 py-8">
          <ul className="space-y-4">
            {navs.map((item) => {
              if (item.requiresLogin && !isLoggedIn) {
                return null
              }
              return (
                <li key={item.name}>
                  <Link
                    href={`${item.href}`}
                    scroll={true}
                    className={cn(
                      "text-base text-muted-foreground hover:text-foreground",
                      item.href === "/" ? pathname === "/" && "font-medium text-primary" : pathname.startsWith(item.href) && "font-medium text-primary"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <SheetFooter className="border-t border-border px-6 py-2">
          <WalletButton />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
