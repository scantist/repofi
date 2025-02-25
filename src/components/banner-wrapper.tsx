import React, {type FC} from "react"
import {cn} from "~/lib/utils"

type Props = {
  children: React.ReactNode,
  className?: string,
}

const BannerWrapper: FC<Props> = ({children, className}) => {
  return (
    <div
      style={{
        background: "url('http://downloads.echocow.cn/banner.png')",
        backgroundSize: "cover"
      }}
    >
      <div
        className={
          cn("mx-auto flex min-h-full w-full max-w-7xl gap-10 px-4 pt-10 pb-10", className)
        }
      >
        {children}
      </div>
    </div>
  )
}

export default BannerWrapper
