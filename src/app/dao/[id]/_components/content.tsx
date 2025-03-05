const Content = () => {
  return (
    <div className={"my-10 pb-20 flex flex-row"}>
      <div className={"flex flex-col  flex-1"}>
        <div className={"text-4xl font-bold tracking-tight"}>Content</div>
        <div className={"text-white/50 text-md mt-10 mr-20"}>
          The REPO Protocol emerges against the backdrop of the growing
          importance of open source software in today&#39;s technology - driven
          world. As open source projects form the backbone of critical
          infrastructure and innovative technologies like AI, they face
          significant challenges in terms of funding, sustainability, and
          governance. Traditional models often leave these projects underfunded
          and struggling to maintain quality and drive further innovation. The
          REPO Protocol addresses these issues by creating a decentralized, self
          - sustaining ecosystem that enables fair value distribution,
          sustainable funding, and community - driven governance for open source
          development.
        </div>
      </div>
      <div className={"max-w-[579px]"}>
        <img className={"w-full"} src={"http://downloads.echocow.cn/content.png"} />
      </div>
    </div>
  )
}

export default Content
