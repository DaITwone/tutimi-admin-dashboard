import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BulkReasonSection } from "./BulkReasonSection";
import { REASON_PRESETS } from "../bulk.model";

describe("BulkReasonSection", () => {
  it("render title và các nút preset", () => {
    render(
      <BulkReasonSection
        reasonPreset={REASON_PRESETS[0]}
        customReason=""
        onChangePreset={vi.fn()} // vi.fn() 'mock function' trong Vitest hàm giả - không làm gì cả - nhưng có khả năng ghi lại lịch sử bị gọi.
        onChangeCustomReason={vi.fn()}
      />
    );

    expect(screen.getByText(/lý do/i)).toBeInTheDocument(); // i là ignore case (không phân biệt hoa thường)
    REASON_PRESETS.forEach((preset) => {
      expect(screen.getByRole("button", { name: preset })).toBeInTheDocument();
    });
  });

  it("gọi onChangePreset khi click preset", async () => {
    const user = userEvent.setup();
    const onChangePreset = vi.fn();

    render(
      <BulkReasonSection
        reasonPreset={REASON_PRESETS[0]}
        customReason=""
        onChangePreset={onChangePreset}
        onChangeCustomReason={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: REASON_PRESETS[1] }));
    expect(onChangePreset).toHaveBeenCalledWith(REASON_PRESETS[1]);
  });

  it("hiện input và gọi onChangeCustomReason khi preset là 'Khác'", async () => {
    const user = userEvent.setup();
    const onChangeCustomReason = vi.fn();

    render(
      <BulkReasonSection
        reasonPreset={REASON_PRESETS[4]}
        customReason=""
        onChangePreset={vi.fn()}
        onChangeCustomReason={onChangeCustomReason}
      />
    );

    const input = screen.getByPlaceholderText(/nhập lý do/i);
    await user.type(input, "Dieu chinh ton kho");

    expect(onChangeCustomReason).toHaveBeenCalled();
  });
});
