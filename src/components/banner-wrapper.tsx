import React, { type FC } from "react"
import { cn } from "~/lib/utils"

type Props = {
  children: React.ReactNode,
  className?: string,
  wrapperClassName?: string,
}

const BannerWrapper: FC<Props> = ({ children, className, wrapperClassName }) => {
  return (
    <div
      className={wrapperClassName}
      style={{
        background: "url('https://storage.googleapis.com/repofi/launchpad/image/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
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
