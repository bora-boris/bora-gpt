import OpenAI from "openai";
const openai = new OpenAI();
import { type Prisma, MESSAGE_SOURCES } from "@prisma/client";
import { getWeather } from "./weather.service";
import trim from "lodash/trim";

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
      name: "getWeather",
      description:
        "Get the weather for a location. Call this whenever you need to know the weather, for example when a customer asks 'What's the weather like in San Francisco, or what should I wear tomorrow?'",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "The city the user is asking for the weather.",
          },
        },
        required: ["city"],
        additionalProperties: false,
      },
    },
  },
];

const getToneForMessage = async (message: string): Promise<string> => {
  console.log("getting tone for this message: ", message);
  const tonePrompt = `
  Given the following message, if it relates to weather, please categorize the response as Sunny, Cloudy, Rainy, or Not Applicable.
  The message is ${message};

  Please respond with any of the following options: "sunny", "cloudy", "rainy", or "none".
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: openAIRoles.USER, content: tonePrompt }],
    tools,
  });
  let tone = completion?.choices[0]?.message?.content;
  console.log("tone: ", tone);
  console.log("typeof tone: ", typeof tone);
  if (typeof tone !== "string") {
    return "none";
  }

  return trim(tone);
};

const toolsFunctionMap: { [key: string]: Function } = {
  getWeather,
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
): Promise<{ message: string; tone: string }> => {
  const existingMessages = buildMessagesForCompletionsAPI(conversation);
  const messagesToAdd = [];
  let tone = "none";

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

  const response = message?.content;

  if (typeof response === "string" && response.length) {
    tone = await getToneForMessage(response);
  }

  return { message: response, tone };
};
