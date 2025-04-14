"use client"

import { formatDistanceToNow } from "date-fns"
import { MessageCircle, Plus } from "lucide-react"
import React, { useMemo, useState } from "react"
import LoadingSpinner from "~/app/_components/loading-spinner"
import { useDaoContext } from "~/app/dao/[id]/context"
import { CreateMessage, DeleteMessage } from "~/app/dao/[id]/message/message-action"
import { useAuth } from "~/components/auth/auth-context"
import ListPagination from "~/components/list-pagination"
import NoData from "~/components/no-data"
import { Button } from "~/components/ui/button"
import type { Pageable } from "~/lib/schema"
import { cn, compareStringToUpperCase } from "~/lib/utils"
import { shortenAddress } from "~/lib/web3"
import { api } from "~/trpc/react"

interface Condition {
  pageable: Pageable
}

const MessageList = () => {
  const { address } = useAuth()
  const { detail } = useDaoContext()
  const [condition, setCondition] = useState<Condition>({
    pageable: { page: 0, size: 10 }
  })
  const { data: messageData, isPending } = api.message.getMessages.useQuery({
    daoId: detail.id,
    replyLimit: 3,
    pageable: condition.pageable
  })
  const list = useMemo(() => {
    if (isPending) {
      return <LoadingSpinner size={64} className="my-8" />
    }
    if (!messageData || messageData?.list.length === 0) {
      return (
        <div className={cn("flex flex-col items-center justify-center", "mt-10")}>
          <MessageCircle size={65} className=" text-primary mb-2" />
          <div className={cn("text-gray-500", "text-xl", "space-y-8 text-center")}>
            <div>No messages posted yet.</div>
            <CreateMessage daoId={detail.id}>
              <Button variant={"outline"}>Post the first message</Button>
            </CreateMessage>
          </div>
        </div>
      )
    }
    return messageData.list.map((item) => (
      <div key={`message-${item.id}`} className={"mt-4 flex flex-col rounded-lg bg-[#22272B] p-3"}>
        <div className={"flex flex-row items-center justify-between"}>
          <div className={"text-sm"}>
            {shortenAddress(item.createdBy)}
            <span className={"ml-6 text-xs text-gray-400"}>{formatDistanceToNow(item.createdAt)}</span>
          </div>
          <div className={"text-primary-foreground flex cursor-pointer flex-row items-center gap-4 text-xs"}>
            {compareStringToUpperCase(address, item.createdBy) && <DeleteMessage messageId={item.id} />}
            <CreateMessage daoId={detail.id} replyMessage={item}>
              <div>Reply</div>
            </CreateMessage>
          </div>
        </div>
        <div className={"text-gray-400"}>
          {item.message}
          <div className="mb-1 text-xs text-gray-500">
            {item.replyCount} {item.replyCount === 1 ? "reply" : "replies"}
          </div>
          {item.replyCount > 0 && (
            <div className="mt-2 space-y-2 rounded-lg border-t pt-2">
              {item.replies.map((reply) => (
                <div key={reply.id} className="rounded bg-black p-3">
                  <div className="text-primary-foreground flex items-center justify-between text-xs font-bold">
                    <div>
                      {shortenAddress(reply.createdBy)}
                      {reply.replyToUser && reply.replyToMessage !== item.id && <span className="mx-1 text-gray-500">replied to {shortenAddress(reply.replyToUser)}</span>}
                      <span className="ml-2 text-gray-500">{formatDistanceToNow(reply.createdAt)}</span>
                    </div>
                    <div className={"text-primary-foreground flex cursor-pointer flex-row items-center gap-4 text-xs"}>
                      {compareStringToUpperCase(address, reply.createdBy) && <DeleteMessage messageId={reply.id} />}
                      <CreateMessage daoId={detail.id} replyMessage={reply}>
                        <div>Reply</div>
                      </CreateMessage>
                    </div>
                  </div>
                  <div className="text-primary-foreground mt-1 text-sm font-thin">{reply.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ))
  }, [messageData, isPending])
  return (
    <>
      <div className={"flex w-full flex-col gap-4 px-4 md:px-10 py-4 md:py-5 h-full message-board"}>
        <div className={"flex flex-row items-center justify-between text-xl font-bold"}>
          <div>Message Board</div>
          <CreateMessage daoId={detail.id}>
            <Button variant={"ghost"} className={"text-xs text-primary"}>
              <span className={"hidden md:block"}>Post a Message</span>
              <Plus className={"text-xs md:hidden"} />
            </Button>
          </CreateMessage>
        </div>
        <div className={"flex-1"}>{list}</div>
        <ListPagination pageable={condition.pageable} totalPages={messageData?.pages ?? 0} setPageable={(pageable) => setCondition({ pageable })} />
      </div>
    </>
  )
}

export default MessageList
