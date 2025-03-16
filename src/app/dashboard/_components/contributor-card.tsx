import CardWrapper from "~/components/card-wrapper"

const ContributorCard = () => {
  return (
    <CardWrapper>
      <div className={"rounded-lg bg-black/60 p-4"}>
        <div className={"text-2xl font-medium"}>Contributor List</div>
        <div className={"flex flex-col gap-2 mt-3"}>
          {Array.from({ length: 11 }, (_, i) => i).map((item, index) => (
            <div key={`Contributor-${item}`} className={"flex flex-row items-center gap-2 font-thin"}>
              <div className={"w-6"}>{index}.</div>
              <img src={"https://api.zxki.cn/api/sjtx?type=image"} className={"size-5 rounded-full"} alt={"avatar"} />
              <div className={"flex-1 truncate"}>Ethan Parker {index}</div>
              <div className={"w-18"}>50.23%</div>
              <div className={"ml-4 rounded-lg text-xs px-2 text-right bg-primary opacity-80"}>Claim</div>
            </div>
          ))}
        </div>
      </div>
    </CardWrapper>
  )
}

export default ContributorCard
