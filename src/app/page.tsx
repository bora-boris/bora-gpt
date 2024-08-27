import Link from "next/link";

//import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";

import { Button } from "./_components/ui/button";
import { Textarea } from "./_components/ui/textarea";

import { ConversationItem } from "./_components/conversation/ConversationItem";

export default async function Home() {
  //const hello = await api.post.hello({ text: "from tRPC" });

  //void api.post.getLatest.prefetch();

  const conversations = [
    {
      id: 1,
      content: "Did you see the new design?",
    },
    {
      id: 2,
      content: "Let us discuss the project timeline.",
    },
    {
      id: 3,
      content: "I have a few questions about the API.",
    },
  ];

  return (
    <HydrateClient>
      <div className="bg-background text-foreground flex min-h-screen w-full">
        <div className="bg-muted/40 hidden w-64 border-r md:block">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link
              href="#"
              className="flex items-center gap-2 font-semibold"
              prefetch={false}
            >
              <span>Chat App</span>
            </Link>
            <Button variant="ghost" size="icon">
              <PlusIcon className="h-5 w-5" />
              <span className="sr-only">New Chat</span>
            </Button>
          </div>
          <div className="flex-1 p-4">
            <div className="grid gap-4">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  content={conversation.content}
                />
              ))}
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
                <div className="font-medium">Acme Inc</div>
                <div className="text-muted-foreground text-sm">Online</div>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {/* <Button variant="ghost" size="icon">
                <SearchIcon className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              <Button variant="ghost" size="icon">
                <PaperclipIcon className="h-5 w-5" />
                <span className="sr-only">Attach</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MoveHorizontalIcon className="h-5 w-5" />
                <span className="sr-only">More</span>
              </Button> */}
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-4">
                {/* <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar> */}
                <div className="bg-muted grid gap-1 rounded-md p-3 text-sm">
                  <div className="font-medium">Acme Inc</div>
                  <div>Hey, how&apos;s it going?</div>
                  <div className="text-muted-foreground text-xs">2h</div>
                </div>
              </div>
              <div className="flex items-start justify-end gap-4">
                <div className="bg-primary text-primary-foreground grid gap-1 rounded-md p-3 text-sm">
                  <div>Pretty good, thanks for asking!</div>
                  <div className="text-primary-foreground/80 text-xs">2h</div>
                </div>
                {/* <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>YO</AvatarFallback>
                </Avatar> */}
              </div>
              <div className="flex items-start gap-4">
                {/* <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar> */}
                <div className="bg-muted grid gap-1 rounded-md p-3 text-sm">
                  <div className="font-medium">Acme Inc</div>
                  <div>Did you see the new design?</div>
                  <div className="text-muted-foreground text-xs">1d</div>
                </div>
              </div>
              <div className="flex items-start justify-end gap-4">
                <div className="bg-primary text-primary-foreground grid gap-1 rounded-md p-3 text-sm">
                  <div>Yes, I did! It looks great.</div>
                  <div className="text-primary-foreground/80 text-xs">1d</div>
                </div>
                {/* <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>YO</AvatarFallback>
                </Avatar> */}
              </div>
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

function MoveHorizontalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

function PaperclipIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function WebcamIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="10" r="8" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 22h10" />
      <path d="M12 22v-4" />
    </svg>
  );
}
