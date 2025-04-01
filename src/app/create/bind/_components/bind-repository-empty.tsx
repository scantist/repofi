"use client"

import { SiGithub } from "@icons-pack/react-simple-icons"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import type { FC } from "react"
import { useAuth } from "~/components/auth/auth-context"
import TextBorderAnimation from "~/components/ui/text-border-animation"
import connectGithubIcon from "~/public/lottie/connect-github.json"
import connectWalletIcon from "~/public/lottie/connect-wallet.json"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

type Props = {
  githubToken?: string
}

const BindRepositoryEmpty: FC<Props> = ({ githubToken }) => {
  const { isAuthenticated, openDialog } = useAuth()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")
  const pathname = usePathname()
  let content = <></>
  if (!isAuthenticated) {
    content = (
      <>
        <Lottie animationData={connectWalletIcon} className="size-64" loop={false} autoplay={true} />
        {error && (
          <div className={"text-center font-bold text-destructive z-30"}>
            Error: {error.toUpperCase()}. <br />
            {errorDescription}
          </div>
        )}
        <div className={"align-middle text-md md:text-xl text-center font-bold text-gray-400 flex flex-row gap-2"}>
          Click{" "}
          <div onClick={() => openDialog()}>
            <TextBorderAnimation className={"text-md md:text-xl cursor-pointer"} text={"Connect"} />
          </div>{" "}
          to your Web3 Wallet !
        </div>
      </>
    )
  } else if (!githubToken) {
    content = (
      <>
        <Lottie className={"md:-mt-32"} animationData={connectGithubIcon} size={80} loop={false} autoplay={true} />
        {error && (
          <div className={"text-center font-bold text-destructive z-30"}>
            Error: {error.toUpperCase()}. <br />
            {errorDescription}
          </div>
        )}
        <div className={"align-middle  md:text-xl font-bold text-gray-400 md:-mt-32 z-30"}>
          Connect to your{" "}
          <Link className={"cursor-pointer text-white"} href={`/api/oauth/github?rollbackUrl=${pathname}`}>
            <SiGithub className={"mr-2 inline"} />
            GitHub
          </Link>{" "}
          account!
        </div>
      </>
    )
  }
  return <div className={"bg-card flex min-h-96 flex-col items-center justify-center p-4 md:px-14 md:py-8 rounded-lg"}>{content}</div>
}

export default BindRepositoryEmpty
