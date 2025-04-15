"use client"
import { useEffect, useState } from "react"
import { useDaoContext } from "~/app/dao/[id]/context"
import { Input } from "~/components/ui/input"
import "vditor/dist/index.css"
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Vditor from "vditor"
import { Button } from "~/components/ui/button"
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
  const [title, setTitle] = useState("")
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
    console.log("Saving article:", { title, content })
    mutate({
      daoId: detail.id,
      params: {
        title,
        content
      }
    })
  }

  return (
    <div className={" space-y-8 min-h-full relative"}>
      <Input className={"border-none text-md md:text-2xl"} value={title} placeholder={"Article Title"} onChange={(e) => setTitle(e.target.value)} />
      <div id="vditor" className="vditor" style={{ minHeight: "calc(100vh - 28rem)" }} />
      <Button type={"button"} onClick={handleSave} className="z-100 fixed bottom-8 md:bottom-16 w-16 h-16 p-0 right-4 rounded-full shadow-xl" disabled={isPending}>
        <Save width={64} height={64} />
      </Button>
    </div>
  )
}

export default NewArticlePage
