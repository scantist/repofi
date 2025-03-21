const Content = () => {
  return (
    <div className={"my-10 pb-20 flex flex-col md:flex-row"}>
      <div className={"flex flex-col flex-1"}>
        <div className={"text-4xl font-bold tracking-tight"}>Content</div>

        <div className={"md:hidden mt-6 mb-6 max-w-full"}>
          <img alt={"K"} className={"w-full"} src={"https://storage.googleapis.com/repofi/launchpad/image/K.png"} />
        </div>

        <div className={"text-white/50 text-md mt-0 md:mt-10 md:mr-20"}>
          The REPO Protocol emerges against the backdrop of the growing importance of open source software in today&#39;s technology - driven world. As open source projects form
          the backbone of critical infrastructure and innovative technologies like AI, they face significant challenges in terms of funding, sustainability, and governance.
          Traditional models often leave these projects underfunded and struggling to maintain quality and drive further innovation. The REPO Protocol addresses these issues by
          creating a decentralized, self - sustaining ecosystem that enables fair value distribution, sustainable funding, and community - driven governance for open source
          development.
        </div>
      </div>
      <div className={"hidden md:block max-w-[579px] md:mt-0"}>
        <img alt={"K"} className={"w-full"} src={"https://storage.googleapis.com/repofi/launchpad/image/K.png"} />
      </div>
    </div>
  )
}

export default Content
