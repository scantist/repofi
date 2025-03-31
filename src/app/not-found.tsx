"use client"
import dynamic from "next/dynamic"
import Link from "next/link"
import TextBorderAnimation from "~/components/ui/text-border-animation"
import NotFoundIcon from "~/public/lottie/404.json"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })
export default function NotFound() {
  return (
    <div className={"flex flex-col gap-4 justify-center items-center mt-48 md:mt-64"}>
      <Lottie animationData={NotFoundIcon} className="flex  justify-center items-center" loop={false} autoplay={true} />
      <p className={"text-2xl text-muted-foreground"}>Oh, My God! Maybe you've come to outer space and there's nothing here.</p>
      <Link href="/">
        <TextBorderAnimation className={"text-2xl cursor-pointer text-primary"} text={"Click me! Let's go back our home!"} />
      </Link>
    </div>
  )
}
