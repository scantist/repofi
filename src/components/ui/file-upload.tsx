"use client"
import React from "react"
import {
  type ChangeEventHandler,
  type DragEventHandler,
  type FC,
  type MouseEventHandler,
  type ReactNode,
  useRef
} from "react"
import { TrashIcon, UploadCloudIcon } from "lucide-react"
import { cn } from "~/lib/utils"

export type ClassReplacer = string | ((original: string) => string);

export function formatFileSize(size: number) {
  if (size < 1024) {
    return size + " bytes"
  } else if (size >= 1024 && size < 1048576) {
    return (size / 1024).toFixed(1) + " KB"
  } else if (size >= 1048576) {
    return (size / 1048576).toFixed(1) + " MB"
  }
}

interface FileUploadProps {
  value: File | undefined;
  fileSizeLimit: number;
  fileTypes: string[];
  label?: string;
  description?:
    | ReactNode
    | ((fileSizeLimit: number, fileTypes: string[]) => ReactNode);
  className?: ClassReplacer;
  labelClass?: ClassReplacer;
  icon?: ReactNode;
  onChange: (file: File | undefined) => unknown;
  onError: (message: string) => unknown;
}

const labelBaseCls = "w-full truncate text-center"

const FileUpload: FC<FileUploadProps> = ({
  value,
  fileSizeLimit = 20_000_000,
  fileTypes,
  label = "Drag file here or click to browse files",
  description = (sizeLimt) => `File size limit: ${formatFileSize(sizeLimt)}`,
  className = "",
  labelClass = "",
  icon = <UploadCloudIcon className="h-12 w-12 text-primary" />,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onError = () => {}
}) => {
  const fileInput = useRef<HTMLInputElement>(null)
  // const [value, setValue] = useState<File>();

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files.length === 1) {
      const file = e.target.files[0]
      if (file?.size ?? 0 < fileSizeLimit) {
        onChange(file)
      } else {
        onError(
          "Uploaded file cannot be larger than " +
            formatFileSize(fileSizeLimit),
        )
      }
    }
  }

  const handleFileRemove: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    onChange(undefined)

    if (fileInput.current?.value) {
      fileInput.current.value = ""
    }
  }

  const handleFileDrop: DragEventHandler<HTMLInputElement> = (e) => {
    if (e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0]
      const fileTypeMatches = file?.type && fileTypes.includes(file.type)
      const fileSuffixMatches =
        file?.name && fileTypes.some((x) => file.name.endsWith(x))

      if (fileTypeMatches ?? fileSuffixMatches) {
        return
      } else {
        onError(`This file type ${file?.type} is not allowed`)
      }
    }
    e.preventDefault()
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border p-6",
        className,
      )}
    >
      <input
        type="file"
        title=""
        ref={fileInput}
        accept={fileTypes.join(",")}
        onChange={handleFileChange}
        // onDrop={handleFileDrop}
        className="absolute inset-0 block h-full w-full cursor-pointer opacity-0"
      />

      {icon}
      {value ? (
        <div className="w-full space-y-0.5">
          <p className={cn(labelBaseCls, labelClass)}>{value.name}</p>
          <p className="w-full text-center text-sm text-muted-foreground">
            {formatFileSize(value.size)}
          </p>
          <button
            type="button"
            className="absolute bottom-2 right-2 text-destructive"
            onClick={handleFileRemove}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="space-y-0.5">
          <p className={cn(labelBaseCls, labelClass)}>{label}</p>
          <div className="w-full text-center text-sm text-muted-foreground">
            {typeof description === "function"
              ? description(fileSizeLimit, fileTypes)
              : description}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload
