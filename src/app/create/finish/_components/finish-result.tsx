"use client"
import CardWrapper from "~/components/card-wrapper"
import { Rocket } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useSetAtom } from "jotai"
import { stepAtom } from "~/store/create-dao-store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"

const FinishResult = () => {
  const setAtom = useSetAtom(stepAtom)
  const router = useRouter()
  useEffect(() => {
    setAtom("FINISH")
    const end = Date.now() + 3 * 1000 // 3 seconds

    const frame = () => {
      if (Date.now() > end) return

      void confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 }
      })
      void confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 }
      })

      requestAnimationFrame(frame)
    }

    frame()
  }, [])
  return (
    <CardWrapper className={"col-span-1 w-auto md:col-span-2 max-h-fit"}>
      <div className={"flex w-full flex-col items-center justify-center gap-4 py-20"}>
        <Rocket className={"text-muted-foreground h-52 w-52"} />
        <div className={"text-muted-foreground text-lg"}>Congratulations, your DAO has been successfully created!</div>
        <div className={"text-muted-foreground text-lg"}>
          Please go to the{" "}
          <span
            onClick={() => {
              router.push("/")
            }}
            className={"cursor-pointer font-bold text-white"}
          >
            details
          </span>{" "}
          page to improve the information
        </div>
        <Button
          className={"mt-5 w-32 text-xl"}
          onClick={() => {
            router.push("/")
          }}
        >
          GO
        </Button>
      </div>
    </CardWrapper>
  )
}

export default FinishResult
