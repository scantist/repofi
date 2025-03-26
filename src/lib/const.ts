import type { visibleState } from "~/components/ui/multi-step-loader"

export const UPLOAD_PATH_POST = "launchpad/avatar/"

export const LaunchNativeSteps: visibleState[] = [{text: "Launch dao token."}, {text: "Finally loading."}]

export const LaunchNoNativeSteps: visibleState[] = [{text: "Approve asset amount."}, ...LaunchNativeSteps]
