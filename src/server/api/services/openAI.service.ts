import OpenAI from "openai";
const openai = new OpenAI();
import { type Prisma, MESSAGE_SOURCES } from "@prisma/client";

type ConversationWithMessages = Prisma.ConversationGetPayload<{
  include: { messages: true };
}>;

interface ChatMessage {
  role: string;
  content: string;
}

interface ToolCall {
  id: string;
  function: {
    arguments: string;
    name: string;
  };
  type: string;
}

const SYSTEM_OPENING_MESSAGE = "You are a helpful assistant.";

const openAIRoles = {
  USER: "user",
  SYSTEM: "system",
  ASSISTANT: "assistant",
  TOOL: "tool",
};

export const tools = [
  {
    type: "function",
    function: {
      name: "getDeliveryDate",
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
  },
];

export const getDeliveryDate = (input: { order_id: string }) => {
  console.log("SAMPLE FUNCTION CALLED with args: ", input?.order_id);

  return { delivery_date: "1988-08-03" };
};

const toolsFunctionMap: { [key: string]: Function } = {
  getDeliveryDate,
};

const buildMessagesForCompletionsAPI = (
  conversation: ConversationWithMessages,
): ChatMessage[] => {
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

const buildFunctionCallResultMessage = (
  results: object,
  toolCallId: string,
) => {
  return {
    role: openAIRoles.TOOL,
    content: JSON.stringify(results),
    tool_call_id: toolCallId,
  };
};

const processToolCall = async (toolCall: ToolCall) => {
  const {
    id,
    function: { arguments: args, name: functionName },
  } = toolCall;

  console.log(`Processing tool call: ${functionName} with args: ${args}`);
  const parsedArgs = JSON.parse(args);
  if (toolsFunctionMap[functionName]) {
    const results = await toolsFunctionMap[functionName](parsedArgs);
    return buildFunctionCallResultMessage(results, id);
  } else {
    throw new Error(`Function ${functionName} not found in our toolbox.`);
  }
};

export const getResponseFromOpenAI = async (
  conversation: ConversationWithMessages,
) => {
  const existingMessages = buildMessagesForCompletionsAPI(conversation);
  const messagesToAdd = [];

  console.log("Message chain: ", existingMessages);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: existingMessages,
    tools,
  });

  let message = completion?.choices[0]?.message;
  const toolCalls = message?.tool_calls ?? [];
  if (toolCalls.length) {
    messagesToAdd.push(completion?.choices[0]?.message);
    for (const toolCall of toolCalls) {
      const resultMessage = await processToolCall(toolCall);
      messagesToAdd.push(resultMessage);
    }
    console.log("messagesToAdd: ", messagesToAdd);

    const rerunCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [...existingMessages, ...messagesToAdd],
      tools,
    });
    message = rerunCompletion?.choices[0]?.message;
    console.log("rerunCompletion: ", rerunCompletion?.choices[0]);
  }

  console.log("message content: ", JSON.stringify(message));

  return message?.content;
};
