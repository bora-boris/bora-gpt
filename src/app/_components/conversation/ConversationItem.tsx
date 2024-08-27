import Link from "next/link";
import React from "react";

import { Conversation } from "prisma/client";

export const ConversationItem = ({ content }) => {
  // get timestamp of most recent message
  return (
    <Link
      href="#"
      className="hover:bg-muted flex items-center gap-3 rounded-md p-4 transition-colors"
      prefetch={false}
    >
      <div className="flex-1 overflow-hidden">
        <div className="text-muted-foreground max- overflow-hidden text-ellipsis text-sm">
          {content}
        </div>
      </div>
      {/*       <div className="text-muted-foreground text-xs">2h</div>
       */}{" "}
    </Link>
  );
};
