import Image from "next/image"
import CardWrapper from "~/components/card-wrapper"
import { cn } from "~/lib/utils"

interface TeamPlaceholderProps {
  id: string
}

const TeamPlaceholder = ({ id }: TeamPlaceholderProps) => {
  return (
    <div className={"my-20"}>
      <div className={"text-4xl font-bold tracking-tight"}>Team & Community</div>
      <div className={"pt-10 relative justify-center text-center"}>
        <div className={"absolute top-48 flex justify-center items-center w-full text-lg md:text-2xl font-bold z-10"}>
          <a href={`/dao/${id}/edit/team`} className={"bg-primary px-4 py-2 rounded-lg transition-transform transform hover:scale-105 hover:bg-primary-dark hover:shadow-lg"}>
            Add your team member information
          </a>
        </div>
        <div className={"blur-md"}>
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-8"}>
            <CardWrapper contentClassName={cn("relative w-full min-h-[152px] h-[152px] relative flex justify-center items-center ")}>
              <Image src={"https://storage.googleapis.com/repofi-prod/launchpad/image/member.png"} fill={true} alt={"member"} />
            </CardWrapper>
            <CardWrapper contentClassName={cn("relative w-full min-h-[152px] h-[152px] relative  justify-center items-center hidden md:flex")}>
              <Image src={"https://storage.googleapis.com/repofi-prod/launchpad/image/member.png"} fill={true} alt={"member"} />
            </CardWrapper>
          </div>
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"}>
            <div className={cn("relative w-full min-h-[152px] h-[152px] flex justify-center items-center")}>
              <Image src={"https://storage.googleapis.com/repofi-prod/launchpad/image/community_blur.png"} fill={true} alt={"community"} />
            </div>
            <div className={cn("relative w-full min-h-[152px] h-[152px]  justify-center items-center hidden md:flex")}>
              <Image src={"https://storage.googleapis.com/repofi-prod/launchpad/image/community_blur.png"} fill={true} alt={"community"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamPlaceholder
