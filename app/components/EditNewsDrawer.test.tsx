import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditNewsDrawer from "./EditNewsDrawer";

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

describe("EditNewsDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getPublicImageUrlMock.mockReturnValue("https://cdn/n.png");
    uploadImageUnifiedMock.mockResolvedValue("new-news.png");
    updateEqMock.mockResolvedValue({ error: null });

    fromMock.mockImplementation((table: string) => {
      if (table !== "news") return {};
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: {
                title: "Old title",
                description: "Old desc",
                content: "Body",
                type: "Tin Tức",
                hashtag: "sale",
                is_active: true,
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

  it("fetches current news and updates on save", async () => {
    const user = userEvent.setup();
    const onUpdated = vi.fn();
    const onClose = vi.fn();

    render(<EditNewsDrawer newsId="n1" onClose={onClose} onUpdated={onUpdated} />);

    await screen.findByDisplayValue("Old title");

    const textboxes = screen.getAllByRole("textbox");
    await user.clear(textboxes[0]);
    await user.type(textboxes[0], "New title");

    const saveButton = screen
      .getAllByRole("button")
      .find((btn) => (btn.textContent ?? "").toLowerCase().includes("l")) as
      | HTMLButtonElement
      | undefined;
    expect(saveButton).toBeDefined();

    await user.click(saveButton as HTMLButtonElement);

    await waitFor(() => {
      expect(updateEqMock).toHaveBeenCalledWith("id", "n1");
    });
    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
