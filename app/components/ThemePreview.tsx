// app/components/ThemePreview.tsx
'use client';

import Image from 'next/image';

type ThemePreviewProps = {
  name: string;
  image: File | string | null;
};

/* ===================== SKELETON ===================== */
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

export default function ThemePreview({ name, image }: ThemePreviewProps) {
  const imageUrl =
    image instanceof File
      ? URL.createObjectURL(image)
      : typeof image === 'string'
        ? image
        : null;

  return (
  <div className="sticky top-7 mt-7">
    {/* PHONE FRAME */}
    <div
      className="mx-auto w-72 h-120 overflow-hidden rounded-[28px] border border-gray-300 shadow-xl"
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: imageUrl ? undefined : '#fff',
      }}
    >
      {/* WRAPPER */}
      <div className="flex h-full flex-col">
        {/* STATUS BAR */}
        <div className="flex items-center justify-between px-4 py-1.5 text-[11px] text-gray-700">
          <span>13:58</span>
          <span>📶 🔋</span>
        </div>

        {/* CONTENT (scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {/* PROFILE CARD */}
          <div className="mt-3 rounded-xl bg-white/90 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="/images/avt-demo.jpg"
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-extrabold text-[#1b4f94] truncate">
                  {name ? name : <Skeleton className="h-4 w-24" />}
                </div>

                <div className="mt-1 text-[11px] text-gray-500 truncate">
                  user@gmail.com
                </div>
              </div>

              <div className="text-lg text-gray-700">⚙️</div>
            </div>
          </div>

          {/* MENU CARD 1 */}
          <div className="mt-4 rounded-xl bg-white/90 p-1.5 shadow-sm backdrop-blur">
            {['Đơn hàng của tôi', 'Kho voucher', 'Địa chỉ giao hàng', 'Yêu thích'].map(
              (label) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-white/40 px-3 py-2 last:border-b-0"
                >
                  <span className="text-xs text-[#1c4273]">{label}</span>
                  <span className="text-xs text-gray-400">›</span>
                </div>
              )
            )}
          </div>

          {/* MENU CARD 2 */}
          <div className="mt-4 rounded-xl bg-white/90 p-1.5 shadow-sm backdrop-blur">
            {['Thông tin tài khoản', 'Đổi mật khẩu'].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-white/40 px-3 py-2 last:border-b-0"
              >
                <span className="text-xs text-[#1c4273]">{label}</span>
                <span className="text-xs text-gray-400">›</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM TAB (fixed at bottom) */}
        <div className="border-t bg-white px-6 py-2">
          <div className="flex justify-between text-[11px] text-gray-400">
            <span>Trang chủ</span>
            <span>Menu</span>
            <span>Tin tức</span>
            <span className="font-semibold text-[#1c4273]">Tài khoản</span>
          </div>
        </div>
      </div>
    </div>

    {/* PREVIEW LABEL */}
    <div className="mt-2 text-center text-[11px] text-gray-400">
      Preview giao diện app
    </div>
  </div>
);

}
