import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus, TrashIcon } from "lucide-react"
import React, { useEffect, useImperativeHandle, useMemo } from "react"
import { useForm } from "react-hook-form"
import { uploadFile } from "~/app/actions"
import PictureSelectPopover from "~/components/picture-select-popover"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { UPLOAD_PATH_POST } from "~/lib/const"
import { cn } from "~/lib/utils"
import { type ListRowData, ListRowDataSchema } from "~/types/data"

export interface ActionDialogProps {
  children: React.ReactNode
  data?: ListRowData
  index?: number
  handleAddOrUpdate: (data: ListRowData, index: number, close: () => void) => void
}

const defaultValue: ListRowData = {
  image: "",
  title: "",
  sort: 0,
  description: "",
  link: ""
}

const ActionDialog = ({ children, data = defaultValue, index = -1, handleAddOrUpdate }: ActionDialogProps) => {
  const [open, setOpen] = React.useState(false)
  const form = useForm<ListRowData>({
    resolver: zodResolver(ListRowDataSchema, { async: true }),
    reValidateMode: "onBlur",
    defaultValues: {
      ...data
    }
  })
  const {
    control,
    formState: { errors },
    reset,
    trigger
  } = form

  useEffect(() => {
    reset(data)
  }, [data])
  const submit = (values: ListRowData) => {
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
          <DialogTitle>{isNew ? "Add" : "Edit"} Article</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={control}
              name="image"
              render={({ field }) =>
                field.value ? (
                  <div className="flex gap-2">
                    <div
                      className="w-1/2 max-h-52 rounded-xl bg-gray-700 bg-cover bg-center bg-no-repeat shadow lg:w-4/5"
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
                        errors.image?.message ? "border-destructive" : "border-input",
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{errors.title?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="sort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display order</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=" (e.g., 1, 2, 3)"
                      type="number"
                      {...field}
                      onChange={(e) => {
                        try {
                          const number = Number.parseInt(e.target.value)
                          field.onChange(number)
                          console.log(number)
                        } catch (error) {}
                      }}
                    />
                  </FormControl>
                  <FormMessage>{errors.sort?.message}</FormMessage>
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
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage>{errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{errors.link?.message}</FormMessage>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                onClick={async () => {
                  const result = await trigger()
                  if (result) {
                    const values = form.getValues()
                    submit(values)
                  }
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ActionDialog
