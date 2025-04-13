import Image from "next/image"
import CardWrapper from "~/components/card-wrapper"
import { cn } from "~/lib/utils"

interface ArticlePlaceholderProps {
  id: string
}

const ArticlePlaceholder = ({ id }: ArticlePlaceholderProps) => {
  return (
    <div className={"my-20"}>
      <div className={"text-4xl font-bold tracking-tight"}>Articles</div>
      <div className={"pt-10 relative justify-center text-center"}>
        <div className={"absolute top-52 flex justify-center items-center w-full text-lg md:text-2xl font-bold z-10"}>
          <a href={`/dao/${id}/list`} className={"bg-primary px-4 py-2 rounded-lg transition-transform transform hover:scale-105 hover:bg-primary-dark hover:shadow-lg"}>
            You can config article list title and content
          </a>
        </div>
        <div className={"grid grid-cols-1 gap-4  md:grid-cols-3 blur-sm relative"}>
          {[3, 1, 2].map((item, index) => (
            <CardWrapper
              key={`cms-article-${item}`}
              className={cn(index > 0 && "hidden md:block")}
              contentClassName={cn("relative w-full min-h-[414px] relative flex justify-center items-center progress")}
            >
              <Image src={`https://storage.googleapis.com/repofi-prod/launchpad/image/article_${item}_blur.png`} fill={true} alt={`article-${item}`} />
            </CardWrapper>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ArticlePlaceholder
