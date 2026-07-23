import OpenAI from "openai";

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "sk-mock-openai-key" || apiKey.trim() === "") {
    throw new Error(
      "VOWMARK OpenAI Error: OPENAI_API_KEY is not configured in environment variables."
    );
  }

  return new OpenAI({
    apiKey,
  });
}

export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    const client = getOpenAIClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
