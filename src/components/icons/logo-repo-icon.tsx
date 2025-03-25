import { type FC } from "react"
import { cn } from "~/lib/utils"

type IconProps = {
  className?: string
}

const LogoRepoIcon: FC<IconProps> = ({ className }) => {
  return (
    <svg className={cn("size-12", className)} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="logoRepoIconTitle">
      <title id="logoRepoIconTitle">Logo Repo Icon</title>
      <path d="M51.5703 0.821785V29.7345L78.2453 56.4091L86.5158 48.1387C89.945 44.7096 89.945 39.1383 86.5158 35.7092L51.5991 0.792969L51.5703 0.821785Z" fill="#4930C4" />
      <path
        d="M51.5897 54.1025V83.0248L51.6185 83.0536L86.5736 48.099C89.9836 44.6891 89.9836 39.1659 86.5736 35.7559L78.255 27.4375L63.8081 41.8842L51.5801 54.1121L51.5897 54.1025Z"
        fill="#F8D55F"
      />
      <path d="M37.6326 83.0248V54.1121L10.9576 27.4375L2.68715 35.7079C-0.742072 39.1371 -0.742072 44.7083 2.68715 48.1375L37.6038 83.0536L37.6326 83.0248Z" fill="#4930C4" />
      <path
        d="M37.6115 29.7441V0.821785L37.5827 0.792969L2.61806 35.7476C-0.791957 39.1575 -0.791957 44.6807 2.61806 48.0907L10.9366 56.4091L25.3835 41.9624L37.6115 29.7345V29.7441Z"
        fill="#F8D55F"
      />
    </svg>
  )
}

export default LogoRepoIcon
