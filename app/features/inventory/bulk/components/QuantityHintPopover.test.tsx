import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { QuantityHintPopover } from "./QuantityHintPopover";

describe("QuantityHintPopover", () => {
  it("opens popover and shows quantity hints", async () => {
    const user = userEvent.setup();
    render(<QuantityHintPopover />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(/500 ML/i)).toBeInTheDocument();
    expect(screen.getByText(/1 L =/i)).toBeInTheDocument();
  });
});
