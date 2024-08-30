import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import {
  createConversation,
  getConversation,
  getConversations,
  submitUserMessage,
} from "~/server/api/services/conversation.service";

export const conversationRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return createConversation(input);
    }),
  getById: publicProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }) => {
      return getConversation(input.conversationId);
    }),
  getBySessionId: publicProcedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .query(async ({ input }) => {
      return getConversations(input.sessionId);
    }),
  addMessage: publicProcedure
    .input(
      z.object({
        sessionId: z.string().min(1),
        message: z.string().min(1),
        conversationId: z.number().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      let conversationId = input.conversationId;
      if (!input.conversationId) {
        const newConversation = await createConversation({
          sessionId: input.sessionId,
        });
        conversationId = newConversation?.id;
      }

      if (!conversationId) {
        throw new Error("Failed to find a valid conversation");
      }

      return submitUserMessage({
        conversationId: conversationId,
        message: input.message,
      });
    }),
});
