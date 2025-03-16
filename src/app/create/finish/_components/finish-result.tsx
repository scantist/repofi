"use client"
import CardWrapper from "~/components/card-wrapper"
import { Rocket } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useSetAtom } from "jotai"
import { stepAtom } from "~/store/create-dao-store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const FinishResult = () => {
  const setAtom = useSetAtom(stepAtom)
  const router = useRouter()
  useEffect(() => {
    setAtom("FINISH")
  }, [])
  return (
    <CardWrapper
      className={"col-span-1 w-auto md:col-span-2 max-h-fit"}
    >
      <div
        className={
          "flex w-full flex-col items-center justify-center gap-4 py-20"
        }
      >
        <Rocket className={"text-muted-foreground h-52 w-52"} />
        <div className={"text-muted-foreground text-lg"}>
          Congratulations, your DAO has been successfully launched!
        </div>
        <div className={"text-muted-foreground text-lg"}>
          Please go to the{" "}
          <span
            onClick={() => {
              router.push("/dao/test")
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
            router.push("/dao/test")
          }}
        >
          GO
        </Button>
      </div>
    </CardWrapper>
  )
}

export default FinishResult
