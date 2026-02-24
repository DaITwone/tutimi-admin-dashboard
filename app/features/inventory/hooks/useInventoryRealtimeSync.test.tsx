import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useInventoryRealtimeSync } from "./useInventoryRealtimeSync";

const { useQueryClientMock, invalidateQueriesMock, channelMock, removeChannelMock } =
  vi.hoisted(() => {
    const invalidateQueries = vi.fn();
    const removeChannel = vi.fn();
    const channel = vi.fn();
    return {
      useQueryClientMock: vi.fn(() => ({ invalidateQueries })),
      invalidateQueriesMock: invalidateQueries,
      channelMock: channel,
      removeChannelMock: removeChannel,
    };
  });

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: useQueryClientMock,
}));

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    channel: channelMock,
    removeChannel: removeChannelMock,
  },
}));

describe("useInventoryRealtimeSync", () => {
  it("subscribes channels, invalidates queries and cleans up", () => {
    const handlers: Array<(payload: { new?: { product_id?: string } }) => void> = [];
    const subscribedChannels: Array<{ id: string }> = [];

    channelMock.mockImplementation((id: string) => {
      const channel = { id };
      subscribedChannels.push(channel);
      return {
        on: (
          _event: string,
          _config: object,
          handler: (payload: { new?: { product_id?: string } }) => void
        ) => {
          handlers.push(handler);
          return {
            subscribe: () => channel,
          };
        },
      };
    });

    const { unmount } = renderHook(() => useInventoryRealtimeSync());

    handlers[0]({});
    handlers[1]({ new: { product_id: "p1" } });

    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["products"] });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: ["inventoryTransactions", "p1"],
    });

    unmount();

    expect(removeChannelMock).toHaveBeenCalledWith(subscribedChannels[0]);
    expect(removeChannelMock).toHaveBeenCalledWith(subscribedChannels[1]);
  });
});
