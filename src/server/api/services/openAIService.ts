import OpenAI from "openai";
const openai = new OpenAI();

export const getResponseFromOpenAI = async (message: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return completion?.choices[0]?.message;
};
