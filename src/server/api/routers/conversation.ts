import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { createConversation } from "~/server/api/services/conversationService";

export const conversationRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.conversation.create({
        data: {
          sessionId: input.sessionId,
        },
      });
      // TODO use the conversation service to handle this
      //return createConversation(input);
    }),
});
