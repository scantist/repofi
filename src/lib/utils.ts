import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function convertToBase64(file: File) {
  return new Promise<string | undefined>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    reader.onload = () => resolve(reader.result?.toString().split(",")[1])
    reader.onerror = () => reject(new Error("File reading error"))
  })
}


export const makeFileName = (file: File) => {
  const ext = file.name.split(".").pop() ?? ""
  const originalName = file.name.replace(`.${ext}`, "")
  return `${Date.now()}_${originalName
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .substring(0, 10)}.${ext}`
}
