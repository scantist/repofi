"use client"
import { getCookie } from "cookies-next/client"
import { useMemo } from "react"
import Authorization from "~/app/profile/_components/authorization"
import { useAuth } from "~/components/auth/auth-context"
import CardWrapper from "~/components/card-wrapper"
import { Avatar, AvatarImage } from "~/components/ui/avatar"
import { BoxReveal } from "~/components/ui/box-reveal"
import { api } from "~/trpc/react"
import PortfolioTable from "./_components/portfolio-table"
const ProfilPage = () => {
  const { isAuthenticated, address } = useAuth()
  const { data: user, isLoading } = api.user.me.useQuery(undefined, {
    enabled: isAuthenticated
  })
  console.log(user)
  const githubToken = getCookie("github_token") as string | undefined
  const hasPlatform = useMemo(() => {
    return (user?.userPlatforms.length ?? 0) > 0
  }, [user])
  const githubUser = useMemo(() => {
    return user?.userPlatforms[0]
  }, [user])
  return (
    <div className={"mt-20 flex-col max-w-7xl mx-auto flex min-h-full w-full px-4"}>
      <div className={"p-4"}>{(!isAuthenticated || !hasPlatform) && <Authorization githubToken={githubToken} hasPlatform={hasPlatform} />}</div>
      {isAuthenticated && hasPlatform && (
        <>
          <CardWrapper className={"col-span-2 h-full "}>
            <div className={"p-4 space-y-4"}>
              <BoxReveal duration={0.5}>
                <p className="text-2xl font-semibold">Profile</p>
              </BoxReveal>
              <BoxReveal duration={0.5}>
                <p className={"text-muted-foreground"}>Address: {address}</p>
              </BoxReveal>
              <BoxReveal duration={0.5}>
                <div className={"text-muted-foreground flex items-center"}>
                  Github Account:{" "}
                  <Avatar className={"size-6 ml-4 mr-2"}>
                    <AvatarImage src={githubUser?.platformAvatar} />
                  </Avatar>
                  {githubUser?.platformName}
                </div>
              </BoxReveal>
            </div>
          </CardWrapper>
          <div className={"my-8"}>
            <div className={"text-5xl leading-32 font-bold tracking-tight"}>My Portfolio</div>
            <PortfolioTable />
          </div>
        </>
      )}
    </div>
  )
}

export default ProfilPage
