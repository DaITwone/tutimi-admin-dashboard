"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Send, X, RotateCcw, Bot, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    isTyping?: boolean;
}

interface DashboardAIDrawerProps {
    open: boolean;
    onClose: () => void;
    onQuickAction: (id: string) => void;
    onSendMessage: (text: string) => void;
    onReset: () => void;
    messages: Message[];
    isLoading: boolean;
}

export const QUICK_ACTIONS = [
    { id: "sales_report", label: "Báo cáo doanh thu hôm nay" },
    { id: "inventory_check", label: "Sản phẩm sắp hết hàng" },
    { id: "news_summary", label: "Tóm tắt tin tức mới" },
];

export function DashboardAIDrawer({
    open,
    onClose,
    onQuickAction,
    onSendMessage,
    onReset,
    messages,
    isLoading,
}: DashboardAIDrawerProps) {
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Tự động cuộn xuống cuối khi có tin nhắn mới
    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isLoading]);

    if (!open) return null;

    const handleResetRequest = () => {
        if (messages.length > 0) {
            setShowConfirmReset(true);
        }
    }

    const handleConfirmReset = () => {
        onReset();
        setShowConfirmReset(false);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const text = formData.get("message")?.toString();
        if (text?.trim()) {
            onSendMessage(text);
            e.currentTarget.reset();
        }
    };

    return (
        <div className="absolute bottom-20 right-5 w-100 h-137.5 rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-blue2 text-primary-foreground rounded-t-xl">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-bold">TUTIMI Assistant</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" onClick={handleResetRequest}>
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            {/* Chat Content */}
            <CardContent className="flex-1 p-0 overflow-hidden bg-slate-50 relative">
                {showConfirmReset && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-[2px] animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl p-6 shadow-2xl border text-center space-y-4 max-w-[80%] animate-in zoom-in-95 duration-200">
                            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                                <AlertCircle className="text-red-500 h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Xóa lịch sử chat?</h4>
                                <p className="text-xs text-slate-500 mt-1">Hành động này sẽ xóa toàn bộ tin nhắn hiện tại của bạn.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 rounded-xl text-xs"
                                    onClick={() => setShowConfirmReset(false)}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    size="sm"
                                    className="flex-1 rounded-xl text-xs bg-red-500 hover:bg-red-600 text-white border-none"
                                    onClick={handleConfirmReset}
                                >
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                <ScrollArea className="h-full p-4" ref={scrollRef}>
                    <div className="space-y-3">
                        {messages.length === 0 && (
                            <div className="text-center space-y-3">
                                <p className="text-sm text-muted-foreground">Chào Dat! Hôm nay tớ có thể giúp gì cho TUTIMI?</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {QUICK_ACTIONS.map((action) => (
                                        <Button
                                            key={action.id}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs text-blue2 rounded-full bg-white"
                                            onClick={() => onQuickAction(action.id)}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((m) => (
                            <div key={m.id} className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border overflow-hidden bg-white`}>
                                    {m.role === "assistant" ? (
                                        <Image src="/images/whale.png" alt="AI" width={32} height={32} />
                                    ) : (
                                        <Image src="/images/avt.png" alt="User" width={32} height={32} />
                                    )}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${m.role === "user"
                                    ? "bg-blue2 text-primary-foreground"
                                    : "bg-white text-foreground border"
                                    }`}>
                                    {m.isTyping ? (
                                        <div className="flex gap-1 py-1 px-2">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                        </div>
                                    ) : (
                                        m.content
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>

            <Separator />

            {/* Footer / Input */}
            <CardFooter className="p-4 bg-white rounded-2xl">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                    <input
                        name="message"
                        autoComplete="off"
                        placeholder="Mình có thể hỗ trợ gì được cho bạn..."
                        className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" className="rounded-full shrink-0 bg-blue2" disabled={isLoading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </div>
    );
}