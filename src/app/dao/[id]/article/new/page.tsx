"use client"
import React, { useEffect, useState } from "react"
import { useDaoContext } from "~/app/dao/[id]/context"
import { Input } from "~/components/ui/input"
import "vditor/dist/index.css"
import { ImagePlus, Save, TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Vditor from "vditor"
import { uploadFile } from "~/app/actions"
import PictureSelectPopover from "~/components/picture-select-popover"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { Textarea } from "~/components/ui/textarea"
import { UPLOAD_PATH_POST } from "~/lib/const"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
const toolbar = [
  "emoji",
  "headings",
  "bold",
  "italic",
  "strike",
  "link",
  "|",
  "list",
  "ordered-list",
  "check",
  "outdent",
  "indent",
  "|",
  "quote",
  "line",
  "code",
  "inline-code",
  "insert-before",
  "insert-after",
  "|",
  "upload",
  "record",
  "table",
  "|",
  "undo",
  "redo",
  "|",
  "fullscreen",
  "edit-mode",
  {
    name: "more",
    toolbar: ["both", "code-theme", "content-theme", "export", "outline", "preview"]
  }
]

const NewArticlePage = () => {
  const { detail } = useDaoContext()
  const [description, setDescription] = useState("")
  const [title, setTitle] = useState("")
  const [image, setImage] = useState<string | undefined>()
  const [vd, setVd] = useState<Vditor>()
  useEffect(() => {
    const vditor = new Vditor("vditor", {
      after: () => {
        vditor.setValue("")
        setVd(vditor)
      },
      toolbar,
      theme: "dark",
      lang: "en_US",
      preview: {
        theme: {
          current: "Dark"
        },
        hljs: {
          style: "xcode-dark"
        }
      },
      upload: {
        url: "/api/image/upload",
        linkToImgUrl: "/api/image/external",
        extraData: { id: detail.id },
        accept: "image/*"
      }
    })
    // Clear the effect
    return () => {
      vd?.destroy()
      setVd(undefined)
    }
  }, [])
  const router = useRouter()
  const { mutate, isPending } = api.daoArticle.create.useMutation({
    onSuccess: async (data) => {
      router.replace(`/dao/${detail.id}/article/${data.id}`)
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed to action! ${error.message}`)
    }
  })
  const handleSave = () => {
    if (title.trim().length === 0) {
      toast.error("Title is required")
      return
    }
    const content = vd?.getValue() || ""
    if (content.trim().length === 0) {
      toast.error("Content is required")
      return
    }
    if (!image) {
      toast.error("Image is required")
      return
    }
    console.log("Saving article:", { title, content })
    mutate({
      daoId: detail.id,
      params: {
        title,
        content,
        image,
        description
      }
    })
  }

  return (
    <div className={" space-y-6 min-h-full relative"}>
      <Input className={"border-none text-md md:text-2xl"} value={title} placeholder={"Article Title"} onChange={(e) => setTitle(e.target.value)} />
      <Separator />
      <div className={"space-y-4"}>
        <div>Image</div>
        {image ? (
          <div className="flex gap-2">
            <div
              className="w-1/2 max-h-52 rounded-xl bg-gray-700 bg-cover bg-center bg-no-repeat shadow lg:w-4/5"
              style={{
                backgroundImage: `url(${image})`,
                aspectRatio: "1 / 1"
              }}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => {
                setImage("")
              }}
            >
              <TrashIcon className="mx-auto h-5 w-5" />
            </Button>
          </div>
        ) : (
          <PictureSelectPopover
            onSelect={(url) => {
              setImage(url)
            }}
            uploadPath={UPLOAD_PATH_POST}
            onUpload={uploadFile}
            side={"bottom"}
          >
            <button type={"button"} className={cn("flex h-36 cursor-pointer w-full flex-col items-center justify-center rounded-lg border border-dashed")}>
              <ImagePlus className="text-muted-foreground h-14 w-14" />
            </button>
          </PictureSelectPopover>
        )}
      </div>
      <div className={"space-y-4"}>
        <div>Description</div>
        <Textarea className={"border border-white/10"} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div className={"space-y-4"}>
        <div>Content</div>
        <div id="vditor" className="vditor" style={{ minHeight: "calc(100vh - 28rem)" }} />
      </div>
      <Button type={"button"} onClick={handleSave} className="z-100 fixed bottom-8 md:bottom-16 w-16 h-16 p-0 right-4 rounded-full shadow-xl" disabled={isPending}>
        <Save width={64} height={64} />
      </Button>
    </div>
  )
}

export default NewArticlePage
