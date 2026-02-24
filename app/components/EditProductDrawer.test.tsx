import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditProductDrawer from "./EditProductDrawer";

const { fromMock, getPublicImageUrlMock, uploadImageUnifiedMock, updateEqMock } =
  vi.hoisted(() => ({
    fromMock: vi.fn(),
    getPublicImageUrlMock: vi.fn(),
    uploadImageUnifiedMock: vi.fn(),
    updateEqMock: vi.fn(),
  }));

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    from: fromMock,
  },
}));

vi.mock("@/app/lib/storage", () => ({
  getPublicImageUrl: getPublicImageUrlMock,
  uploadImageUnified: uploadImageUnifiedMock,
}));

describe("EditProductDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getPublicImageUrlMock.mockReturnValue("https://cdn/p.png");
    uploadImageUnifiedMock.mockResolvedValue("new.png");
    updateEqMock.mockResolvedValue({ error: null });

    fromMock.mockImplementation((table: string) => {
      if (table !== "products") return {};
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: {
                name: "Milk",
                price: 100,
                sale_price: 90,
                stats: "hot",
                is_best_seller: true,
                image: "old.png",
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

  it("loads product data and submits update successfully", async () => {
    const user = userEvent.setup();
    const onUpdated = vi.fn();
    const onClose = vi.fn();

    render(<EditProductDrawer productId="p1" onClose={onClose} onUpdated={onUpdated} />);

    await screen.findByDisplayValue("Milk");

    const textboxes = screen.getAllByRole("textbox");
    await user.clear(textboxes[0]);
    await user.type(textboxes[0], "Milk Tea");

    const saveButton = screen
      .getAllByRole("button")
      .find((btn) => (btn.textContent ?? "").toLowerCase().includes("l")) as
      | HTMLButtonElement
      | undefined;
    expect(saveButton).toBeDefined();

    await user.click(saveButton as HTMLButtonElement);

    await waitFor(() => {
      expect(updateEqMock).toHaveBeenCalledWith("id", "p1");
    });
    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
