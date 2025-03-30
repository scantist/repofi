"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { DaoContentType } from "@prisma/client"
import { Loader2, Plus } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import TeamItem from "~/app/dao/[id]/_components/team-item"
import ActionDialog from "~/app/dao/[id]/edit/team/_components/action-dialog"
import CardWrapper from "~/components/card-wrapper"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { api } from "~/trpc/react"
import { type RoadmapContentParams, type TeamContentParams, TeamContentParamsSchema, type TeamData } from "~/types/data"

interface BaseFormProps {
  id: string
  isNew: boolean
  data: TeamContentParams
}

const TeamForm = ({ id, isNew, data }: BaseFormProps) => {
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

  const isPending = useMemo(() => {
    return isCreatePending || isUpdatePending
  }, [isCreatePending, isUpdatePending])
  const form = useForm<TeamContentParams>({
    resolver: zodResolver(TeamContentParamsSchema, { async: true }),
    reValidateMode: "onBlur",
    defaultValues: {
      ...data,
      title: data.title.trim().length === 0 ? "Team & Community" : data.title
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
  const submit = (values: RoadmapContentParams) => {
    console.log("values ---- ", values)
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
  const handleItemSubmit = (data: TeamData, index: number, handleClose: () => void) => {
    console.log("data, index", data, index)
    const currentValues: TeamData[] = getValues("data") || []
    let updatedValues: TeamData[]

    if (index >= 0 && index < currentValues.length) {
      updatedValues = [...currentValues.slice(0, index), data, ...currentValues.slice(index + 1)]
    } else {
      updatedValues = [...currentValues, data]
    }
    setValue("data", updatedValues, { shouldValidate: true })
    handleClose()
  }
  const handleItemDelete = (index: number) => {
    const currentValues: TeamData[] = getValues("data") || []
    const updatedValues: TeamData[] = currentValues.filter((_, i) => i !== index)
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
            <div className={"grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"}>
              {field.value.map((item: TeamData, index: number) => (
                <ActionDialog data={item} index={index} key={`TEAM_${item.title}_${item.name}`} handleAddOrUpdate={handleItemSubmit}>
                  <div className={"w-full h-full"}>
                    <TeamItem data={item} className={"min-h-60"} onDelete={() => handleItemDelete(index)} />
                  </div>
                </ActionDialog>
              ))}
              <ActionDialog data={undefined} handleAddOrUpdate={handleItemSubmit}>
                <div className={"w-full h-full"}>
                  <CardWrapper
                    className={"col-span-1 sm:col-span-2 md:col-span-1"}
                    contentClassName={"flex-col min-h-60 h-full cursor-pointer  flex justify-center items-center gap-4 text-muted-foreground"}
                  >
                    <Plus className={"mx-auto"} />
                    <div>Add new team member.</div>
                  </CardWrapper>
                </div>
              </ActionDialog>
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

export default TeamForm
