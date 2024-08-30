import React from "react";
import { ConversationItem } from "./ConversationItem";
import { type Conversation } from "@prisma/client";

export const ConversationList: React.FC<{
  conversations: Conversation[];
  setActiveConversation: (conversation: Conversation) => void;
}> = ({ conversations, setActiveConversation }) => {
  const orderedConversations = conversations
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .filter((conversation) => conversation.preview?.length);
  // get timestamp of most recent message
  return (
    <div>
      {orderedConversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          setActiveConversation={setActiveConversation}
        />
      ))}
    </div>
  );
};
