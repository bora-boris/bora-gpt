import { db } from "~/server/db";
import { MESSAGE_SOURCES, type Conversation } from "@prisma/client";
import { getResponseFromOpenAI } from "./openAIService";

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

const addMessageToConversation = async (input: {
  message: string;
  conversationId: number;
  messageSource: MESSAGE_SOURCES;
}) => {
  await db.conversation.update({
    where: { id: input.conversationId },
    data: {
      preview: input.message,
      messages: {
        create: {
          content: input.message,
          source: input.messageSource,
        },
      },
    },
  });
};

export const submitUserMessage = async (input: {
  message: string;
  conversationId: number;
}): Promise<Conversation> => {
  await addMessageToConversation({
    message: input.message,
    conversationId: input.conversationId,
    messageSource: MESSAGE_SOURCES.USER,
  });

  generateSystemResponse(input).catch((error) => {
    console.error("Problem generating system response:", error);
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

export const generateSystemResponse = async (input: {
  message: string;
  conversationId: number;
}): Promise<void> => {
  const response = await getResponseFromOpenAI(input.message);
  const content =
    response?.content ?? "Sorry, I am not able to respond to that.";

  await addMessageToConversation({
    message: content,
    conversationId: input.conversationId,
    messageSource: MESSAGE_SOURCES.SYSTEM,
  });
};
