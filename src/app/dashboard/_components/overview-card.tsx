import CardWrapper from "~/components/card-wrapper"

const OverviewCard = () => {
  return <CardWrapper contentClassName={"bg-card"}>
    <div className={"p-4 bg-black/60 rounded-lg mb-1"}>
      <div className={"font-bold text-4xl"}>$14.25M</div>
      <div className={"text-sm leading-6 text-gray-400"}>Tokenized lP Value</div>
      <div className={"text-2xl font-medium mt-14"}>$14.25M</div>
      <div className={"text-sm mt-2 text-gray-400"}>BIO AUM</div>
    </div>
  </CardWrapper>
}

export default OverviewCard
