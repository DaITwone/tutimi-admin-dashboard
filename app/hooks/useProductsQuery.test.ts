import { beforeEach, describe, expect, it, vi } from "vitest";
import { queryKeys } from "@/app/lib/queryKeys";
import { useProductsQuery } from "./useProductsQuery";

type UseQueryOptionsLike = {
  queryKey: unknown;
  queryFn: () => Promise<unknown>;
  staleTime?: number;
};

type QueryBuilder = {
  select: (value: string) => QueryBuilder;
  order: (column: string, opts: { ascending: boolean }) => QueryBuilder;
  eq: (column: string, value: unknown) => QueryBuilder;
  ilike: (column: string, value: string) => QueryBuilder;
  data: unknown;
  error: unknown;
};

const { useQueryMock, fromMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
  fromMock: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: useQueryMock,
}));

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    from: fromMock,
  },
}));

function createBuilder(payload: unknown, error: unknown = null) {
  const builder = {} as QueryBuilder;

  builder.select = vi.fn(() => builder);
  builder.order = vi.fn(() => builder);
  builder.eq = vi.fn(() => builder);
  builder.ilike = vi.fn(() => builder);
  builder.data = payload;
  builder.error = error;

  return builder;
}

describe("useProductsQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useQueryMock.mockImplementation((opts: UseQueryOptionsLike) => opts);
  });

  it("builds base query and returns data", async () => {
    const builder = createBuilder([{ id: "p1", name: "A" }]);
    fromMock.mockReturnValue(builder);

    const params = {
      categoryId: "all",
      search: "",
      manageMode: false,
      statusFilter: "all" as const,
    };

    useProductsQuery(params);
    const options = useQueryMock.mock.calls[0][0] as UseQueryOptionsLike;
    const data = await options.queryFn();

    expect(options.queryKey).toEqual(queryKeys.products(params));
    expect(options.staleTime).toBe(20_000);
    expect(builder.eq).not.toHaveBeenCalled();
    expect(builder.ilike).not.toHaveBeenCalled();
    expect(data).toEqual([{ id: "p1", name: "A" }]);
  });

  it("applies category, status and search filters", async () => {
    const builder = createBuilder([]);
    fromMock.mockReturnValue(builder);

    useProductsQuery({
      categoryId: "cat-1",
      search: "  latte  ",
      manageMode: true,
      statusFilter: "off",
    });

    const options = useQueryMock.mock.calls[0][0] as UseQueryOptionsLike;
    await options.queryFn();

    expect(builder.eq).toHaveBeenCalledWith("category_id", "cat-1");
    expect(builder.eq).toHaveBeenCalledWith("is_active", false);
    expect(builder.ilike).toHaveBeenCalledWith("name", "%latte%");
  });
});
