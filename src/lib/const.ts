import { type LoadingState } from "~/components/ui/multi-step-loader"

export const UPLOAD_PATH_POST = "launchpad/avatar/"

export const LaunchNativeSteps: LoadingState[] = [
  { text: "Launch dao token." },
  { text: "Finally loading...." }
]

export const LaunchNoNativeSteps: LoadingState[] = [
  { text: "Approve asset token." },
  ...LaunchNativeSteps
]
