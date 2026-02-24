import { describe, it, expect } from "vitest";
import { dashboardQueryKeys } from "./dashboardQueryKeys";

const range = { from: "2026-02-01", to: "2026-02-24", bucket: "day" };

describe("dashboardQueryKeys", () => {
  it("all", () => {
    expect(dashboardQueryKeys.all).toEqual(["dashboard"]);
  });

  it("kpis", () => {
    expect(dashboardQueryKeys.kpis(range)).toEqual(["dashboard", "kpis", range]);
  });

  it("topSellingProducts", () => {
    expect(dashboardQueryKeys.topSellingProducts(range, 5)).toEqual([
      "dashboard",
      "topSellingProducts",
      range,
      5,
    ]);
  });
});
