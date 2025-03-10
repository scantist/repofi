"use client"
import CardWrapper from "~/components/card-wrapper"
import { useStore } from "jotai"
import { createDaoAtom } from "~/store/create-dao-store"
import { Controller, useForm } from "react-hook-form"
import { type CreateDaoParams, createDaoParamsSchema } from "~/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { Form } from "~/components/ui/form"
import { Button } from "~/components/ui/button"
import { ImagePlus, Loader2, Sparkle, TrashIcon, Wallet } from "lucide-react"
import PictureSelectPopover from "~/components/picture-select-popover"
import { UPLOAD_PATH_POST } from "~/lib/const"
import { uploadFile } from "~/app/actions"
import { cn } from "~/lib/utils"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import {
  Select, SelectContent,
  SelectItem, SelectTrigger,
  SelectValue
} from "~/components/ui/select"
import { DaoType } from "@prisma/client"

const InformationForm = () => {
  const store = useStore()
  const createDao = store.get(createDaoAtom)

  const form = useForm<CreateDaoParams>({
    resolver: zodResolver(createDaoParamsSchema, { async: true }),
    reValidateMode: "onBlur",
    defaultValues: { ...createDao }
  })
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = form
  const [isVerifying, startVerify] = useTransition()

  const submit = (data: CreateDaoParams) => {}
  return (
    <CardWrapper className={"bg-card col-span-1 w-full md:col-span-2"}>
      <Form {...form}>
        <form
          className={"grid w-full grid-cols-4 gap-10 overflow-hidden p-9"}
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit(submit)(e)
          }}
        >
          <div className="col-span-4 space-y-4 lg:col-span-1">
            <div className="flex flex-col gap-4">Avatar</div>
            <Controller
              control={control}
              name="avatar"
              render={({ field }) => {
                return field.value ? (
                  <div className="flex gap-2 lg:flex-col">
                    <div
                      className="w-1/2 rounded-xl bg-gray-700 bg-cover bg-center bg-no-repeat shadow lg:w-full"
                      style={{
                        backgroundImage: `url(${field.value})`,
                        aspectRatio: "1 / 1"
                      }}
                    ></div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={() => {
                        field.onChange("")
                      }}
                    >
                      <TrashIcon className="mx-auto h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <PictureSelectPopover
                    onSelect={(url) => {
                      field.onChange(url)
                    }}
                    uploadPath={UPLOAD_PATH_POST}
                    onUpload={uploadFile}
                  >
                    <button
                      className={cn(
                        "flex h-36 w-36 flex-col items-center justify-center rounded-full border border-dashed",
                        errors.avatar?.message
                          ? "border-destructive"
                          : "border-input",
                        "border-primary",
                      )}
                    >
                      <ImagePlus className="text-muted-foreground h-14 w-14" />
                    </button>
                  </PictureSelectPopover>
                )
              }}
            />
            <p className="text-destructive mt-2 text-sm">
              {!watch("avatar") &&
                errors.avatar?.message &&
                "Avatar is required"}
            </p>
          </div>
          <div className="col-span-4 grid grid-cols-3 gap-8 lg:col-span-3">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    {...field}
                    id="name"
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.name ? "border-destructive" : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      field.onChange(v.target.value)
                    }}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.name?.message &&
                      (errors.name.message === "Required"
                        ? "Name is required."
                        : errors.name.message)}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="ticker"
              render={({ field }) => (
                <div className="col-span-1 space-y-2">
                  <Label htmlFor="ticker">Ticker</Label>
                  <div className="relative">
                    <p className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 font-light">
                      $
                    </p>
                    <Input
                      {...field}
                      id="ticker"
                      className={cn(
                        "h-12 bg-transparent pl-8 text-lg uppercase",
                        errors.ticker ? "border-destructive" : "border-input",
                        "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                      )}
                      disabled={isVerifying}
                      onChange={(v) => {
                        field.onChange(v.target.value)
                      }}
                    />
                  </div>
                  <p className="text-destructive mt-2 text-sm">
                    {errors.ticker?.message &&
                      (errors.ticker.message === "Required"
                        ? "Ticker is required."
                        : errors.ticker.message)}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="type">
                    Type
                  </Label>
                  <Select
                    onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.x ? "border-destructive" : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                    )}>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className={"h-12 text-lg"} value={DaoType.CODE}>CODE</SelectItem>
                      <SelectItem className={"h-12 text-lg"} value={DaoType.DATASET}>DATASET</SelectItem>
                      <SelectItem className={"h-12 text-lg"} value={DaoType.MODEL}>MODEL</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-destructive mt-2 text-sm">
                    {errors.x?.message}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    {...field}
                    id="description"
                    className={cn(
                      "h-40 resize-none bg-transparent text-lg",
                      errors.description
                        ? "border-destructive"
                        : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      field.onChange(v.target.value)
                    }}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.description?.message && "Description is required"}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="x"
              render={({ field }) => (
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="x">
                    Twitter / X
                    <span className="text-muted-foreground pl-4 text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    {...field}
                    id="x"
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.x ? "border-destructive" : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      field.onChange(v.target.value)
                    }}
                    value={field.value ?? ""}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.x?.message}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="telegram"
              render={({ field }) => (
                <div className="col-span-3 space-y-4">
                  <Label htmlFor="telegram">
                    Telegram
                    <span className="text-muted-foreground pl-4 text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    {...field}
                    id="telegram"
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.telegram ? "border-destructive" : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      field.onChange(v.target.value)
                    }}
                    value={field.value ?? ""}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.telegram?.message}
                  </p>
                </div>
              )}
            />
            <Controller
              control={control}
              name="website"
              render={({ field }) => (
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="website">
                    Website
                    <span className="text-muted-foreground pl-4 text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    {...field}
                    id="website"
                    className={cn(
                      "h-12 bg-transparent text-lg",
                      errors.website ? "border-destructive" : "border-input",
                      "border-primary focus:border-secondary focus:ring-secondary focus-visible:ring-secondary",
                    )}
                    disabled={isVerifying}
                    onChange={(v) => {
                      field.onChange(v.target.value)
                    }}
                    value={field.value ?? ""}
                  />
                  <p className="text-destructive mt-2 text-sm">
                    {errors.website?.message}
                  </p>
                </div>
              )}
            />
          </div>
          <div className="flex items-center justify-center col-span-4">
            <Button
              className="h-16 w-full max-w-80 rounded-lg py-8 text-lg font-bold [&_svg]:size-6"
              type="submit"
              disabled={isVerifying}
            >
              Next! Connect your wallet
              {isVerifying ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Wallet className="" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default InformationForm
