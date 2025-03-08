import { Waypoints } from "lucide-react"
import { SiGithub, SiGitlab } from "@icons-pack/react-simple-icons"

const BindRepositoryEmpty = () => {
  return (
    <div
      className={
        "bg-card flex min-h-96 flex-col items-center justify-center gap-10 px-14 py-8"
      }
    >
      <Waypoints className={"size-32"} />
      <div className={"align-middle text-xl font-bold text-gray-400"}>
        Connect to your{" "}
        <span className={"cursor-pointer text-white"}>
          <SiGithub className={"mr-2 inline"} />
          GitHub
        </span>{" "}
        or{" "}
        <span className={"cursor-pointer text-white"}>
          <SiGitlab className={"mr-2 inline"} />
          GitLab
        </span>{" "}
        account!
      </div>
    </div>
  )
}

export default BindRepositoryEmpty
