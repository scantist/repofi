"use client"
import confetti from "canvas-confetti"
import { Rocket } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo } from "react"
import CardWrapper from "~/components/card-wrapper"
import { Button } from "~/components/ui/button"

const FinishResult = () => {
  const router = useRouter()
  const params = useSearchParams()
  const id = useMemo(() => {
    return params.get("id")
  }, [params])
  useEffect(() => {
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
    <CardWrapper className={"col-span-1 w-auto md:col-span-2"} contentClassName={"h-full max-h-none"}>
      <div className={"flex w-full flex-col items-center justify-center gap-4 py-20"}>
        <Rocket className={"text-muted-foreground h-52 w-52"} />
        <div className={"text-muted-foreground text-lg"}>Congratulations, your DAO has been successfully created!</div>
        <div className={"flex flex-row gap-6"}>
          <Button
            className={"mt-5"}
            onClick={() => {
              router.push(`/dao/${id}`)
            }}
          >
            View Details and Trade
          </Button>
          <Button
            className={"mt-5"}
            onClick={() => {
              router.push(`/dao/${id}/edit`)
            }}
          >
            Add more Info for the DAO
          </Button>
        </div>
      </div>
    </CardWrapper>
  )
}

export default FinishResult
