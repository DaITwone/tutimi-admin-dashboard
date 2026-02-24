import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildProductsAIContext } from "./buildProductsAIContext";

const { fromMock, getPublicImageUrlMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  getPublicImageUrlMock: vi.fn(),
}));

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    from: fromMock,
  },
}));

vi.mock("@/app/lib/storage", () => ({
  getPublicImageUrl: getPublicImageUrlMock,
}));

describe("buildProductsAIContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps product rows into AI context shape", async () => {
    fromMock.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: "p1",
            name: "Milk",
            price: 100,
            sale_price: null,
            image: "a.png",
            stock_quantity: 10,
            is_active: null,
            is_best_seller: true,
            stats: "hot",
            category: { id: "c1", title: "Dairy" },
          },
          {
            id: "p2",
            name: "Tea",
            price: 90,
            sale_price: 80,
            image: null,
            stock_quantity: 5,
            is_active: false,
            is_best_seller: false,
            stats: null,
            category: null,
          },
        ],
        error: null,
      }),
    });
    getPublicImageUrlMock.mockImplementation(
      (_bucket: string, path: string | null) => (path ? `https://cdn/${path}` : null)
    );

    const result = await buildProductsAIContext();

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: "p1",
      image: "https://cdn/a.png",
      is_active: true,
      category: { id: "c1", title: "Dairy" },
    });
    expect(result[1]).toMatchObject({
      id: "p2",
      image: null,
      is_active: false,
      category: null,
    });
  });
});
