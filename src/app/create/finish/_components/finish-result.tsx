"use client"
import CardWrapper from "~/components/card-wrapper"
import { Rocket } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useSetAtom } from "jotai"
import { stepAtom } from "~/store/create-dao-store"
import { useEffect } from "react"

const FinishResult = () => {
  const setAtom = useSetAtom(stepAtom)
  useEffect(() => {
    setAtom("FINISH")
  }, [])
  return <CardWrapper className={"col-span-1 w-full md:col-span-2"} contentClassName={"bg-card"}>
    <div className={"flex w-full items-center justify-center flex-col py-20 gap-4"}>
      <Rocket className={"w-72 h-72 text-muted-foreground"} />
      <div className={"text-lg text-muted-foreground"}>Congratulations, your DAO has been successfully launched!</div>
      <div className={"text-lg text-muted-foreground"}>Please go to the <span className={"font-bold text-white cursor-pointer"}>details</span> page to improve the information</div>
      <Button className={"text-xl mt-5 w-32"}>GO</Button>
    </div>
  </CardWrapper>
}

export default FinishResult
