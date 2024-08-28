import { PlusIcon } from "./_components/icons/PlusIcon";
import { SendIcon } from "./_components/icons/SendIcon";

//import { LatestPost } from "~/app/_components/post";
import { HydrateClient } from "~/trpc/server";
import { api } from "~/trpc/react";

import { Button } from "./_components/ui/button";
import { Textarea } from "./_components/ui/textarea";

import { ConversationList } from "./_components/conversation/ConversationList";
import { MessageList } from "./_components/message/MessageList";

export default async function Home() {
  //void api.post.getLatest.prefetch();

  const conversations = [
    {
      id: "1",
      content: "Did you see the new design?",
    },
    {
      id: "2",
      content: "Let us discuss the project timeline.",
    },
    {
      id: "3",
      content: "I have a few questions about the API.",
    },
  ];

  const messages = [
    {
      id: "1",
      content: "Hey, how's it going?",
      timestamp: "2h",
      source: "USER",
    },
    {
      id: "2",
      content: "Pretty good, thanks for asking!",
      timestamp: "2h",
      source: "SYSTEM",
    },
    {
      id: "3",
      content: "Did you see the new design?",
      timestamp: "1d",
      source: "USER",
    },
    {
      id: "4",
      content: "Yes, I did! It looks great.",
      timestamp: "1d",
      source: "SYSTEM",
    },
  ];

  const createConversationMutation = api.conversation.create.useMutation();

  const handleCreateNewConversation = () => {
    createConversationMutation.mutate(
      {
        sessionId: "1234",
      },
      {
        onSuccess: (data) => {
          console.log("Conversation created:", data);
        },
        onError: (error) => {
          console.error("Failed to create conversation:", error);
        },
      },
    );
  };

  return (
    <HydrateClient>
      <div className="bg-background text-foreground flex min-h-screen w-full">
        <div className="bg-muted/40 hidden w-64 border-r md:block">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <span>Conversations</span>
            <Button variant="ghost" size="icon">
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
          <header className="bg-muted/40 flex h-16 items-center border-b px-4 md:px-6">
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
              <MessageList messages={messages} />
            </div>
          </div>
          <div className="bg-muted/40 border-t p-4">
            <div className="relative">
              <Textarea
                placeholder="Type your message..."
                className="min-h-[48px] w-full rounded-2xl border border-neutral-400 p-4 pr-16 shadow-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-3 top-3"
              >
                <SendIcon className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
