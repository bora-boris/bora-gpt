import OpenAI from "openai";
const openai = new OpenAI();
import { type Prisma, MESSAGE_SOURCES } from "@prisma/client";

type ConversationWithMessages = Prisma.ConversationGetPayload<{
  include: { messages: true };
}>;

const SYSTEM_OPENING_MESSAGE = "You are a helpful assistant.";

const openAIRoles = {
  USER: "user",
  SYSTEM: "system",
  ASSISTANT: "assistant",
};

export const sampleFunction = (name: string) => {
  console.log("SAMPLE FUNCTION CALLED");

  return `${name} is a great name!`;
};

const tools = [
  {
    name: "sampleFunction",
    description:
      "Get the delivery date for a customer's order. Call this whenever you need to know the delivery date, for example when a customer asks 'Where is my package'",
    parameters: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description: "The customer's order ID.",
        },
      },
      required: ["order_id"],
      additionalProperties: false,
    },
  },
];

const buildMessages = (conversation: ConversationWithMessages) => {
  const messages = [
    { role: openAIRoles.SYSTEM, content: SYSTEM_OPENING_MESSAGE },
  ];

  if (conversation.messages?.length) {
    for (const message of conversation.messages) {
      messages.push({
        role:
          message.source === MESSAGE_SOURCES.USER
            ? openAIRoles.USER
            : openAIRoles.ASSISTANT,
        content: message.content,
      });
    }
  }

  return messages;
};

export const getResponseFromOpenAI = async (
  conversation: ConversationWithMessages,
) => {
  const messages = buildMessages(conversation);

  console.log("messages: ", messages);

  return "NEW AI MESSAGE";
  /*
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    tools: tools,
  });

  console.log("completion: ", completion);

  return completion?.choices[0]?.message; */
};
