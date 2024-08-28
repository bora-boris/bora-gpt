import { HydrateClient } from "~/trpc/server";
import { Home } from "./_components/Home";

export default async function Page() {
  return (
    <HydrateClient>
      <Home />
    </HydrateClient>
  );
}
