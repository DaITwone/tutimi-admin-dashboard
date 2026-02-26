"use client";

import { useState } from "react";
import {
  QUICK_ACTIONS,
  type Message,
} from "@/app/components/DashboardAIDrawer";

type DashboardAIContext = {
  kpi: unknown;
  lowStock: unknown;
  topProducts: unknown;
  currentRange: {
    from: string;
    to: string;
    bucket: string;
  };
};

export function useDashboardAIChat(dashboardContext: DashboardAIContext) {
  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const askGemini = async (userText: string) => {
    setIsLoading(true);
    const typingId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: userText },
      { id: typingId, role: "assistant", content: "", isTyping: true },
    ]);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
      const endpoint = apiBase
        ? `${apiBase}/api/dashboard-ai`
        : "/api/dashboard-ai";

      const history = messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          history,
          dashboardContext,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message ?? `API error ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? { ...m, isTyping: false, content: data.content }
            : m,
        ),
      );
    } catch (_error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                ...m,
                isTyping: false,
                content: "Ket noi that bai, vui long kiem tra API.",
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (id: string) => {
    const action = QUICK_ACTIONS.find((a) => a.id === id);
    if (action) askGemini(action.label);
  };

  const handleSendMessage = (text: string) => {
    askGemini(text);
  };

  function handleResetChat() {
    setMessages([]);
    setIsLoading(false);
  }

  return {
    aiOpen,
    setAiOpen,
    messages,
    isLoading,
    handleQuickAction,
    handleSendMessage,
    handleResetChat,
  };
}
