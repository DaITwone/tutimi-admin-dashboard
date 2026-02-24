import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditVoucherDrawer from "./EditVoucherDrawer";

const { fromMock, updateEqMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  updateEqMock: vi.fn(),
}));

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    from: fromMock,
  },
}));

describe("EditVoucherDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateEqMock.mockResolvedValue({ error: null });

    fromMock.mockImplementation((table: string) => {
      if (table !== "vouchers") return {};
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: {
                code: "VC10",
                title: "Voucher old",
                description: "Desc",
                discount_type: "percent",
                discount_value: 10,
                min_order_value: 100,
                max_usage_per_user: 1,
                for_new_user: false,
                is_active: true,
              },
            }),
          })),
        })),
        update: vi.fn(() => ({
          eq: updateEqMock,
        })),
      };
    });
  });

  it("loads voucher and submits update", async () => {
    const user = userEvent.setup();
    const onUpdated = vi.fn();
    const onClose = vi.fn();

    render(<EditVoucherDrawer code="VC10" onClose={onClose} onUpdated={onUpdated} />);

    await screen.findByDisplayValue("Voucher old");

    const textboxes = screen.getAllByRole("textbox");
    await user.clear(textboxes[1]);
    await user.type(textboxes[1], "Voucher new");

    const saveButton = screen
      .getAllByRole("button")
      .find((btn) => (btn.textContent ?? "").toLowerCase().includes("l")) as
      | HTMLButtonElement
      | undefined;
    expect(saveButton).toBeDefined();

    await user.click(saveButton as HTMLButtonElement);

    await waitFor(() => {
      expect(updateEqMock).toHaveBeenCalledWith("code", "VC10");
    });
    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
