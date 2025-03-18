"use client"

import { Button } from "~/components/ui/button"
import { type DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/react"
import { CreateMessage, DeleteMessage } from "~/app/dao/[id]/message/message-action"
import LoadingSpinner from "~/app/_components/loading-spinner"
import React, { useMemo } from "react"
import { shortenAddress } from "~/lib/web3"
import { formatDistanceToNow } from "date-fns"
import { Trash } from "lucide-react"
import { useAuth } from "~/components/auth/auth-context"

interface MessageListProps {
  data: DaoDetailResult;
}

const MessageList = ({ data }: MessageListProps) => {
  const { address } = useAuth()
  const { data: messageData, isPending } = api.message.getMessages.useQuery({
    daoId: data.id,
    replyLimit: 3,
    pageable: {
      page: 0,
      size: 10
    }
  })
  const list = useMemo(() => {
    if (isPending) {
      return (
        <LoadingSpinner
          size={64}
          className="my-8"
          text="Loading repository..."
        />
      )
    }
    if (!messageData || messageData?.list.length === 0) {
      return <div>No Data</div>
    }
    return messageData.list.map((item) => (
      <div
        key={`message-${item.id}`}
        className={"mt-4 flex flex-col rounded-lg bg-[#22272B] p-3"}
      >
        <div className={"flex flex-row items-center justify-between"}>
          <div className={"text-sm"}>
            {shortenAddress(item.createdBy)}
            <span className={"ml-6 text-xs text-gray-400"}>
              {formatDistanceToNow(item.createdAt)}
            </span>
          </div>
          <div
            className={
              "text-primary-foreground flex cursor-pointer flex-row items-center gap-4 text-xs"
            }
          >
            {address === item.createdBy && <DeleteMessage messageId={item.id} />}
            <CreateMessage daoId={data.id}>
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
                      {reply.replyToUser &&
                        reply.replyToMessage !== item.id && (
                          <span className="mx-1 text-gray-500">
                            replied to {shortenAddress(reply.replyToUser)}
                          </span>
                        )}
                      <span className="ml-2 text-gray-500">
                        {formatDistanceToNow(reply.createdAt)}
                      </span>
                    </div>
                    <div
                      className={
                        "text-primary-foreground flex cursor-pointer flex-row items-center gap-4 text-xs"
                      }
                    >
                      {address === reply.createdBy && <DeleteMessage messageId={reply.id} />}
                      <CreateMessage daoId={data.id} replyMessage={reply}>
                        <div>Reply</div>
                      </CreateMessage>
                    </div>
                  </div>
                  <div className="text-primary-foreground mt-1 text-sm font-thin">
                    {reply.message}
                  </div>
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
      <div className={"flex w-full flex-col gap-4 px-10 py-5"}>
        <div
          className={
            "flex flex-row items-center justify-between text-2xl font-bold"
          }
        >
          <div>Message Board</div>
          <CreateMessage daoId={data.id}>
            <Button variant={"outline"} className={"text-xs"}>
              Post a Message
            </Button>
          </CreateMessage>
        </div>
        {list}
      </div>
    </>
  )
}

export default MessageList
