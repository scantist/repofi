import { Storage } from "@google-cloud/storage"
import type { NextRequest } from "next/server"
import { env } from "~/env"
import { UPLOAD_ARTICLE_PATH_POST } from "~/lib/const"
import { makeFileName } from "~/lib/utils"

const storage = new Storage()
const bucketName = env.NEXT_GOOGLE_STORAGE_BUCKET ?? "repofi"
const uploadPath = UPLOAD_ARTICLE_PATH_POST
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData()
    const files = formData.getAll("file[]") as File[]
    const id = formData.get("id") as string

    const errFiles: string[] = []
    const succMap: Record<string, string> = {}

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        errFiles.push(file.name)
        console.error(`File too large: ${file.name}`)
        continue
      }

      // 检查文件类型
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        errFiles.push(file.name)
        console.error(`Invalid file type: ${file.name}`)
        continue
      }

      const fileName = `${uploadPath + (uploadPath.endsWith("/") ? "" : "/")}/${id}_${makeFileName(file)}`
      const bucketFile = storage.bucket(bucketName).file(fileName)

      try {
        await bucketFile.save(Buffer.from(await file.arrayBuffer()), {
          contentType: file.type
        })
        succMap[file.name] = `https://storage.googleapis.com/${bucketName}/${fileName}`
      } catch (error) {
        console.error(`Failed to upload file: ${file.name}`, error)
        errFiles.push(file.name)
      }
    }

    return new Response(
      JSON.stringify({
        code: 0,
        data: { errFiles, succMap },
        msg: errFiles.length ? "Some files failed to upload" : "Upload successful"
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing request:", error)
    return new Response(
      JSON.stringify({
        code: 1,
        msg: "Failed to process the request"
      }),
      { status: 500 }
    )
  }
}
