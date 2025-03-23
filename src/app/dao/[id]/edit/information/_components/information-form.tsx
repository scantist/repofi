"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { DaoContentType } from "@prisma/client"
import { ImagePlus, Plus, TrashIcon } from "lucide-react"
import React, { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { uploadFile } from "~/app/actions"
import PictureSelectPopover from "~/components/picture-select-popover"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { UPLOAD_PATH_POST } from "~/lib/const"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
import { type InformationContentParams, InformationContentParamsSchema, type ListRowContentParams, ListRowContentParamsSchema, type ListRowData } from "~/types/data"

interface BaseFormProps {
  id: string
}

const InformationForm = ({ id }: BaseFormProps) => {
  const { data, isPending, refetch } = api.dao.detail.useQuery(
    { daoId: id },
    {
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false
    }
  )
  const isNewData = useMemo(() => {
    return data?.contents?.find((content) => content.type === "INFORMATION") === undefined
  }, [data])

  const { mutate: createMutate, isPending: isCreatePending } = api.daoContent.create.useMutation({
    onSuccess: async () => {
      await refetch()
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed create to action! ${error.message}`)
    }
  })
  const { mutate: updateMutate, isPending: isUpdatePending } = api.daoContent.update.useMutation({
    onSuccess: async () => {
      await refetch()
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed update to action! ${error.message}`)
    }
  })
  const information = useMemo(() => {
    const informationFind = data?.contents?.find((content) => content.type === "INFORMATION")
    if (!informationFind) {
      return {
        title: "",
        sort: 0,
        type: DaoContentType.INFORMATION,
        data: {
          information: "",
          image: ""
        },
        enable: true,
        id: ""
      } as InformationContentParams
    }
    return informationFind as unknown as InformationContentParams
  }, [data, isNewData])
  const form = useForm<InformationContentParams>({
    resolver: zodResolver(InformationContentParamsSchema, { async: true }),
    reValidateMode: "onBlur",
    defaultValues: {
      ...information
    }
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = form
  useEffect(() => {
    if (!isPending && information) {
      reset(information)
    }
  }, [information, isPending, reset])
  const submit = (values: InformationContentParams) => {
    if (isNewData) {
      createMutate({
        daoId: id,
        data: values
      })
    } else {
      updateMutate({
        daoContentId: values.id,
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
                  <Input placeholder="Enter information" {...field} disabled={isPending} />
                </FormControl>
                <FormDescription>Image information</FormDescription>
                <FormMessage>{errors.data?.information?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className={"flex flex-row gap-x-6"}>
          <Button type="submit" disabled={isPending || isCreatePending || isUpdatePending}>
            Save Changes
          </Button>
          <Button variant={"outline"} onClick={() => reset()} disabled={isPending || isCreatePending || isUpdatePending}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default InformationForm
