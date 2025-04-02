"use client"
import { useSession } from "next-auth/react"
import LiveTable from "~/app/_components/live-table"
import WalletButton from "~/components/auth/wallet-button"
import { api } from "~/trpc/react"
import { Button } from "~/components/ui/button"
import { getCookie } from "cookies-next/client"
import { toast } from "sonner"
import { usePathname,useRouter } from "next/navigation"
const ProfilPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const { data: user, isLoading } = api.user.me.useQuery(undefined, {
    enabled: session !== null
  })
  console.log("user",user)
  const { mutate, isPending: mutatePending } = api.user.bind.useMutation({
    onSuccess: () => {
      toast.success("Bind success!")
    },
    onError: () => {
      toast.error("Bind failed!")
    }
  })

  const githubToken = getCookie("github_token") as string | undefined
  const handleBind = async () => {
    if(mutatePending){
      return
    }

    if (!session) {
      toast.warning("Please connect your wallet.")
      return
    }
    if (!githubToken) {
      toast.warning("Please login your GitHub account first.", {
        action: {
          label: "Login",
          onClick: () => router.push(`/api/oauth/github?rollbackUrl=${pathname}`)
        },
        duration: 5000
      })
    } else {
      mutate({
        accessToken: githubToken,
        platform: "GITHUB"
      })
    }
  }
  return (
    <div className={"mt-20 flex-col max-w-7xl mx-auto flex min-h-full w-full px-4"}>
  
      <Button onClick={handleBind}>
        Bind Github
      </Button>
      {session ? (
        <div>
          <div className={"text-5xl leading-32 font-bold tracking-tight"}>My Portfolio</div>
          <LiveTable
            initialParams={{
              owned: true,
              orderBy: "latest",
              starred: false
            }}
          />
        </div>

      ) : (
        <div className={"bg-secondary rounded-lg p-5 flex flex-col gap-5"}>
          <div>Connect your wallet to see your Profile</div>
          <div>
            <WalletButton />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilPage
