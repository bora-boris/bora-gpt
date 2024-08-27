import React from "react";
import { ConversationItem } from "./ConversationItem";

type Conversation = {
  id: string;
  content: string;
};

export const ConversationList: React.FC<{ conversations: Conversation[] }> = ({
  conversations,
}) => {
  // get timestamp of most recent message
  return (
    <div>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          content={conversation.content}
        />
      ))}
    </div>
  );
};
