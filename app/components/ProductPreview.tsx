type ProductPreviewProps = {
    name: string;
    price: number | '';
    salePrice: number | null;
    image: File | string | null;
    stats: string;
    isBestSeller: boolean;
};

export default function ProductPreview({
    name,
    price,
    salePrice,
    image,
    stats,
    isBestSeller,
}: ProductPreviewProps) {
    const imageUrl =
        image instanceof File
            ? URL.createObjectURL(image)
            : typeof image === 'string'
                ? image
                : null;

    return (
        <div className="sticky top-7">
            {/* PHONE FRAME */}
            <div
                className="mx-auto w-90 rounded-xl border border-gray-300 bg-white shadow-xl overflow-hidden">
                {/* STATUS BAR */}
                <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
                    <span>18:39</span>
                    <span>📶 🔋</span>
                </div>

                {/* HEADER */}
                <div className="px-4 pb-3">
                    <h3 className="text-lg font-semibold text-[#1b4f94]">
                        Thực đơn
                    </h3>
                    <p className="text-sm text-gray-500">
                        Chọn món bạn yêu thích ☕
                    </p>
                </div>

                {/* TABS */}
                <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
                    {['Tất cả', 'Cà Phê', 'Trà Sữa', 'Matcha'].map(
                        (item, i) => (
                            <div
                                key={item}
                                className={`min-w-18 h-8 flex items-center justify-center rounded-full shadow-sm px-3 text-sm text-center leading-tight ${i === 0 ? 'bg-[#1b4f94] text-white' : 'bg-gray-100 text-gray-500'}`}
                            >
                                {item}
                            </div>
                        )
                    )}
                </div>

                {/* PRODUCT LIST */}
                <div className="space-y-5 px-4 pb-6">
                    {/* REAL PRODUCT */}
                    <div className="flex gap-3 items-start">
                        {/* IMAGE */}
                        <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">
                                    No image
                                </div>
                            )}
                        </div>

                        {/* INFO */}
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-[#1c4273]">
                                {name || 'Tên sản phẩm'}
                                {isBestSeller && <span className="ml-2 rounded-2xl bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">Best seller</span>}
                            </p>

                            <p className="text-xs text-gray-400">
                                {stats || '0 đã bán | 0 lượt thích'}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                                {salePrice && price ? (
                                    <>
                                        <span className="text-xs text-gray-400 line-through">{price.toLocaleString()}đ</span>
                                        <span className="font-semibold text-red-500">{salePrice.toLocaleString()}đ</span>
                                    </>
                                ) : price ? (
                                    <span className="font-semibold text-red-500">{price.toLocaleString()}đ</span>
                                ) : (
                                    <span className="font-semibold text-red-500">0đ</span>
                                )}
                            </div>

                        </div>

                        {/* ADD BUTTON */}
                        <button className="h-6 w-5 rounded-lg bg-[#1b4f94] text-white">
                            +
                        </button>
                    </div>

                    {/* SKELETON ITEMS */}
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex gap-3 items-start animate-pulse"
                        >
                            <div className="h-14 w-14 rounded-lg bg-gray-200" />

                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-2/3 rounded bg-gray-200" />
                                <div className="h-3 w-1/2 rounded bg-gray-200" />
                                <div className="h-3 w-1/3 rounded bg-gray-200" />
                            </div>

                            <div className="h-9 w-9 rounded-lg bg-gray-200" />
                        </div>
                    ))}
                </div>

                {/* BOTTOM TAB */}
                <div className="border-t px-4 py-3 flex justify-between text-xs text-gray-400">
                    <span>Trang chủ</span>
                    <span className="text-[#1b4f94] font-medium">
                        Menu
                    </span>
                    <span>Tin tức</span>
                    <span>Tài khoản</span>
                </div>
            </div>

            {/* PREVIEW BADGE */}
            <div className="mt-3 text-center text-xs text-gray-400">
                Preview giao diện app
            </div>
        </div>
    );
}
