import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export type Message = {
    id: string
    role: "user" | "assistant"
    content?: string
    isTyping?: boolean
    table?: {
        columns: string[]
        rows: (string | number)[][]
    }
    actions?: { id: string; label: string }[]
}

const QUICK_ACTIONS = [
    { id: "summary", label: "Tóm tắt dashboard" },
    { id: "top", label: "Top bán chạy (7 ngày)" },
    { id: "low-stock", label: "Tồn kho thấp" },
    { id: "inout", label: "Nhập/Xuất kho (30 ngày)" },
];

type Props = {
    open: boolean
    onClose: () => void
    messages: Message[]
    onSendMessage: (text: string) => void
    onQuickAction: (id: string) => void
    onReset: () => void;
    isLoading?: boolean
}

export function DashboardAIDrawer({
    open,
    onClose,
    messages,
    onSendMessage,
    onQuickAction,
    onReset,
    isLoading,
}: Props) {
    const [input, setInput] = useState("")
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isLoading])

    if (!open) return null

    return (
        <div className="fixed bottom-25 right-8 z-50 w-90 h-130">
            <Card className="flex h-full flex-col rounded-2xl shadow-xl border">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div>
                        <div className="font-semibold text-[#1b4f94] text-sm">
                            Tutimi AI
                        </div>
                        <div className="text-[11px] text-gray-500">
                            Dashboard assistant
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onReset}
                        className="text-xs"
                    >
                        Reset
                    </Button>
                    <button
                        onClick={onClose}
                        className="text-xs rounded-md border px-2 py-1 hover:bg-gray-50"
                    >
                        ✕
                    </button>
                </div>

                {/* Chat body */}
                <ScrollArea className="flex-1 px-3 py-3">
                    <div className="flex flex-col gap-3">
                        {messages.length === 0 && (
                            <ChatBubble
                                role="assistant"
                                content="Mình có thể giúp bạn nhanh bằng các gợi ý sau:"
                                actions={QUICK_ACTIONS}
                                onAction={onQuickAction}
                            />
                        )}

                        {messages.map((m) => (
                            <ChatBubble
                                key={m.id}
                                role={m.role}
                                content={m.content}
                                table={m.table}
                                actions={m.actions}
                                isTyping={m.isTyping}
                                onAction={onQuickAction}
                            />
                        ))}

                        {isLoading && <TypingIndicator />}

                        <div ref={bottomRef} />
                    </div>
                </ScrollArea>

                {/* Composer */}
                <div className="border-t px-3 py-2">
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            disabled={isLoading}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && input.trim()) {
                                    onSendMessage(input.trim())
                                    setInput("")
                                }
                            }}
                            className="h-9 flex-1 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f94]/30"
                        />
                        <Button
                            size="sm"
                            disabled={!input.trim() || isLoading}
                            onClick={() => {
                                onSendMessage(input.trim())
                                setInput("")
                            }}
                            className="rounded-xl bg-[#1b4f94] text-white"
                        >
                            Gửi
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

/* ----------- Chat parts ----------- */

function ChatBubble({
    role,
    content,
    isTyping,
    table,
    actions,
    onAction,
}: {
    role: "user" | "assistant"
    content?: string
    isTyping?: boolean
    table?: Message["table"]
    actions?: Message["actions"]
    onAction?: (id: string) => void
}) {
    const isUser = role === "user"

    return (
        <div
            className={cn(
                "flex gap-2 max-w-[90%]",
                isUser ? "self-end flex-row-reverse" : "self-start"
            )}
        >
            <Avatar role={role} />

            <div
                className={cn(
                    "rounded-2xl px-3 py-2 text-sm",
                    isUser
                        ? "bg-[#1b4f94] text-white"
                        : "bg-gray-100 text-gray-800"
                )}
            >
                {isTyping ? (
                    <TypingDots />
                ) : (
                    <>
                        {content && <div>{content}</div>}

                        {table && (
                            <Card className="mt-2 p-2 rounded-xl">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {table.columns.map((c) => (
                                                <TableHead key={c}>{c}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {table.rows.map((row, i) => (
                                            <TableRow key={i}>
                                                {row.map((cell, j) => (
                                                    <TableCell key={`${i}-${j}`}>
                                                        {cell}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}

                        {actions && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {actions.map((a) => (
                                    <Button
                                        key={a.id}
                                        size="sm"
                                        variant="secondary"
                                        className="rounded-full text-xs"
                                        onClick={() => onAction?.(a.id)}
                                    >
                                        {a.label}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

function TypingIndicator() {
    return (
        <div className="self-start rounded-xl bg-gray-100 px-3 py-2 text-xs text-gray-500">
            Tutimi AI đang nhập…
        </div>
    )
}

function TypingDots() {
    return (
        <div className="flex items-center gap-1 px-1 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce"></span>
        </div>
    )
}

function Avatar({ role }: { role: 'user' | 'assistant' }) {
    return (
        <div
            className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold",
                role === "user"
                    ? "bg-[#1b4f94] text-white"
                    : "bg-gray-300 text-gray-700"
            )}
        >
            {role === "user" ? "U" : "AI"}
        </div>
    )
}
