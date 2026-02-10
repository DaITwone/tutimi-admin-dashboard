import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { buildSystemPrompt } from "./prompt";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { prompt, systemContext } = await req.json();

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
              ${buildSystemPrompt(systemContext)}

              CÂU HỎI CỦA ADMIN: ${prompt}`,
            },
          ],
        },
      ],
    });

    return NextResponse.json({ content: response.text });

  } catch (err) {
    console.error("Gemini API Error:", err);

    return NextResponse.json(
      { content: "Lỗi khi kết nối với AssistantAI." },
      { status: 500 }
    );
  }
}
