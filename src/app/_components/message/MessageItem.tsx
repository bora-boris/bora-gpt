import React from "react";
import { getTimeSince } from "../../utils/time";
import Image from "next/image";

import { type Message, MESSAGE_SOURCES } from "@prisma/client";

export const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.source === MESSAGE_SOURCES.USER;

  const containerClass = `flex items-center pb-4 ${isUser ? "items-start justify-end" : "items-start"} gap-4`;
  const messageClass = `grid gap-1 rounded-md p-3 text-sm max-w-md ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"} flex`;
  const timestampClass = `text-xs flex-end ${isUser ? "text-primary-foreground/80" : "text-muted-foreground"}`;

  const imgUrl = message.image || null;

  return (
    <div className={containerClass}>
      <div className={messageClass}>
        <div>{message.content}</div>
        <div className={timestampClass}>{getTimeSince(message.createdAt)}</div>
      </div>
      {imgUrl && <img src={imgUrl} width={200} alt="Image for Message" />}
    </div>
  );
};
