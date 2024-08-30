"use client";

import React, { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

import { ConversationList } from "./conversation/ConversationList";
import { MessageList } from "./message/MessageList";

import { PlusIcon } from "./icons/PlusIcon";
import { SendIcon } from "./icons/SendIcon";

import { api } from "~/trpc/react";
import { useCookies } from "react-cookie";
import { MESSAGE_SOURCES, Conversation } from "@prisma/client";

const POLLING_INTERVAL = 3000;

export const Home = () => {
  const [cookies] = useCookies(["session-id"]);
  const sessionId = cookies["session-id"];

  const [activeConversation, setActiveConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [intervalTrigger, setIntervalTrigger] = useState(1);
  const [isAwaitingAIResponse, setIsAwaitingAIResponse] = useState(false);

  //// API Calls
  let { data: conversations = [], refetch: refetchConversations } =
    api.conversation.getBySessionId.useQuery({
      sessionId,
    });

  const { data: conversation, refetch: refetchConversation } =
    api.conversation.getById.useQuery(
      {
        conversationId: activeConversation?.id,
      },
      { enabled: !!activeConversation?.id },
    );

  const createConversationMutation = api.conversation.create.useMutation();

  // Poll for new messages (ideally use websockets)
  useEffect(() => {
    setTimeout(() => {
      setIntervalTrigger(intervalTrigger + 1);
    }, POLLING_INTERVAL);

    if (!activeConversation?.id) {
      return;
    }

    refetchConversation();
  }, [intervalTrigger]);

  const getSourceOfLastMessage = (conversation: Conversation): string => {
    const messages = conversation?.messages || [];
    const lastMessage = messages[messages.length - 1];

    return lastMessage?.source;
  };

  // Update the active conversation when a new message is received
  useEffect(() => {
    setActiveConversation(conversation);

    // Update the loading indicator awaiting AI response
    if (getSourceOfLastMessage(conversation) === MESSAGE_SOURCES.USER) {
      setIsAwaitingAIResponse(true);
    } else {
      setIsAwaitingAIResponse(false);
    }
  }, [conversation?.updatedAt]);

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMessageText(event.target.value);
  };

  const handleCreateNewConversation = () => {
    createConversationMutation.mutate(
      {
        sessionId,
      },
      {
        onSuccess: (data) => {
          setActiveConversation(data);
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
        sessionId,
        conversationId: activeConversation?.id || null,
        message: messageText,
      },
      {
        onSuccess: (data) => {
          setActiveConversation(data);
          setMessageText("");
          refetchConversations();
        },
        onError: (error) => {
          console.error("Failed to add message to conversation:", error);
        },
      },
    );
  };

  const handleTextAreaKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents the default newline behavior
      await handleMessageSubmit();
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
            <ConversationList
              conversations={conversations}
              setActiveConversation={setActiveConversation}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-muted/40 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-bold">Bora GPT</div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-4">
            <MessageList
              messages={activeConversation?.messages}
              isLoading={isAwaitingAIResponse}
            />
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
              className="absolute right-4 top-4"
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
