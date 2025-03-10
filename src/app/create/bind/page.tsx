import { getCookie } from "cookies-next"
import { cookies } from "next/headers"
import BindRepository from "~/app/create/bind/_components/bind-repository"

const CreateBindPage = async () => {
  const githubToken = await getCookie("github_token", { cookies })
  return (
    <BindRepository githubToken={githubToken} />
  )
}

export default CreateBindPage