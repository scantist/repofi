"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "~/components/ui/drawer"
import { Button } from "~/components/ui/button"
import useMediaQuery from "~/hooks/use-media-query"
import { api } from "~/trpc/react"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import React, { useState } from "react"
import { toast } from "sonner"
import { shortenAddress } from "~/lib/web3"
import { formatDistanceToNow } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "~/components/ui/popover"
import { Trash2, Loader2 } from "lucide-react"
import { PopoverClose } from "@radix-ui/react-popover"

export const CreateMessage = ({
  children,
  daoId,
  replyMessage
}: {
  children: React.ReactNode;
  daoId: string;
  replyMessage?: {
    createdAt: Date,
    createdBy: string,
    message: string,
    id: string
  };
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [open, setOpen] = useState(false)
  const useUtils = api.useUtils()
  const { mutate, isPending } = api.message.createMessage.useMutation({
    onSuccess: async () => {
      await useUtils.message.getMessages.refetch()
      setOpen(false)
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed to create message! ${error.message}`)
    }
  })
  const [message, setMessage] = useState("")
  const handleSummit = () => {
    if (message.trim().length === 0) {
      toast.warning("Message cannot be empty")
      return
    }
    mutate({
      daoId,
      message,
      replyTo: replyMessage?.id
    })
  }

  return (
    <Drawer
      direction={isDesktop ? "right" : "bottom"}
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        className={
          isDesktop
            ? "inset-x-auto top-2 right-2 bottom-2 mt-auto w-[400px] rounded-[10px] after:hidden"
            : ""
        }
      >
        <DrawerHeader>
          <DrawerTitle>Post a Message</DrawerTitle>
          <DrawerDescription className="sr-only">
            Post a message to the message board.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grow space-y-4 p-6">
          {replyMessage && (
            <div className={"text-xs font-bold"}>In Reply to</div>
          )}
          {replyMessage && (
            <div className="bg-muted flex flex-col justify-between gap-2 rounded-lg p-4">
              <div className={"text-xs"}>
                {shortenAddress(replyMessage.createdBy)}
                <span className={"ml-6 text-xs text-gray-400"}>
                  {formatDistanceToNow(replyMessage.createdAt)}
                </span>
              </div>
              <div className={"text-sm text-gray-400"}>
                {replyMessage.message}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              className={"mt-2"}
              id="message"
              name="message"
              rows={12}
              autoFocus
              onChange={(e) => {
                setMessage(e.target.value)
              }}
            />
          </div>
        </div>
        <DrawerFooter>
          <Button disabled={isPending} onClick={handleSummit}>
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                <span className={"ml-2"}>Posting...</span>
              </>
            ) : (
              "Post"
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant={"outline"} disabled={isPending}>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const DeleteMessage = ({ messageId }: {
  messageId: string
}) => {
  const useUtils = api.useUtils()
  const { mutate, isPending } = api.message.deleteMessage.useMutation({
    onSuccess: async () => {
      await useUtils.message.getMessages.refetch()
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed to delete message! ${error.message}`)
    }
  })
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Trash2 className="size-3" />
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Delete Message</h4>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <PopoverClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </PopoverClose>
            <Button
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={() => mutate({ messageId })}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
