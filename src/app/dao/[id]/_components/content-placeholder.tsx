import Image from "next/image"
import { cn } from "~/lib/utils"

interface ContentPlaceholderProps {
  id: string
}

const ContentPlaceholder = ({ id }: ContentPlaceholderProps) => {
  return (
    <div className={"my-20"}>
      <div className={"text-4xl font-bold tracking-tight"}>Additional Content</div>
      <div className={"pt-8 relative justify-center text-center"}>
        <div className={"absolute top-52 flex justify-center items-center w-full text-lg md:text-2xl font-bold z-10"}>
          <a
            href={`/dao/${id}/edit/information`}
            className={"bg-primary px-4 py-2 rounded-lg transition-transform transform hover:scale-105 hover:bg-primary-dark hover:shadow-lg"}
          >
            Maybe you need some additional content
          </a>
        </div>
        <div className={cn("relative w-full min-h-[468px] flex justify-center items-center blur-md")}>
          <Image src={"https://storage.googleapis.com/repofi-prod/launchpad/image/content_blur.png"} alt={"content"} fill={true} />
        </div>
      </div>
    </div>
  )
}

export default ContentPlaceholder
