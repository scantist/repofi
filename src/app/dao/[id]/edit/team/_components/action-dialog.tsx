import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus, TrashIcon } from "lucide-react"
import React, { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { uploadFile } from "~/app/actions"
import PictureSelectPopover from "~/components/picture-select-popover"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { UPLOAD_PATH_POST } from "~/lib/const"
import { cn } from "~/lib/utils"
import { type TeamData, TeamDataSchema } from "~/types/data"

export interface ActionDialogProps {
  children: React.ReactNode
  data?: TeamData
  index?: number
  handleAddOrUpdate: (data: TeamData, index: number, close: () => void) => void
}

const defaultValue: TeamData = {
  name: "",
  avatar: "",
  x: "",
  website: "",
  telegram: "",
  github: "",
  description: "",
  title: "",
  sort: 0
}

const ActionDialog = ({ children, data = defaultValue, index = -1, handleAddOrUpdate }: ActionDialogProps) => {
  const [open, setOpen] = React.useState(false)
  const form = useForm<TeamData>({
    resolver: zodResolver(TeamDataSchema, { async: true }),
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
    console.log(data)
    reset(data)
  }, [data])
  const submit = (values: TeamData) => {
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
      <DialogOverlay>
        <DialogContent className="max-w-[425px] md:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add" : "Edit"} Article</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(submit)} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <FormField
                control={control}
                name="avatar"
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
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter member's name" {...field} />
                    </FormControl>
                    <FormMessage>{errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter member's title" {...field} />
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
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter display order (e.g., 1, 2, 3)"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          try {
                            const number = Number.parseInt(e.target.value)
                            field.onChange(number)
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
                  <FormItem className={"col-span-1 md:col-span-2"}>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="Enter member's description" {...field} />
                    </FormControl>
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
                      <Input placeholder="Enter member's personal website" {...field} />
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
                    <FormLabel>X (Twitter)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter member's X (Twitter) profile" {...field} />
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
                      <Input placeholder="Enter member's Telegram handle" {...field} />
                    </FormControl>
                    <FormMessage>{errors.telegram?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter member's GitHub profile" {...field} />
                    </FormControl>
                    <FormMessage>{errors.github?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="ingress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingress</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter member's ingress information" {...field} />
                    </FormControl>
                    <FormMessage>{errors.ingress?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <DialogFooter className={"col-span-1 md:col-span-2"}>
                <Button onClick={() => handleSubmit(submit)}>Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  )
}

export default ActionDialog
