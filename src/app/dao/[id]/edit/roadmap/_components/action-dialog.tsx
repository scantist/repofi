import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { formatWithOptions } from "date-fns/fp"
import { CalendarIcon } from "lucide-react"
import React, { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Textarea } from "~/components/ui/textarea"
import { cn } from "~/lib/utils"
import { type RoadmapData, RoadmapSchema } from "~/types/data"

export interface ActionDialogProps {
  children: React.ReactNode
  data?: RoadmapData
  index?: number
  handleAddOrUpdate: (data: RoadmapData, index: number, close: () => void) => void
}

const defaultValue: RoadmapData = {
  date: "",
  description: ""
}

const ActionDialog = ({ children, data = defaultValue, index = -1, handleAddOrUpdate }: ActionDialogProps) => {
  const [open, setOpen] = React.useState(false)
  const form = useForm<RoadmapData>({
    resolver: zodResolver(RoadmapSchema, { async: true }),
    reValidateMode: "onBlur",
    defaultValues: {
      ...data
    }
  })
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = form

  useEffect(() => {
    reset(data)
  }, [data])
  const submit = (values: RoadmapData) => {
    handleAddOrUpdate(values, index, () => setOpen(false))
  }
  const isNew = useMemo(() => {
    return index < 0
  }, [index])

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add" : "Edit"} Roadmap</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <FormField
              control={control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(format(date, "yyyy-MM-dd"))
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage>{errors.date?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Enter article description" {...field} />
                  </FormControl>
                  <FormMessage>{errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button onClick={() => handleSubmit(submit)}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ActionDialog
