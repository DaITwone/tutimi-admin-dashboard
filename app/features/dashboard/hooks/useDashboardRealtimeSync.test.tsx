import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDashboardRealtimeSync } from "./useDashboardRealtimeSync";

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

describe("useDashboardRealtimeSync", () => {
  it("invalidates dashboard keys on realtime events and removes channels", () => {
    const handlers: Array<() => void> = [];
    const subscribedChannels: Array<{ id: string }> = [];

    channelMock.mockImplementation((id: string) => {
      const channel = { id };
      subscribedChannels.push(channel);
      return {
        on: (_event: string, _config: object, handler: () => void) => {
          handlers.push(handler);
          return {
            subscribe: () => channel,
          };
        },
      };
    });

    const { unmount } = renderHook(() => useDashboardRealtimeSync());

    handlers.forEach((fn) => fn());

    expect(invalidateQueriesMock).toHaveBeenCalledTimes(3);
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["dashboard"] });

    unmount();

    expect(removeChannelMock).toHaveBeenCalledWith(subscribedChannels[0]);
    expect(removeChannelMock).toHaveBeenCalledWith(subscribedChannels[1]);
    expect(removeChannelMock).toHaveBeenCalledWith(subscribedChannels[2]);
  });
});
