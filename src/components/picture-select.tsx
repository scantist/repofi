import { useState, useTransition } from "react"
import { toast } from "sonner"
import { UPLOAD_PATH_POST } from "~/lib/const"
import { convertToBase64, makeFileName } from "~/lib/utils"
import type { FileUploader } from "~/types/data"
import { Button } from "./ui/button"
import FileUpload from "./ui/file-upload"

export type PictureSelectProps = {
  onSelect: (url: string) => void
  onUpload: FileUploader
  uploadPath?: string
}

const PictureSelect = ({ onSelect, onUpload, uploadPath }: PictureSelectProps) => {
  return <UploadView onSelect={onSelect} uploadPath={uploadPath} onUpload={onUpload} />
}

const UploadView = ({
  onSelect,
  onUpload,
  uploadPath = UPLOAD_PATH_POST
}: {
  onSelect: (url: string) => void
  onUpload: FileUploader
  uploadPath?: string
}) => {
  const [file, setFile] = useState<File>()
  const [imageSrc, setImageSrc] = useState("")
  const [isUploading, startUpload] = useTransition()

  const handleUpload = async () => {
    if (file) {
      const fileData = await convertToBase64(file)
      if (fileData) {
        startUpload(async () => {
          const { success, url, message } = await onUpload({
            file: fileData,
            fileName: uploadPath + (uploadPath.endsWith("/") ? "" : "/") + makeFileName(file)
          })
          if (success && url) {
            setFile(undefined)
            onSelect(url)
          } else {
            toast.error(`File upload failed: ${message}`)
          }
        })
      } else {
        toast.error("Failed to encode the file")
      }
    } else {
      toast.error("No file selected")
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <FileUpload
          value={file}
          className="h-52 py-12"
          fileSizeLimit={1024 * 1024 * 5}
          fileTypes={["image/png", "image/jpeg", "image/jpg", "image/gif", "image/*"]}
          onChange={(file) => {
            setFile(file)
            if (file) {
              const reader = new FileReader()
              reader.readAsDataURL(file)
              reader.onload = () => {
                setImageSrc(reader.result as string)
              }
            } else {
              setImageSrc("")
            }
          }}
          onError={(message) => {
            toast.error(message)
          }}
        />
        {imageSrc && <div className="pointer-events-none absolute inset-1 bg-background bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${imageSrc})` }} />}
      </div>
      <div className="flex justify-center">
        <Button size="sm" type="button" disabled={!file || isUploading} onClick={() => void handleUpload()}>
          {isUploading ? "Uploading ..." : "Upload & Select"}
        </Button>
      </div>
    </div>
  )
}

export default PictureSelect
