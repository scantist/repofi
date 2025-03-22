"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { DaoContentType } from "@prisma/client"
import { Plus } from "lucide-react"
import React, { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import ListRow from "~/app/dao/[id]/_components/list-row"
import RoadmapItem from "~/app/dao/[id]/_components/roadmap-item"
import ActionDialog from "~/app/dao/[id]/edit/roadmap/_components/action-dialog"
import CardWrapper from "~/components/card-wrapper"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { api } from "~/trpc/react"
import { type RoadmapContentParams, type RoadmapData, RoadmapParamsSchema } from "~/types/data"

interface BaseFormProps {
  id: string
}

const RoadmapForm = ({ id }: BaseFormProps) => {
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
    return data?.contents?.find((content) => content.type === "ROADMAP") === undefined
  }, [data])

  const { mutate: createMutate, isPending: isCreatePending } = api.daoContent.create.useMutation({
    onSuccess: async () => {
      await refetch()
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed to create action! ${error.message}`)
    }
  })
  const { mutate: updateMutate, isPending: isUpdatePending } = api.daoContent.update.useMutation({
    onSuccess: async () => {
      await refetch()
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed to update action! ${error.message}`)
    }
  })
  const roadmap = useMemo(() => {
    const roadmapFind = data?.contents?.find((content) => content.type === "ROADMAP")
    if (!roadmapFind) {
      return {
        title: "",
        sort: 0,
        type: DaoContentType.ROADMAP,
        data: [],
        enable: true,
        id: ""
      } as RoadmapContentParams
    }
    return roadmapFind as unknown as RoadmapContentParams
  }, [data, isNewData])
  const form = useForm<RoadmapContentParams>({
    resolver: zodResolver(RoadmapParamsSchema, { async: true }),
    reValidateMode: "onBlur",
    defaultValues: {
      ...roadmap
    }
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    getValues
  } = form
  useEffect(() => {
    if (!isPending && roadmap) {
      reset(roadmap)
    }
  }, [roadmap, isPending, reset])
  const submit = (values: RoadmapContentParams) => {
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
  const handleItemSubmit = (data: RoadmapData, index: number, handleClose: () => void) => {
    const currentValues: RoadmapData[] = getValues("data") || []
    let updatedValues: RoadmapData[]

    if (index >= 0 && index < currentValues.length) {
      updatedValues = [...currentValues.slice(0, index), data, ...currentValues.slice(index + 1)]
    } else {
      updatedValues = [...currentValues, data]
    }
    setValue("data", updatedValues, { shouldValidate: true })
    handleClose()
  }
  const handleItemDelete = (index: number) => {
    const currentValues: RoadmapData[] = getValues("data") || []
    const updatedValues: RoadmapData[] = currentValues.filter((_, i) => i !== index)
    setValue("data", updatedValues, { shouldValidate: true })
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
        </div>
        <FormField
          control={control}
          name="data"
          render={({ field }) => (
            <div className={"flex flex-col flex-wrap gap-8"}>
              <ActionDialog data={undefined} handleAddOrUpdate={handleItemSubmit}>
                <div className={"w-full h-full"}>
                  <CardWrapper contentClassName={" min-h-28 h-full cursor-pointer  flex justify-center items-center"}>
                    <Plus className={"mx-auto"} />
                  </CardWrapper>
                </div>
              </ActionDialog>
              {field.value.map((item: RoadmapData, index: number) => (
                <ActionDialog data={item} index={index} key={`ROADMAP_${item.date}_${item.description}`} handleAddOrUpdate={handleItemSubmit}>
                  <div className={"w-full h-full min-h-28"}>
                    <RoadmapItem key={`${item.description}-${item.date}_RI`} data={item} onDelete={() => handleItemDelete(index)} />
                  </div>
                </ActionDialog>
              ))}
            </div>
          )}
        />
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

export default RoadmapForm
