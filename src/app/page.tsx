import Link from "next/link";

//import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";

/* import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
 */

export default async function Home() {
  //const hello = await api.post.hello({ text: "from tRPC" });

  //void api.post.getLatest.prefetch();

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
            {/* <Button variant="ghost" size="icon">
              <PlusIcon className="h-5 w-5" />
              <span className="sr-only">New Chat</span>
            </Button> */}
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="grid gap-4">
              <Link
                href="#"
                className="hover:bg-muted flex items-center gap-3 rounded-md p-2 transition-colors"
                prefetch={false}
              >
                {/* <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar> */}
                <div className="flex-1 overflow-hidden">
                  <div className="truncate font-medium">Acme Inc</div>
                  <div className="text-muted-foreground truncate text-sm">
                    Hey, how&apos;s it going?
                  </div>
                </div>
                <div className="text-muted-foreground text-xs">2h</div>
              </Link>
              <Link
                href="#"
                className="hover:bg-muted flex items-center gap-3 rounded-md p-2 transition-colors"
                prefetch={false}
              >
                {/* <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar> */}
                <div className="flex-1 overflow-hidden">
                  <div className="truncate font-medium">John Doe</div>
                  <div className="text-muted-foreground truncate text-sm">
                    Did you see the new design?
                  </div>
                </div>
                <div className="text-muted-foreground text-xs">1d</div>
              </Link>
              <Link
                href="#"
                className="hover:bg-muted flex items-center gap-3 rounded-md p-2 transition-colors"
                prefetch={false}
              >
                {/* <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar> */}
                <div className="flex-1 overflow-hidden">
                  <div className="truncate font-medium">Sarah Anderson</div>
                  <div className="text-muted-foreground truncate text-sm">
                    Let us discuss the project timeline.
                  </div>
                </div>
                <div className="text-muted-foreground text-xs">3d</div>
              </Link>
              <Link
                href="#"
                className="hover:bg-muted flex items-center gap-3 rounded-md p-2 transition-colors"
                prefetch={false}
              >
                {/* <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>MJ</AvatarFallback>
                </Avatar> */}
                <div className="flex-1 overflow-hidden">
                  <div className="truncate font-medium">Michael Johnson</div>
                  <div className="text-muted-foreground truncate text-sm">
                    I have a few questions about the API.
                  </div>
                </div>
                <div className="text-muted-foreground text-xs">1w</div>
              </Link>
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
              {/* <Textarea
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
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
