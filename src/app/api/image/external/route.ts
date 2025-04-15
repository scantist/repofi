import { Storage } from "@google-cloud/storage"
import type { NextRequest } from "next/server"
import { env } from "~/env"

const storage = new Storage()
const bucketName = env.NEXT_GOOGLE_STORAGE_BUCKET ?? "repofi"

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { url } = await request.json()

    if (!url) {
      return new Response(JSON.stringify({ msg: "URL is required", code: 1, data: { originalURL: "", url: "" } }), { status: 400 })
    }

    const response = await fetch(url)
    if (!response.ok) {
      return new Response(JSON.stringify({ msg: "Failed to fetch the image from URL", code: 1, data: { originalURL: url, url: "" } }), { status: 400 })
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream"
    const buffer = Buffer.from(await response.arrayBuffer())
    const fileName = `external/${Date.now()}_${url.split("/").pop()}`
    const bucketFile = storage.bucket(bucketName).file(fileName)

    await bucketFile.save(buffer, { contentType })

    return new Response(
      JSON.stringify({
        msg: "Upload successful",
        code: 0,
        data: {
          originalURL: url,
          url: `https://storage.googleapis.com/${bucketName}/${fileName}`
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Error uploading image:", error)
    return new Response(
      JSON.stringify({
        msg: "Failed to upload image",
        code: 1,
        data: { originalURL: "", url: "" }
      }),
      { status: 500 }
    )
  }
}
