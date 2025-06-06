"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, SquareDashedMousePointer } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import ListRow from "~/app/dao/[id]/_components/list-row"
import ActionDialog from "~/app/dao/[id]/edit/list/_components/action-dialog"
import CardWrapper from "~/components/card-wrapper"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
import { type ListRowContentParams, ListRowContentParamsSchema, type ListRowData } from "~/types/data"

interface BaseFormProps {
  id: string
  isNew: boolean
  data: ListRowContentParams
}

const ListForm = ({ id, isNew, data }: BaseFormProps) => {
  const [isNewState, setIsNewState] = useState(isNew)
  const [daoContentId, setDaoContentId] = useState(data.id)

  const { mutate: createMutate, isPending: isCreatePending } = api.daoContent.create.useMutation({
    onSuccess: async () => {
      toast.success("Success create to action!")
      setDaoContentId(data.id)
      setIsNewState(false)
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed to action! ${error.message}`)
    }
  })
  const { mutate: updateMutate, isPending: isUpdatePending } = api.daoContent.update.useMutation({
    onSuccess: async () => {
      toast.success("Success update to action!")
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed to action! ${error.message}`)
    }
  })
  const form = useForm<ListRowContentParams>({
    resolver: zodResolver(ListRowContentParamsSchema, { async: true }),
    reValidateMode: "onBlur",
    defaultValues: {
      ...data,
      title: data.title.trim().length === 0 ? "Articles" : data.title
    }
  })

  const isPending = useMemo(() => {
    return isCreatePending || isUpdatePending
  }, [isCreatePending, isUpdatePending])
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    getValues
  } = form
  const submit = (values: ListRowContentParams) => {
    if (isNewState) {
      createMutate({
        daoId: id,
        data: values
      })
    } else {
      updateMutate({
        daoContentId: daoContentId,
        data: values
      })
    }
  }
  const handleItemSubmit = (data: ListRowData, index: number, handleClose: () => void) => {
    const currentValues: ListRowData[] = getValues("data") || []
    let updatedValues: ListRowData[]

    if (index >= 0 && index < currentValues.length) {
      updatedValues = [...currentValues.slice(0, index), data, ...currentValues.slice(index + 1)]
    } else {
      updatedValues = [...currentValues, data]
    }
    setValue("data", updatedValues, { shouldValidate: true })
    handleClose()
  }
  const handleItemDelete = (index: number) => {
    const currentValues: ListRowData[] = getValues("data") || []
    const updatedValues: ListRowData[] = currentValues.filter((_, i) => i !== index)
    setValue("data", updatedValues, { shouldValidate: true })
  }
  const router = useRouter()

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        <div className={"max-w-2xl space-y-8"}>
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Heading</FormLabel>
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
                <FormLabel>Display Order</FormLabel>
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
        </div>
        <FormField
          control={control}
          name="data"
          render={({ field }) => (
            <div className={"grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"}>
              {field.value.length > 0 && (
                <div className={"flex flex-row gap-6 w-full col-span-1 sm:col-span-2 md:col-span-3"}>
                  <Button
                    type={"button"}
                    variant={"outline"}
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(`/dao/${id}/article/new`)
                    }}
                  >
                    New article
                  </Button>
                  <ActionDialog data={undefined} handleAddOrUpdate={handleItemSubmit}>
                    <Button variant={"outline"}>Link external article</Button>
                  </ActionDialog>
                </div>
              )}
              {field.value.map((item: ListRowData, index: number) => (
                <ActionDialog data={item} index={index} key={`LIST_ROW_${item.title}_${item.link}`} handleAddOrUpdate={handleItemSubmit}>
                  <div className={"w-full h-full min-h-76"}>
                    <ListRow key={`${item.title}-${item.link}`} data={item} className={" min-h-76"} onDelete={() => handleItemDelete(index)} />
                  </div>
                </ActionDialog>
              ))}
              {field.value.length === 0 && (
                <div className={"col-span-1 sm:col-span-2 md:col-span-3 border border-primary border-dashed rounded-md flex flex-col justify-center items-center h-64 gap-2"}>
                  <SquareDashedMousePointer size={98} className=" text-primary mb-2" />
                  <div className={cn("text-xl font-bold text-gray-500")}>No Article</div>
                  <div className={"flex sm:flex-row gap-6"}>
                    <Button
                      type={"button"}
                      onClick={(e) => {
                        e.preventDefault()
                        router.push(`/dao/${id}/article/new`)
                      }}
                    >
                      New article
                    </Button>
                    <ActionDialog data={undefined} handleAddOrUpdate={handleItemSubmit}>
                      <Button>Link external article</Button>
                    </ActionDialog>
                  </div>
                </div>
              )}
            </div>
          )}
        />
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

export default ListForm
