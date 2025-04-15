import type { visibleState } from "~/components/ui/multi-step-loader"

export const UPLOAD_PATH_POST = "launchpad/avatar/"

export const UPLOAD_ARTICLE_PATH_POST = "launchpad/article/"

export const LaunchNativeSteps: visibleState[] = [{ text: "Initializing DAO Token" }, { text: "Finally loading." }]

export const LaunchNoNativeSteps: visibleState[] = [{ text: "Approve asset amount." }, ...LaunchNativeSteps]
export const toolbar = [
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
