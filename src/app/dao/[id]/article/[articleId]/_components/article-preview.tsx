"use client"

import { useEffect, useRef } from "react"
import Vditor from "vditor"
import "vditor/dist/index.css"
import { FilePenLine } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"

const ArticlePreview = ({ daoId, id, content }: { daoId: string; id: string; content: string }) => {
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!previewRef.current) return

    // 直接使用 Vditor.preview 方法渲染预览内容，而不是创建编辑器实例
    void Vditor.preview(previewRef.current, content, {
      mode: "dark",
      theme: {
        current: "Dark"
      },
      hljs: {
        style: "base16-snazzy"
      },
      anchor: 1,
      lang: "en_US",
      after: () => {
        // 预览渲染完成后的回调
      }
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
