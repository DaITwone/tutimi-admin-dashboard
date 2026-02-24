import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ConfirmDeleteDrawer from "./ConfirmDeleteDrawer";

describe("ConfirmDeleteDrawer", () => {
  it("does not render when closed", () => {
    render(
      <ConfirmDeleteDrawer open={false} onCancel={vi.fn()} onConfirm={vi.fn()} />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls cancel and confirm callbacks", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDeleteDrawer open={true} onCancel={onCancel} onConfirm={onConfirm} />
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    await user.click(buttons[1]);

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables confirm button while loading", () => {
    render(
      <ConfirmDeleteDrawer
        open={true}
        loading={true}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getAllByRole("button")[1]).toBeDisabled();
  });
});
