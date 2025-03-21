import CardWrapper from "~/components/card-wrapper"

const Roadmap = () => {
  return (
    <div className={"my-10 py-20 flex flex-col"}>
      <div className={"text-4xl font-bold tracking-tight"}>Roadmap</div>
      <div className={"my-10 flex flex-col gap-6"}>
        <CardWrapper>
          <div className={"flex flex-row gap-x-8 px-10 py-4 bg-secondary"}>
            <div className={"text-3xl font-bold"}>January 2025</div>
            <div className={"flex-1"}>
              <div className={"text-sm font-thin"}>Release the Whitepaper: Dive into the science and vision behind the Software Genome Project</div>
              <div className={"text-sm font-thin"}>Launch the Website & Social Media: Join the conversation and witness the birth of a new era in software development</div>
            </div>
          </div>
        </CardWrapper>
        {Array.from({ length: 9 }, (_, i) => i).map((item, index) => (
          <CardWrapper key={`r-${item}`}>
            <div className={"flex flex-row gap-x-8 px-10 py-4"}>
              <div className={"text-primary text-3xl font-bold"}>January 2025</div>
              <div className={"flex-1"}>
                <div className={"text-sm font-thin"}>Release the Whitepaper: Dive into the science and vision behind the Software Genome Project</div>
                <div className={"text-sm font-thin"}>Launch the Website & Social Media: Join the conversation and witness the birth of a new era in software development</div>
              </div>
            </div>
          </CardWrapper>
        ))}
      </div>
    </div>
  )
}

export default Roadmap
