import { db } from "~/server/db";
import type { Conversation } from "@prisma/client";

export const createConversation = async (input: {
  sessionId: string;
}): Promise<Conversation> => {
  const conversation = await db.conversation.create({ data: input });
  return conversation;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const conversations = await db.conversation.findMany();
  return conversations;
};
