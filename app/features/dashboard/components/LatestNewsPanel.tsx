import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardLatestNewsItem } from "../types/dashboard";
import { getPublicImageUrl } from "@/app/lib/storage"; // chỉnh đúng path file helper của bạn

function formatTime(iso: string | null) {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleString("vi-VN");
}

const STORAGE_BUCKET = "products"; // ✅ bucket của bạn

export function LatestNewsPanel({
    data,
    isLoading,
}: {
    data?: DashboardLatestNewsItem[];
    isLoading: boolean;
}) {
    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle>Tin tức mới</CardTitle>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full rounded-xl" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {(data ?? []).map((news) => {

                            return (
                                <div
                                    key={news.id}
                                    className="flex items-start gap-3 rounded-xl border p-3"
                                >
                                    <div className="relative mt-1 h-10 w-10 overflow-hidden rounded-lg border bg-muted">

                                        <img
                                            src={getPublicImageUrl("products", news.image) ?? ''}
                                            alt={news.title}
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="line-clamp-1 font-medium">{news.title}</div>

                                        {news.description ? (
                                            <div className="line-clamp-2 text-xs text-muted-foreground">
                                                {news.description}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-muted-foreground">
                                                Không có mô tả
                                            </div>
                                        )}

                                        <div className="mt-1 text-[11px] text-muted-foreground">
                                            {formatTime(news.created_at)} • {news.type}
                                            {news.is_active === false ? " • (Inactive)" : ""}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {(data ?? []).length === 0 && (
                            <div className="py-10 text-center text-sm text-muted-foreground">
                                Chưa có tin tức.
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
