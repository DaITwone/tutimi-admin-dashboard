import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardRangeFilter } from "./DashboardRangeFilter";

describe("DashboardRangeFilter", () => {
  it("updates from date to ISO start of day", () => {
    const onChange = vi.fn();
    const value = { from: null, to: null, bucket: "day" as const };

    const { container } = render(
      <DashboardRangeFilter value={value} onChange={onChange} />
    );

    const fromInput = container.querySelectorAll(
      'input[type="date"]'
    )[0] as HTMLInputElement;

    fireEvent.change(fromInput, { target: { value: "2026-02-10" } });

    const expectedDate = new Date("2026-02-10");
    expectedDate.setHours(0, 0, 0, 0);

    expect(onChange).toHaveBeenCalledWith({
      ...value,
      from: expectedDate.toISOString(),
    });
  });

  it("clears to date to null", () => {
    const onChange = vi.fn();
    const value = {
      from: "2026-02-01T00:00:00.000Z",
      to: "2026-02-20T23:59:59.999Z",
      bucket: "day" as const,
    };

    const { container } = render(
      <DashboardRangeFilter value={value} onChange={onChange} />
    );

    const toInput = container.querySelectorAll(
      'input[type="date"]'
    )[1] as HTMLInputElement;

    fireEvent.change(toInput, { target: { value: "" } });

    expect(onChange).toHaveBeenCalledWith({
      ...value,
      to: null,
    });
  });
});

// container là DOM root của component trong môi trường test (jsdom)
// React component -> render HTML -> container chứa HTML đó.

