import React from "react";
import { MessageItem } from "./MessageItem";
import { LoadingIndicator } from "../icons/LoadingIndicator";

type Message = {
  id: string;
  content: string;
  source: number;
};

export const MessageList: React.FC<{
  messages: Message[];
  isLoading: boolean;
}> = ({ messages, isLoading }) => {
  // get timestamp of most recent message
  return messages?.length ? (
    <div>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isLoading && <LoadingIndicator />}
    </div>
  ) : (
    <></>
  );
};
