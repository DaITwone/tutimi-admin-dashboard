import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merge classnames + tailwind conflict", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm");
  });

  it("bỏ falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
