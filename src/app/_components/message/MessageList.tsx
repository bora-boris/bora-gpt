import React from "react";
import { MessageItem } from "./MessageItem";

type Message = {
  id: string;
  content: string;
  source: number;
};

export const MessageList: React.FC<{ messages: Message[] }> = ({
  messages,
}) => {
  // get timestamp of most recent message
  return (
    <div>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};
