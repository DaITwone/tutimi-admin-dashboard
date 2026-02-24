import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BulkSearchSection } from "./BulkSearchSection";

describe("BulkSearchSection", () => {
  it("renders selected count", () => {
    render(
      <BulkSearchSection search="" selectedCount={7} onChangeSearch={vi.fn()} />
    );

    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("calls onChangeSearch while typing", async () => {
    const user = userEvent.setup();
    const onChangeSearch = vi.fn();

    render(
      <BulkSearchSection
        search=""
        selectedCount={0}
        onChangeSearch={onChangeSearch}
      />
    );

    await user.type(screen.getByRole("textbox"), "cafe");

    expect(onChangeSearch).toHaveBeenCalled();
  });
});
