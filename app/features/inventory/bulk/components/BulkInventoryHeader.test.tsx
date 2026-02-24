import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BulkInventoryHeader } from "./BulkInventoryHeader";

describe("BulkInventoryHeader", () => {
  it("renders title and handles back click", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <BulkInventoryHeader
        title="Nhập Hàng"
        lastReceiptId={null}
        successCount={0}
        submitting={false}
        canSubmit={false}
        onBack={onBack}
        onPrint={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Nhập Hàng" })
    ).toBeInTheDocument();

    await user.click(screen.getAllByRole("button")[0]);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("shows receipt code and enables print/submit", async () => {
    const user = userEvent.setup();
    const onPrint = vi.fn();
    const onSubmit = vi.fn();

    render(
      <BulkInventoryHeader
        title="Xuất Hàng"
        lastReceiptId="abcdef12-xxxx-yyyy"
        successCount={1}
        submitting={false}
        canSubmit={true}
        onBack={vi.fn()}
        onPrint={onPrint}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText("ABCDEF12")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[1]);
    await user.click(buttons[2]);

    expect(onPrint).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
