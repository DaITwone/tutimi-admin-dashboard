import { buildSystemPrompt } from "../prompt";
import { generateGeminiContent } from "../providers/gemini.provider";
import {
  getInventorySectionForAI,
  getProductsSectionForAI,
} from "../repositories/dashboard.repository";
import { AppError, DashboardAiRequest } from "../types/api";

export async function askDashboardAI(input: DashboardAiRequest) {
  const prompt = input.prompt?.trim();
  if (!prompt) throw new AppError(400, "INVALID_BODY", "prompt is required");

  const productsContext = await getProductsSectionForAI();
  const rawRange =
    input.dashboardContext?.currentRange ?? input.dashboardContext?.range;

  const range = {
    from:
      rawRange?.from ??
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    to: rawRange?.to ?? new Date().toISOString(),
    bucket: rawRange?.bucket ?? "day",
  };

  const inventoryContext = await getInventorySectionForAI({
    lowStockLimit: 5,
    highStockLimit: 5,
    recentTransactionLimit: 20,
    from: range?.from ?? null,
    to: range?.to ?? null,
  });

  const systemContext = {
    dashboard: { kpi: input.dashboardContext?.kpi, range },
    products: productsContext,
    inventory: inventoryContext,
  };

  const contents = [
    {
      role: "user" as const,
      parts: [{ text: buildSystemPrompt(systemContext) }],
    },
    ...(input.history ?? []),
    {
      role: "user" as const,
      parts: [{ text: prompt }],
    },
  ];

  const content = await generateGeminiContent({ contents });
  return { content };
}
