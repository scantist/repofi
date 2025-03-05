import { SiIngress, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import CardWrapper from "~/components/card-wrapper"

const TeamList = () => {
  return <div className={"flex flex-col my-10"}>
    <div className={"text-4xl font-bold tracking-tight"}>Team & Community</div>
    <div className={"grid grid-cols-2 gap-8 mt-8"}>
      {Array.from({ length: 4 }, (_, i) => i).map((item, index) => (
        <CardWrapper key={`ccc-${item}`}>
          <div className={"flex flex-col p-6 gap-4"}>
            <div className={"flex flex-row gap-6"}>
              <img src={"http://downloads.echocow.cn/85936f2e95327e9e778b198c9b10fd6f.png"}
                   className={"rounded-full size-16"}/>
              <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-row gap-5 items-center"}>
                  <div className={"text-xl"}>Ding Sun</div>
                  <div className={"font-thin text-lg text-white/50"}>CEO</div>
                </div>
                <div className={"flex flex-row gap-2"}>
                  <SiIngress className={"size-4"}/>
                  <SiX className={"size-4"}/>
                </div>
              </div>
            </div>
            <div className={"mt-2 text-white/50"}>
              Over the course of the last decade, first as aa graduate student at Harvard University in the Departmen...
            </div>
            <div className={"w-full text-right"}>
              Read More
            </div>
          </div>
        </CardWrapper>
      ))}
      <CardWrapper>
        <div className={"flex flex-col p-6 gap-4 bg-secondary"}>
          <div className={"text-xl font-bold mx-auto"}>@endrarediseases on x</div>
          <div className={"text-xs px-4 py-2 border border-white rounded-xl flex flex-row gap-1 items-center max-w-max mx-auto"}>
            <SiX className={"size-4"}/>
            Follow on x
          </div>
        </div>
      </CardWrapper>
      <CardWrapper>
        <div className={"flex flex-col p-6 gap-4 bg-secondary"}>
          <div className={"text-xl font-bold mx-auto"}>Telegram community</div>
          <div className={"text-xs px-4 py-2 border border-white rounded-xl flex flex-row gap-1 items-center max-w-max mx-auto"}>
            <SiTelegram className={"size-4"}/>
            Join our Telegram
          </div>
        </div>
      </CardWrapper>
    </div>
  </div>
}

export default TeamList
