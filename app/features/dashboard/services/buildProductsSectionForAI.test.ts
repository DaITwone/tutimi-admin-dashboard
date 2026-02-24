import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildProductsSectionForAI } from "./buildProductsSectionForAI";

const { buildProductsAIContextMock } = vi.hoisted(() => ({
  buildProductsAIContextMock: vi.fn(),
}));

vi.mock("./buildProductsAIContext", () => ({
  buildProductsAIContext: buildProductsAIContextMock,
}));

describe("buildProductsSectionForAI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns summary, top selling and grouped categories", async () => {
    buildProductsAIContextMock.mockResolvedValue([
      {
        id: "p1",
        name: "Milk",
        is_active: true,
        is_best_seller: true,
        category: { id: "c1", title: "Dairy" },
      },
      {
        id: "p2",
        name: "Tea",
        is_active: false,
        is_best_seller: false,
        category: { id: "c2", title: "Drinks" },
      },
      {
        id: "p3",
        name: "Cheese",
        is_active: true,
        is_best_seller: true,
        category: { id: "c1", title: "Dairy" },
      },
    ]);

    const result = await buildProductsSectionForAI();

    expect(result.total).toBe(3);
    expect(result.active).toBe(2);
    expect(result.inactive).toBe(1);
    expect(result.inactive_products).toHaveLength(1);
    expect(result.top_selling.map((p: { id: string }) => p.id)).toEqual(["p1", "p3"]);
    expect(result.by_category).toHaveLength(2);
    expect(result.by_category.find((g: { id: string }) => g.id === "c1")).toMatchObject({
      total: 2,
      active: 2,
    });
  });
});
