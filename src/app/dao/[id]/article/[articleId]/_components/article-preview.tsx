"use client"

import { FilePenLine } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import Vditor from "vditor"
import { Button } from "~/components/ui/button"
import "vditor/dist/index.css"

const ArticlePreview = ({ daoId, id, content }: { daoId: string; id: string; content: string }) => {
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!previewRef.current) return

    void Vditor.preview(previewRef.current, content, {
      mode: "dark",
      theme: {
        current: "Dark"
      },
      hljs: {
        style: "base16-snazzy",
        enable: true
      },
      anchor: 1,
      lang: "en_US"
    })
  }, [content])
  const router = useRouter()
  const handleEdit = () => {
    router.push(`/dao/${daoId}/article/${id}/edit`)
  }
  return (
    <>
      <div ref={previewRef} className="vditor-preview vditor p-0" style={{ minHeight: "calc(100vh - 28rem)", border: 0, padding: 0 }} />
      <Button type={"button"} onClick={handleEdit} className="z-100 fixed bottom-8 md:bottom-16 w-16 h-16 p-0 right-4 rounded-full shadow-xl">
        <FilePenLine />
      </Button>
    </>
  )
}

export default ArticlePreview
