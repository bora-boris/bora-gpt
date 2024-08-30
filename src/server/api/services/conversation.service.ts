import { db } from "~/server/db";
import {
  type Prisma,
  MESSAGE_SOURCES,
  type Conversation,
} from "@prisma/client";
import { getResponseFromOpenAI } from "./openAI.service";
import { formatConversationPreview } from "../utils/formatting";

// Had to do this since Prisma doesn't export a Model's relations in the type definitions by default
// https://github.com/prisma/prisma/discussions/10928
type ConversationWithMessages = Prisma.ConversationGetPayload<{
  include: { messages: true };
}>;

export const createConversation = async (input: {
  sessionId: string;
}): Promise<Conversation> => {
  const conversation = await db.conversation.create({ data: input });
  return conversation;
};

export const getConversation = async (
  conversationId: number,
): Promise<Conversation> => {
  const conversation = await db.conversation.findFirst({
    where: { id: conversationId },
    include: { messages: true },
  });

  if (!conversation) {
    throw new Error(`Failed to find conversation for id ${conversationId} `);
  }

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
  tone?: string;
}) => {
  const updatedPreview =
    input.messageSource === MESSAGE_SOURCES.USER
      ? {
          preview: formatConversationPreview(input.message),
        }
      : {};
  const conversationPreview = formatConversationPreview(input.message);

  await db.conversation.update({
    where: { id: input.conversationId },
    data: {
      ...updatedPreview,
      messages: {
        create: {
          content: input.message,
          source: input.messageSource,
          tone: input.tone,
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

  const updatedConversation = await db.conversation.findFirst({
    where: { id: input.conversationId },
    include: { messages: true },
  });

  if (!updatedConversation) {
    throw new Error("Failed to find updated conversation");
  }

  generateSystemResponse(updatedConversation).catch((error) => {
    console.error("Problem generating system response:", error);
  });

  return updatedConversation;
};

export const generateSystemResponse = async (
  conversation: ConversationWithMessages,
): Promise<void> => {
  const { message, tone } = await getResponseFromOpenAI(conversation);
  const content = message ?? "Sorry, I am not able to respond to that.";

  await addMessageToConversation({
    message: String(content),
    conversationId: conversation.id,
    messageSource: MESSAGE_SOURCES.SYSTEM,
    tone,
  });
};
