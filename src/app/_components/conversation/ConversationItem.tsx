import Link from "next/link";
import React from "react";
import { type Conversation } from "@prisma/client";
import { getTimeSince } from "../../utils/time";

export const ConversationItem: React.FC<{
  conversation: Conversation;
  setActiveConversation: (conversation: Conversation) => void;
}> = ({ conversation, setActiveConversation }) => {
  // get timestamp of most recent message
  return (
    <Link
      href="#"
      className="flex items-center gap-3 rounded-md p-4 transition-colors hover:bg-muted"
      prefetch={false}
      onClick={(event) => {
        event.preventDefault();
        setActiveConversation(conversation);
      }}
    >
      <div className="flex-1 overflow-hidden">
        <div className="max- overflow-hidden text-ellipsis text-sm text-muted-foreground">
          {conversation.preview}
        </div>
      </div>
      <div className="mt-1 self-start text-xs text-muted-foreground">
        {getTimeSince(conversation.updatedAt)}
      </div>
    </Link>
  );
};
