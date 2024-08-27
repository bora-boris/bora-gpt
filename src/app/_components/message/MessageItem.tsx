import Link from "next/link";
import React from "react";

// TODO consolidate types
type Message = {
  id: string;
  content: string;
  source: string;
  //timestamp: number;
};

export const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  // TODO make this better
  const isUser = message.source === "USER";

  const containerClass = `flex ${isUser ? "items-start justify-end" : "items-start"} gap-4`;
  const messageClass = `grid gap-1 rounded-md p-3 text-sm ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`;
  const timestampClass = `text-xs ${isUser ? "text-primary-foreground/80" : "text-muted-foreground"}`;

  // get timestamp of most recent message
  return (
    <div className={containerClass}>
      {/* <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar> */}
      <div className={messageClass}>
        <div>{message.content}</div>
        <div className={timestampClass}>2h</div>
      </div>
    </div>
  );
};
