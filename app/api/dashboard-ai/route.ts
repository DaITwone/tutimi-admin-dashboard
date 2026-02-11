import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { buildSystemPrompt } from "./prompt";
import { buildProductsSectionForAI } from "@/app/features/dashboard/services/buildProductsSectionForAI";
import { buildInventorySectionForAI } from "@/app/features/dashboard/services/buildInventorySectionForAI";


const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { prompt, history = [], dashboardContext } = await req.json();

    const productsContext = await buildProductsSectionForAI();

    // normalize range nếu bạn cần query theo range
    const range = dashboardContext?.currentRange ?? dashboardContext?.range;

    const inventoryContext = await buildInventorySectionForAI({
      lowStockLimit: 5,
      highStockLimit: 5,
      recentTransactionLimit: 20,
    });

    const systemContext = {
      dashboard: { kpi: dashboardContext?.kpi, range },
      products: productsContext,
      inventory: inventoryContext,
    }

    // System message (đặt ở đầu)
    const systemMessage = {
      role: "user" as const,
      parts: [
        {
          text: buildSystemPrompt(systemContext),
        },
      ],
    };

    // Ghép history + câu hỏi mới
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