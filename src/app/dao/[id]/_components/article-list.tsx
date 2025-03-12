import CardWrapper from "~/components/card-wrapper"

const ArticleList = () => {
  return (
    <div className={"my-20"}>
      <div className={"text-4xl font-bold tracking-tight"}>
        Currently Fundraising
      </div>
      <div className={"grid grid-cols-3 pt-10 gap-8"}>
        <CardWrapper contentClassName={"bg-card"}>
          <img
            src={
              "https://storage.googleapis.com/repofi/launchpad/avatar/1741621897031_85936f2e95.png"
            }
            className={" w-full"}
          />
          <div className={"mx-6 my-4 pb-4 flex flex-col gap-4"}>
            <div className={"text-xl font-bold"}>
              Identification ofa candidate yeastavatar
            </div>
            <div className={"text-xs text-gray-500"}>
              First we confimm thatyeast have an ancestral version ofhuman
              disease gene.Because yeast have been poked andprodded in the lab
              fordecades00anv ofthe rare diseg8e 08newve seek to model in yeast
              have already been studied.
            </div>
            <div className={"flex justify-end"}>
              <div className={"border border-primary rounded-lg px-2 py-1 left-0 max-w-max"}>Learn More</div>
            </div>
          </div>
        </CardWrapper>
        <CardWrapper contentClassName={"bg-card "}>
          <img
            src={
              "https://storage.googleapis.com/repofi/launchpad/avatar/1741621897031_85936f2e95.png"
            }
            className={" w-full"}
          />
          <div className={"mx-6 my-4 pb-4 flex flex-col gap-4"}>
            <div className={"text-xl font-bold"}>
              Identification ofa candidate yeastavatar
            </div>
            <div className={"text-xs text-gray-500"}>
              First we confimm thatyeast have an ancestral version ofhuman
              disease gene.Because yeast have been poked andprodded in the lab
              fordecades00anv ofthe rare diseg8e 08newve seek to model in yeast
              have already been studied.
            </div>
            <div className={"flex justify-end"}>
              <div className={"border border-primary rounded-lg px-2 py-1 left-0 max-w-max"}>Learn More</div>
            </div>
          </div>
        </CardWrapper>
        <CardWrapper contentClassName={"bg-card"}>
          <img
            src={
              "https://storage.googleapis.com/repofi/launchpad/avatar/1741621897031_85936f2e95.png"
            }
            className={" w-full"}
          />
          <div className={"mx-6 my-4 pb-4 flex flex-col gap-4"}>
            <div className={"text-xl font-bold"}>
              Identification ofa candidate yeastavatar
            </div>
            <div className={"text-xs text-gray-500"}>
              First we confimm thatyeast have an ancestral version ofhuman
              disease gene.Because yeast have been poked andprodded in the lab
              fordecades00anv ofthe rare diseg8e 08newve seek to model in yeast
              have already been studied.
            </div>
            <div className={"flex justify-end"}>
              <div className={"border border-primary rounded-lg px-2 py-1 left-0 max-w-max"}>Learn More</div>
            </div>
          </div>
        </CardWrapper>
      </div>
    </div>
  )
}

export default ArticleList
