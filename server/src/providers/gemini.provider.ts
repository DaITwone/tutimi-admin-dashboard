import { GoogleGenAI } from "@google/genai";
import { AppError } from "../types/api";

type GenerateContentParams = {
  contents: Array<{
    role: "user" | "model";
    parts: Array<{ text: string }>;
  }>;
};

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

export async function generateGeminiContent(params: GenerateContentParams) {
  if (!process.env.GEMINI_API_KEY) {
    throw new AppError(500, "MISSING_CONFIG", "GEMINI_API_KEY is missing");
  }

  const response = await Promise.race([
    client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: params.contents,
    }),
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new AppError(504, "AI_TIMEOUT", "Gemini request timeout"));
      }, 60000);
    }),
  ]);

  return response.text ?? "";
}
