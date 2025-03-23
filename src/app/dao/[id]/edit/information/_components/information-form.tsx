"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus, Loader2, TrashIcon } from "lucide-react"
import React, { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { uploadFile } from "~/app/actions"
import PictureSelectPopover from "~/components/picture-select-popover"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { UPLOAD_PATH_POST } from "~/lib/const"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
import { type InformationContentParams, InformationContentParamsSchema, type ListRowContentParams, ListRowContentParamsSchema, type ListRowData } from "~/types/data"

interface BaseFormProps {
  id: string
  isNew: boolean
  data: InformationContentParams
}

const InformationForm = ({ id, isNew, data }: BaseFormProps) => {
  const [isNewState, setIsNewState] = useState(isNew)
  const [daoContentId, setDaoContentId] = useState(data.id)
  const { mutate: createMutate, isPending: isCreatePending } = api.daoContent.create.useMutation({
    onSuccess: async (data) => {
      toast.success("Success create to action!")
      setDaoContentId(data.id)
      setIsNewState(false)
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed create to action! ${error.message}`)
    }
  })
  const { mutate: updateMutate, isPending: isUpdatePending } = api.daoContent.update.useMutation({
    onSuccess: async () => {
      toast.success("Success update to action!")
      setIsNewState(false)
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed update to action! ${error.message}`)
    }
  })
  const isPending = useMemo(() => {
    return isCreatePending || isUpdatePending
  }, [isCreatePending, isUpdatePending])
  const form = useForm<InformationContentParams>({
    resolver: zodResolver(InformationContentParamsSchema, { async: true }),
    reValidateMode: "onBlur",
    defaultValues: {
      ...data
    }
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = form
  const submit = (values: InformationContentParams) => {
    if (isNewState) {
      createMutate({
        daoId: id,
        data: values
      })
    } else {
      updateMutate({
        daoContentId,
        data: values
      })
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        <div className={"max-w-2xl space-y-8"}>
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter content block title" {...field} disabled={isPending} />
                </FormControl>
                <FormDescription>A concise and descriptive title for this content block.</FormDescription>
                <FormMessage>{errors.title?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Block sort</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter display order (e.g., 1, 2, 3)"
                    type="number"
                    {...field}
                    disabled={isPending}
                    onChange={(e) => {
                      try {
                        const number = Number.parseInt(e.target.value)
                        field.onChange(number)
                      } catch (error) {}
                    }}
                  />
                </FormControl>
                <FormDescription>Determines the display order of this block. Lower numbers appear first.</FormDescription>
                <FormMessage>{errors.sort?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="data.image"
            render={({ field }) =>
              field.value ? (
                <div className="flex gap-2">
                  <div
                    className="w-1/2 max-h-52  bg-gray-700 bg-cover bg-center bg-no-repeat shadow lg:w-4/5"
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
                      "flex h-36 w-36 flex-col items-center justify-center rounded-lg border border-dashed",
                      errors.data?.image?.message ? "border-destructive" : "border-input",
                      "border-primary"
                    )}
                  >
                    <ImagePlus className="text-muted-foreground h-14 w-14" />
                  </button>
                </PictureSelectPopover>
              )
            }
          />
          <FormField
            control={control}
            name="data.information"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Information</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="Enter information" {...field} disabled={isPending} />
                </FormControl>
                <FormDescription>Image information</FormDescription>
                <FormMessage>{errors.data?.information?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className={"flex flex-row gap-x-6"}>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button variant={"outline"} onClick={() => reset()} disabled={isPending}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default InformationForm
