import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const {
  generateContentMock,
  buildSystemPromptMock,
  buildProductsSectionForAIMock,
  buildInventorySectionForAIMock,
} = vi.hoisted(() => ({
  generateContentMock: vi.fn(),
  buildSystemPromptMock: vi.fn(),
  buildProductsSectionForAIMock: vi.fn(),
  buildInventorySectionForAIMock: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = {
      generateContent: generateContentMock,
    };
  },
}));

vi.mock("./prompt", () => ({
  buildSystemPrompt: buildSystemPromptMock,
}));

vi.mock(
  "@/app/features/dashboard/services/buildProductsSectionForAI",
  () => ({
    buildProductsSectionForAI: buildProductsSectionForAIMock,
  })
);

vi.mock(
  "@/app/features/dashboard/services/buildInventorySectionForAI",
  () => ({
    buildInventorySectionForAI: buildInventorySectionForAIMock,
  })
);

describe("dashboard-ai route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    buildProductsSectionForAIMock.mockResolvedValue({ total: 2 });
    buildInventorySectionForAIMock.mockResolvedValue({ recent_transactions: [] });
    buildSystemPromptMock.mockReturnValue("system-prompt");
    generateContentMock.mockResolvedValue({ text: "assistant answer" });
  });

  it("returns ai content for valid request", async () => {
    const req = new Request("http://localhost/api/dashboard-ai", {
      method: "POST",
      body: JSON.stringify({
        prompt: "hello",
        history: [{ role: "user", parts: [{ text: "old" }] }],
        dashboardContext: {
          kpi: { revenue: 1 },
          range: { from: "a", to: "b", bucket: "day" },
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ content: "assistant answer" });
    expect(buildProductsSectionForAIMock).toHaveBeenCalled();
    expect(buildInventorySectionForAIMock).toHaveBeenCalledWith({
      lowStockLimit: 5,
      highStockLimit: 5,
      recentTransactionLimit: 20,
    });
    expect(generateContentMock).toHaveBeenCalled();
  });

  it("returns 500 fallback when provider throws", async () => {
    generateContentMock.mockRejectedValueOnce(new Error("provider down"));

    const req = new Request("http://localhost/api/dashboard-ai", {
      method: "POST",
      body: JSON.stringify({ prompt: "hello" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(String(data.content).toLowerCase()).toContain("assistant");
  });
});
