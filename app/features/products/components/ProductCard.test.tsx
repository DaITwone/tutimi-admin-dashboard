import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ProductCard from "./ProductCard";
import type { Product } from "../types";

vi.mock("@/app/lib/storage", () => ({
  getPublicImageUrl: () => "https://example.com/p.png",
}));

const product: Product = {
  id: "p1",
  name: "Cafe Sua",
  price: 30000,
  sale_price: 25000,
  stats: "100 sold",
  is_best_seller: true,
  image: "p.png",
  is_active: true,
};

describe("ProductCard", () => {
  it("renders product information", () => {
    render(
      <ProductCard
        product={product}
        manageMode={false}
        checked={false}
        onToggleChecked={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("Cafe Sua")).toBeInTheDocument();
    expect(screen.getByText(/Best seller/i)).toBeInTheDocument();
    expect(screen.getByText(/100 sold/i)).toBeInTheDocument();
  });

  it("calls edit/delete callbacks in normal mode", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <ProductCard
        product={product}
        manageMode={false}
        checked={false}
        onToggleChecked={vi.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const actionButtons = screen.getAllByRole("button");
    await user.click(actionButtons[0]);
    await user.click(actionButtons[1]);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("shows checkbox and toggles in manage mode", async () => {
    const user = userEvent.setup();
    const onToggleChecked = vi.fn();

    render(
      <ProductCard
        product={product}
        manageMode={true}
        checked={false}
        onToggleChecked={onToggleChecked}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onToggleChecked).toHaveBeenCalledWith(true);
  });
});
