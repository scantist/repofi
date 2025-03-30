"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus, TrashIcon } from "lucide-react"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { uploadFile } from "~/app/actions"
import PictureSelectPopover from "~/components/picture-select-popover"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { UPLOAD_PATH_POST } from "~/lib/const"
import { type UpdateDaoParamsSchema, updateDaoParamsSchema } from "~/lib/schema"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"

interface BaseFormProps {
  dao: UpdateDaoParamsSchema
  name: string
  url: string
  type: string
  ticker: string
}

const BaseForm = ({ dao, name, url, type, ticker }: BaseFormProps) => {
  const form = useForm<UpdateDaoParamsSchema>({
    resolver: zodResolver(updateDaoParamsSchema, { async: true }),
    reValidateMode: "onBlur",
    defaultValues: {
      ...dao
    }
  })
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = form

  const { mutate: updateDao, isPending } = api.dao.update.useMutation({
    onSuccess: () => {
      toast.success("DAO information updated successfully")
    },
    onError: (error) => {
      toast.error(`Failed to update DAO: ${error.message}`)
    }
  })

  const useUtils = api.useUtils()
  const submit = (values: UpdateDaoParamsSchema) => {
    updateDao(values)
    void useUtils.dao.detail.refetch()
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        <div className={"max-w-2xl space-y-8"}>
          <FormField
            control={control}
            name="avatar"
            render={({ field }) =>
              field.value ? (
                <div className="flex gap-2">
                  <div
                    className="max-w-52 max-h-52  bg-gray-700 bg-cover rounded-full bg-center bg-no-repeat shadow lg:w-4/5"
                    style={{
                      backgroundImage: `url(${field.value})`,
                      aspectRatio: "1 / 1"
                    }}
                  />
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
                  side={"bottom"}
                >
                  <button
                    type={"button"}
                    className={cn(
                      "flex h-36 w-36 flex-col items-center justify-center rounded-full border border-dashed",
                      errors.avatar?.message ? "border-destructive" : "border-input",
                      "border-primary"
                    )}
                  >
                    <ImagePlus className="text-muted-foreground h-14 w-14" />
                  </button>
                </PictureSelectPopover>
              )
            }
          />
          <div className={"flex-col md:flex-row flex gap-x-4"}>
            <FormItem className={"flex-1"}>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled value={name} />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Ticker</FormLabel>
              <FormControl>
                <Input disabled value={ticker} />
              </FormControl>
            </FormItem>
          </div>
          <FormItem>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <Input disabled value={type} />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>Github Repository</FormLabel>
            <FormControl>
              <Input disabled value={url} />
            </FormControl>
          </FormItem>
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="Enter DAO description" {...field} />
                </FormControl>
                <FormDescription>A brief description of your DAO.</FormDescription>
                <FormMessage>{errors.description?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Enter website url" {...field} />
                </FormControl>
                <FormMessage>{errors.website?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="x"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X</FormLabel>
                <FormControl>
                  <Input placeholder="Enter X handle" {...field} />
                </FormControl>
                <FormMessage>{errors.x?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="telegram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram</FormLabel>
                <FormControl>
                  <Input placeholder="Enter telegram handle" {...field} />
                </FormControl>
                <FormMessage>{errors.telegram?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="discord"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discord</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Discord invite link" {...field} />
                </FormControl>
                <FormMessage>{errors.discord?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className={"flex flex-row gap-x-6"}>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant={"outline"} onClick={() => reset()} disabled={isPending}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default BaseForm
