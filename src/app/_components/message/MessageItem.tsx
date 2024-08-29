import React from "react";
import { getTimeSince } from "../../utils/time";

import { type Message, MESSAGE_SOURCES } from "@prisma/client";

export const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.source === MESSAGE_SOURCES.USER;

  const containerClass = `flex pb-4 ${isUser ? "items-start justify-end" : "items-start"} gap-4`;
  const messageClass = `grid gap-1 rounded-md p-3 text-sm ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"} flex`;
  const timestampClass = `text-xs flex-end ${isUser ? "text-primary-foreground/80" : "text-muted-foreground"}`;

  // get timestamp of most recent message
  return (
    <div className={containerClass}>
      {/* <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar> */}
      <div className={messageClass}>
        <div>{message.content}</div>
        <div className={timestampClass}>{getTimeSince(message.createdAt)}</div>
      </div>
    </div>
  );
};
