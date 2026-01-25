'use client';

type NewsPreviewProps = {
    title: string;
    description: string;
    content: string;
    image: File | string | null;
    hashtag: string;
    type: string;
    createdAt?: string;
};

/* ===================== SKELETON ===================== */
const Skeleton = ({ className }: { className: string }) => (
    <div
        className={`animate-pulse rounded bg-gray-200 ${className}`}
    />
);

export default function NewsPreview({
    title,
    description,
    content,
    image,
    hashtag,
    type,
    createdAt = '',
}: NewsPreviewProps) {
    const imageUrl =
        image instanceof File
            ? URL.createObjectURL(image)
            : typeof image === 'string'
                ? image
                : null;

    return (
        <div className="sticky top-7">
            {/* PHONE FRAME */}
            <div className="mx-auto w-90 overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl">
                {/* STATUS BAR */}
                <div className="flex items-center justify-between bg-[#1c4273] px-4 py-2 text-xs text-white">
                    <span>18:28</span>
                    <span>📶 🔋</span>
                </div>

                {/* HEADER */}
                <div className="flex items-center gap-3 bg-[#1c4273] px-4 py-3 text-white">
                    <span className="text-lg">←</span>

                    <h3 className="flex-1 text-center text-sm font-medium">
                        {title ? (
                            title
                        ) : (
                            <Skeleton className="mx-auto h-4 w-32" />
                        )}
                    </h3>
                </div>

                {/* IMAGE */}
                <div className="relative bg-gray-100">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <Skeleton className="h-full w-full" />
                    )}
                </div>

                {/* CONTENT */}
                <div className="space-y-4 px-4 py-5">
                    {/* TAG */}
                    <span
                        className={`inline-block rounded-md px-3 py-1 text-xs font-semibold text-white
                            ${type === 'Khuyến Mãi'
                                ? 'bg-yellow-400'
                                : 'bg-blue-500'
                            }
                        `}
                    >
                        {type}
                    </span>


                    {/* TITLE */}
                    <h2 className="text-xl font-bold text-[#1c4273]">
                        {title ? (
                            title
                        ) : (
                            <Skeleton className="h-6 w-2/3" />
                        )}
                    </h2>

                    {/* DATE */}
                    {createdAt ? (
                        <p className="text-xs text-gray-400">
                            {createdAt}
                        </p>
                    ) : (
                        <Skeleton className="h-3 w-24" />
                    )}

                    {/* DESCRIPTION */}
                    <div className="space-y-2">
                        {description ? (
                            <h3 className="font-semibold uppercase text-gray-700">
                                {description}
                            </h3>
                        ) : (
                            <>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </>
                        )}
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="space-y-3">
                        {content ? (
                            content
                                .split('\n')
                                .filter(Boolean)
                                .map((line, i) => (
                                    <p
                                        key={i}
                                        className="text-sm leading-relaxed text-gray-700"
                                    >
                                        {line}
                                    </p>
                                ))
                        ) : (
                            <>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-2/3" />
                            </>
                        )}
                    </div>

                    {/* HASHTAG */}
                    {hashtag ? (
                        <p className="pt-3 text-sm font-medium text-blue-600">
                            #{hashtag}
                        </p>
                    ) : (
                        <Skeleton className="h-4 w-32" />
                    )}
                </div>

                {/* BOTTOM TAB */}
                <div className="flex justify-between border-t px-4 py-3 text-xs text-gray-400">
                    <span>Trang chủ</span>
                    <span>Menu</span>
                    <span className="font-medium text-[#1b4f94]">
                        Tin tức
                    </span>
                    <span>Tài khoản</span>
                </div>
            </div>

            {/* PREVIEW LABEL */}
            <div className="mt-3 text-center text-xs text-gray-400">
                Preview giao diện app
            </div>
        </div>
    );
}
