import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt, systemContext } = await req.json();

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "system",
          parts: [
            {
              text: `Bạn là trợ lý ảo chuyên nghiệp của hệ thống quản trị TUTIMI Admin Dashboard.
              Xưng hô bạn (Admin-user) - mình(AssistantAI).
              Nhiệm vụ của bạn là phân tích dữ liệu kinh doanh được cung cấp và trả lời các thắc mắc.

              Quy tắc trả lời:
              1. Ngôn ngữ: Tiếng Việt, thân thiện, ngắn gọn nhưng chính xác.
              2. Nếu người dùng hỏi về doanh thu, số liệu, hãy nhìn vào 'systemContext'.
              3. Nếu dữ liệu không có trong 'systemContext', hãy lịch sự báo rằng bạn chưa có thông tin đó.
              4. Luôn ưu tiên các cảnh báo về kho hàng thấp (low stock) nếu người dùng hỏi về tình trạng cửa hàng.
              5. Trình bày rõ ràng, xuống dòng để dễ nhìn không gây rối mắt.`,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `DỮ LIỆU HỆ THỐNG (JSON):
              ${JSON.stringify(systemContext)}

              CÂU HỎI:
              ${prompt}`,
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      content: response.text,
    });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return NextResponse.json(
      { content: "Lỗi khi kết nối với Gemini AI." },
      { status: 500 }
    );
  }
}
