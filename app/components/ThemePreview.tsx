// app/components/ThemePreview.tsx
'use client';

import Image from "next/image";

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
    <div className="sticky mt-7">
      {/* PHONE FRAME */}
      <div
        className="mx-auto w-80 overflow-hidden rounded-[28px] border border-gray-300 shadow-xl"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: imageUrl ? undefined : '#fff', // default theme nền trắng
        }}
      >
        {/* STATUS BAR */}
        <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-700">
          <span>13:58</span>
          <span>📶 🔋</span>
        </div>

        {/* CONTENT */}
        <div className="px-4 pb-24">
          {/* PROFILE CARD */}
          <div className="mt-4 rounded-3xl bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-200">
                <Image src="/images/avt-demo.jpg" alt="Avatar" width={56} height={56} className="object-cover" />
              </div>

              <div className="flex-1">
                <div className="text-[18px] font-extrabold text-[#1c4273]">
                  {name ? name : <Skeleton className="h-5 w-28" />}
                </div>

                <div className="text-sm text-gray-500">
                  user@gmail.com
                </div>
              </div>

              <div className="text-xl text-gray-700">⚙️</div>
            </div>
          </div>

          {/* MENU CARD 1 */}
          <div className="mt-5 rounded-3xl bg-white/90 p-2 shadow-sm backdrop-blur">
            {['Đơn hàng của tôi', 'Kho voucher', 'Địa chỉ giao hàng', 'Yêu thích'].map(
              (label) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-3 py-3"
                >
                  <span className="text-sm font-semibold text-[#1c4273]">
                    {label}
                  </span>
                  <span className="text-gray-400">›</span>
                </div>
              )
            )}
          </div>

          {/* MENU CARD 2 */}
          <div className="mt-5 rounded-3xl bg-white/90 p-2 shadow-sm backdrop-blur">
            {['Thông tin tài khoản', 'Đổi mật khẩu'].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between px-3 py-3"
              >
                <span className="text-sm font-semibold text-[#1c4273]">
                  {label}
                </span>
                <span className="text-gray-400">›</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM TAB - giữ nền trắng */}
        <div className="border-t bg-white px-6 py-3">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Trang chủ</span>
            <span>Menu</span>
            <span>Tin tức</span>
            <span className="font-semibold text-[#1c4273]">Tài khoản</span>
          </div>
        </div>
      </div>

      {/* PREVIEW LABEL */}
      <div className="mt-3 text-center text-xs text-gray-400">
        Preview giao diện app
      </div>
    </div>
  );
}
