"use server"
import { Storage } from "@google-cloud/storage"
import { type HomeSearchParams } from "~/lib/schema"
import { daoService } from "~/server/service/dao"
import { auth } from "~/server/auth"

// Google Storage
const GoogleStorageBucket = "repofi"
const storage = new Storage()

export const uploadFile = async ({
  file,
  fileName
}: {
  file: string // base64
  fileName: string
}) => {
  const buffer = Buffer.from(file, "base64")
  const stream = storage.bucket(GoogleStorageBucket).file(fileName).createWriteStream({
    resumable: false
  })

  try {
    const { url } = await new Promise<{
      url: string
    }>((resolve, reject) => {
      stream.on("finish", () => {
        resolve({
          url: `https://storage.googleapis.com/${GoogleStorageBucket}/${fileName}`
        })
      })
      stream.on("error", (err) => {
        reject(err)
      })
      stream.end(buffer)
    })

    return {
      success: true,
      url
    }
  } catch (err) {
    console.log(`Fail to upload file: ${err as string}`)
    return {
      success: false,
      message: "Fail to upload file"
    }
  }
}

export const getDaoListAction = async (params: HomeSearchParams & { page?: number }) => {
  const session = await auth()
  const homeSearch = await daoService.search({ ...params }, { page: params.page ?? 0, size: 10 }, session?.address)
  console.log(homeSearch)
  return homeSearch
}
