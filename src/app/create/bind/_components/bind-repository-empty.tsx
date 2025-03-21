"use client"

import { Waypoints } from "lucide-react"
import { SiGithub } from "@icons-pack/react-simple-icons"
import Link from "next/link"
import { useSession } from "next-auth/react"
import WalletButton from "~/components/auth/wallet-button"
import { usePathname } from "next/navigation"
import { type FC } from "react"

type Props = {
  githubToken?: string
}

const BindRepositoryEmpty: FC<Props> = ({ githubToken }) => {
  const { data: session } = useSession()
  const pathname = usePathname()
  let content = <></>
  if (!session) {
    content = (
      <div className={"align-middle text-xl font-bold text-gray-400"}>
        Click <WalletButton /> to your Web3 Wallet !
      </div>
    )
  } else if (!githubToken) {
    content = (
      <div className={"align-middle text-xl font-bold text-gray-400"}>
        Connect to your{" "}
        <Link className={"cursor-pointer text-white"} href={`/api/oauth/github?rollbackUrl=${pathname}`}>
          <SiGithub className={"mr-2 inline"} />
          GitHub
        </Link>{" "}
        account!
      </div>
    )
  }
  return (
    <div className={"bg-card flex min-h-96 flex-col items-center justify-center gap-10 px-14 py-8 rounded-lg"}>
      <Waypoints className={"size-32"} />
      {content}
    </div>
  )
}

export default BindRepositoryEmpty
