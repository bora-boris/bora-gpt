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

////// TOOL DEFINITIONS //////

export const tools = [
  {
    type: "function",
    function: {
      name: "getWeather",
      description:
        "Get the weather for a location. Call this whenever you need to know the weather, for example when a user asks 'What's the weather like in San Francisco, or what should I wear tomorrow?'",
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
  {
    type: "function",
    function: {
      name: "getAverageNumber",
      description:
        "Get the average of a list of numbers. Call this whenever you need to calculate the average of a list of numbers, for example when a user asks 'What's the average of 1, 2, and 3?'",
      parameters: {
        type: "object",
        properties: {
          numbers: {
            type: "array",
            items: {
              type: "number",
            },
            description: "An array of numbers to average",
          },
        },
        required: ["numbers"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getFoodRecommendationsInNewYork",
      description:
        "Get food recommendations for New York. Call this whenever you need to recommend food in New York, for example when a user asks 'What's a good place to eat lunch in New York?'",
    },
  },
];

const getAverageNumber = async (input: { numbers: number[] }) => {
  const { numbers } = input;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return { average: sum / numbers.length };
};

const getFoodRecommendationsInNewYork = async () => {
  return {
    recommendations: [
      "Katz's Delicatessen",
      "John’s of Bleecker Street",
      "Mamoun's Falafel",
      "Gotham Burger Social Club",
    ],
  };
};

const toolsFunctionMap: { [key: string]: Function } = {
  getWeather,
  getAverageNumber,
  getFoodRecommendationsInNewYork,
};

////// TOOL PROCESSING //////

const getImageForWeather = async (message: string): Promise<string> => {
  const weatherPrompt = `
    Given the following message, if it relates to weather, return true. If not return false
    The message is ${message};
  `;

  const weatherPromptResult = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: openAIRoles.USER, content: weatherPrompt }],
    tools,
  });

  const weatherPromptResultContent =
    weatherPromptResult?.choices[0]?.message?.content;

  if (
    typeof weatherPromptResultContent !== "string" ||
    trim(weatherPromptResultContent).toLowerCase() !== "true"
  ) {
    return null;
  }

  const widgetGenerationPrompt = `Please generate a weather widge for the following weather: ${message}`;
  const completion = await openai.images.generate({
    model: "dall-e-3",
    prompt: widgetGenerationPrompt,
    n: 1,
    size: "1024x1024",
  });

  return completion?.data[0]?.url;
};

// Take the history of the conversation and feed it to the OpenAI API
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
): Promise<{ message: string; image: string }> => {
  const existingMessages = buildMessagesForCompletionsAPI(conversation);
  const messagesToAdd = [];
  let image = null;

  let completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: existingMessages,
    tools,
  });

  let message = completion?.choices[0]?.message;
  let toolCalls = message?.tool_calls ?? [];

  // If OpenAI has requested to us our toolbox, let them!
  // We'll process the tool calls and add the results to the conversation
  while (toolCalls.length) {
    messagesToAdd.push(completion?.choices[0]?.message);
    for (const toolCall of toolCalls) {
      const resultMessage = await processToolCall(toolCall);
      messagesToAdd.push(resultMessage);
    }

    completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [...existingMessages, ...messagesToAdd],
      tools,
    });

    message = completion?.choices[0]?.message;
    // Chaining tool calls until openAI is satisfied and doesn't need more function calling
    toolCalls = message?.tool_calls ?? [];
  }

  const response = message?.content;

  if (typeof response === "string" && response.length) {
    image = await getImageForWeather(response);
  }

  return { message: response, image };
};
