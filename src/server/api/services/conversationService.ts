import { db } from "~/server/db";
import { MESSAGE_SOURCES, type Conversation } from "@prisma/client";

export const createConversation = async (input: {
  sessionId: string;
}): Promise<Conversation> => {
  const conversation = await db.conversation.create({ data: input });
  return conversation;
};

export const getConversations = async (
  sessionId: string,
): Promise<Conversation[]> => {
  const conversations = await db.conversation.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
    include: { messages: true },
  });
  return conversations;
};

export const addMessageToConversation = async (input: {
  message: string;
  conversationId: number;
}): Promise<Conversation> => {
  await db.conversation.update({
    where: { id: input.conversationId },
    data: {
      preview: input.message,
      messages: {
        create: {
          content: input.message,
          source: MESSAGE_SOURCES.USER,
        },
      },
    },
  });

  const updatedConversation = await db.conversation.findFirst({
    where: { id: input.conversationId },
    include: { messages: true },
  });
  if (!updatedConversation) {
    throw new Error("Failed to find updated conversation");
  }

  return updatedConversation;
};
