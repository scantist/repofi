import { type FC } from "react"
import Link from "next/link"
import { SiDiscord, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import CardWrapper from "~/components/card-wrapper"

type Props = {};

const DaoCard: FC<Props> = () => {
  return (
    <CardWrapper borderClassName={"border-1"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={"aspect-square h-60 w-full rounded-t-lg object-cover"}
        alt={"bg"}
        src={"http://downloads.echocow.cn/85936f2e95327e9e778b198c9b10fd6f.png"}
      />
      <div className={"flex flex-col p-5 gap-1 bg-black mb-1 rounded-b-lg"}>
        <div className={"truncate text-3xl leading-10 tracking-tighter"}>
          VUE DAO
        </div>
        <div className={"truncate text-sm text-white/58"}>
          Repository:&nbsp;
          <Link href={"https://github.com/vuejs/vue"}>
            https://github.com/vuejs/vue
          </Link>
        </div>
        <div className={"flex flex-row justify-between text-xs"}>
          <div><span className={"mr-1"}>License:</span><span className={"text-white/80"}>MIT</span></div>
          <div>|</div>
          <div><span className={"mr-1"}>Stars:</span><span className={"text-white/80"}>208K</span></div>
          <div>|</div>
          <div><span className={"mr-1"}>Watch:</span><span className={"text-white/80"}>5.9K</span></div>
          <div>|</div>
          <div><span className={"mr-1"}>Forks:</span><span className={"text-white/80"}>33.9K</span></div>
        </div>
        <div className={"border-y-1 border-y-gray-400 grid grid-cols-3 justify-evenly gap-1 font-light my-4 py-3"}>
          <div className={"border-r-1 border-r-gray-400 mr-2"}>
            <div className={"text-sm text-muted-foreground"}>Market cap</div>
            <div className={"text-lg font-bold text-primary-foreground mt-2"}>$2.50K</div>
          </div>
          <div className={"pl-3"}>
            <div className={"text-sm text-muted-foreground"}># Holders</div>
            <div className={"text-lg font-bold text-primary-foreground mt-2"}>$2.50K</div>
          </div>
          <div className={"border-l-1 border-l-gray-400 pl-5"}>
            <div className={"text-sm text-muted-foreground"}>Status</div>
            <div className={"text-lg font-bold text-primary-foreground mt-2"}>Launching</div>
          </div>
        </div>
        <div className={"flex flex-row justify-between items-center"}>
          <div className={"text-xs"}>More Info</div>
          <div className={"flex flex-row gap-2"}>
            <SiX className={"size-3"} />
            <SiDiscord className={"size-3"} />
            <SiTelegram className={"size-3"} />
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

export default DaoCard
