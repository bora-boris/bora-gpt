import React from "react";
import { ConversationItem } from "./ConversationItem";
import { type Conversation } from "@prisma/client";

export const ConversationList: React.FC<{
  conversations: Conversation[];
  setActiveConversation: (conversation: Conversation) => void;
}> = ({ conversations, setActiveConversation }) => {
  // get timestamp of most recent message
  return (
    <div>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          setActiveConversation={setActiveConversation}
        />
      ))}
    </div>
  );
};
