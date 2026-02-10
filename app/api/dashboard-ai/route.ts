import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { buildSystemPrompt } from "./prompt";
import { buildProductsSectionForAI } from "@/app/features/dashboard/services/buildProductsSectionForAI";


const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { prompt, history = [], dashboardContext } = await req.json();

    const productsContext = await buildProductsSectionForAI();

    const systemContext = {
      dashboard: dashboardContext,
      products: productsContext,
    }

    // 1️⃣ System message (đặt ở đầu)
    const systemMessage = {
      role: "user" as const,
      parts: [
        {
          text: buildSystemPrompt(systemContext),
        },
      ],
    };

    // 2️⃣ Ghép history + câu hỏi mới
    const contents = [
      systemMessage,
      ...history,
      {
        role: "user" as const,
        parts: [{ text: prompt }],
      },
    ];

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
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

// gemini-2.5-flash