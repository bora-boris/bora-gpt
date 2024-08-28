"use client";

import React, { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

import { ConversationList } from "./conversation/ConversationList";
import { MessageList } from "./message/MessageList";

import { PlusIcon } from "./icons/PlusIcon";
import { SendIcon } from "./icons/SendIcon";

import { api } from "~/trpc/react";
import { set } from "zod";

export const Home = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  console.log("activeConversation", activeConversation);
  const [messageText, setMessageText] = useState("");
  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMessageText(event.target.value);
  };

  const {
    data: conversations = [],
    isLoading,
    isError,
  } = api.conversation.getBySessionId.useQuery({ sessionId: "1234" });

  const createConversationMutation = api.conversation.create.useMutation();

  const handleCreateNewConversation = () => {
    createConversationMutation.mutate(
      {
        sessionId: "1234",
      },
      {
        onSuccess: (data) => {
          setActiveConversation(data);
          console.log("Conversation created:", data);
          return data;
        },
        onError: (error) => {
          console.error("Failed to create conversation:", error);
        },
      },
    );
  };

  const addMessageMutation = api.conversation.addMessage.useMutation();

  const handleMessageSubmit = async () => {
    if (!messageText.length) {
      return;
    }

    addMessageMutation.mutate(
      {
        sessionId: "1234",
        conversationId: activeConversation?.id || null,
        message: messageText,
      },
      {
        onSuccess: (data) => {
          setActiveConversation(data);
          console.log("Conversation updated:", data);
          setMessageText("");
        },
        onError: (error) => {
          console.error("Failed to add message to conversation:", error);
        },
      },
    );
  };

  const handleTextAreaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents the default newline behavior
      handleMessageSubmit();
    }
  };
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <div className="hidden w-64 border-r bg-muted/40 md:block">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <span>Conversations</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCreateNewConversation}
          >
            <PlusIcon className="h-5 w-5" />
            <span className="sr-only">New Chat</span>
          </Button>
        </div>
        <div className="flex-1 p-4">
          <div className="grid gap-4">
            <ConversationList conversations={conversations} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-muted/40 px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* <Avatar className="h-10 w-10 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar> */}
            <div>
              <div className="font-bold">Bora GPT</div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-4">
            <MessageList messages={activeConversation?.messages} />
          </div>
        </div>
        <div className="border-t bg-muted/40 p-4">
          <div className="relative">
            <Textarea
              value={messageText}
              onChange={handleMessageChange}
              onKeyDown={handleTextAreaKeyDown}
              placeholder="Type your message..."
              className="min-h-[48px] w-full rounded-2xl border border-neutral-400 p-4 pr-16 shadow-sm"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!messageText.length}
              className="absolute right-3 top-3"
              onClick={handleMessageSubmit}
            >
              <SendIcon className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
