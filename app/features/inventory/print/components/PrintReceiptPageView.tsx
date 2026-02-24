"use client";

import { ArrowLeft, Printer } from "lucide-react";
import Image from "next/image";
import { getPublicImageUrl } from "@/app/lib/storage";
import type { PrintReceiptViewModel, ReceiptType } from "@/app/features/inventory/print/types";
import { formatDateVN, getInputText } from "@/app/features/inventory/print/utils/format";

type PrintReceiptPageViewProps = PrintReceiptViewModel & {
  receiptType: ReceiptType;
  onBack: () => void;
  onPrint: () => void;
};

function StateCard({
  title,
  description,
  actionLabel,
  onAction,
  danger,
}: {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
  danger?: boolean;
}) {
  return (
    <div className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <div className={`text-lg font-bold ${danger ? "text-red-600" : "text-[#1c4273]"}`}>{title}</div>
      {description ? <p className="text-sm text-gray-600">{description}</p> : null}
      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-lg bg-[#1b4f94] px-4 py-2 text-sm text-white hover:bg-[#1c4273]"
      >
        <ArrowLeft size={16} />
        {actionLabel}
      </button>
    </div>
  );
}

export function PrintReceiptPageView({
  loading,
  error,
  rows,
  productMap,
  createdAt,
  reasonText,
  totalQty,
  title,
  receiptCode,
  receiptType,
  onBack,
  onPrint,
}: PrintReceiptPageViewProps) {
  if (loading) {
    return (
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-52 rounded bg-gray-200" />
          <div className="h-4 w-80 rounded bg-gray-200" />
          <div className="h-48 w-full rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <StateCard
        title="Loi"
        description={error}
        actionLabel="Quay lai"
        onAction={onBack}
        danger
      />
    );
  }

  if (rows.length === 0) {
    return (
      <StateCard
        title="Khong tim thay phieu"
        description="Phieu nay khong co du lieu hoac da bi xoa."
        actionLabel="Quay lai"
        onAction={onBack}
      />
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-2 print:hidden md:flex md:items-center md:justify-between md:gap-3">
        <button
          onClick={onBack}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#1b4f94]/20 bg-[#1b4f94]/10 px-4 py-2 text-sm font-semibold text-[#1b4f94] hover:bg-[#1b4f94]/15 active:scale-95 sm:w-auto"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <button
          onClick={onPrint}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b4f94] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c4273] active:scale-95 sm:w-auto"
        >
          <Printer size={16} />
          In
        </button>
      </div>

      <div className="min-h-screen bg-gray-100 px-3 py-6 print:bg-white print:px-0 print:py-0 md:px-0 md:py-10">
        <div className="flex justify-center overflow-x-auto">
          <div className="origin-top scale-[0.46] print:scale-100 sm:scale-[0.62] md:scale-100">
            <div
              className="mx-auto min-h-[297mm] w-[210mm] rounded-sm border border-gray-200 bg-white px-[14mm] py-[12mm] shadow-xl
              print:min-h-0 print:w-auto print:rounded-none print:border-none print:px-0 print:py-0 print:shadow-none"
            >
              <div className="w-full">
                <div className="mb-3 flex items-start justify-between gap-4 pb-3 text-[11px] leading-[1.4] text-gray-700 print:text-[10px]">
                  <div>
                    <div className="text-base font-semibold uppercase text-gray-900">CÔNG TY CỔ PHẦN TTMI</div>
                    <div>MST: 0317025010</div>
                    <div>146 Bình Lợi, Phường 13, Quận Bình Thạnh, Thành phố Hồ Chí Minh</div>
                  </div>

                  <div className="min-w-57.5 text-center">
                    <div className="text-sm font-semibold text-gray-900">Mẫu số: 01 - VT</div>
                    <div className="italic">(Ban hành theo thông tư số 133/2016/TT-BTC</div>
                    <div className="italic">Ngày 26/08/2016 của Bộ Tài Chính)</div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="space-y-0.5 text-center">
                    <div className="text-3xl font-bold text-[#1c4273]">{title}</div>
                    {createdAt ? (
                      <div className="text-sm italic text-gray-600">{formatDateVN(createdAt)}</div>
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">Mã phiếu:</span>{" "}
                      <span className="font-mono text-[#1b4f94]">{receiptCode}</span>
                    </div>

                    {reasonText ? (
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-800">Lý do:</span>{" "}
                        <span className="text-[#1b4f94]">{reasonText}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 overflow-hidden border print:rounded-none">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr className="border-b">
                        <th className="w-12 px-4 py-3 text-center">STT</th>
                        <th className="px-4 py-3 text-left">Sản phẩm</th>
                        <th className="px-4 py-3 text-center">Tổng định lượng/ĐVT</th>
                        <th className="px-4 py-3 text-center">
                          {receiptType === "in" ? "Số lượng nhập" : "Số lượng xuất"}
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {rows.map((row, index) => {
                        const product = productMap.get(row.product_id) ?? null;

                        return (
                          <tr key={row.id}>
                            <td className="px-4 py-3 text-center font-semibold text-gray-700">{index + 1}</td>

                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 overflow-hidden rounded-lg">
                                  {product?.image ? (
                                    <Image
                                      src={getPublicImageUrl("products", product.image) ?? ""}
                                      alt={product?.name ?? "product"}
                                      width={48}
                                      height={48}
                                      className="h-full w-full object-contain"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                                      No image
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="font-semibold text-[#1b4f94]">{product?.name ?? "Unknown product"}</div>
                                  <div className="text-xs text-gray-500">ID: {row.product_id.slice(0, 8).toUpperCase()}</div>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3 text-center text-gray-700">{getInputText(row)}</td>

                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex min-w-10 justify-center rounded-lg py-1.5 font-bold text-[#1b4f94]">
                                {row.applied_quantity}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mr-5 mt-6 border-t pt-4 text-sm">
                  <div className="flex items-start justify-between gap-6">
                    <div />
                    <div className="space-y-1 text-right text-gray-700">
                      <div>
                        Tổng số lượng: <span className="font-semibold text-gray-900">{totalQty}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-4 gap-6 text-center print:mt-12">
                    {["Người lập phiếu", "Người giao hàng", "Người nhận hàng", "Người vận chuyển"].map((label) => (
                      <div key={label} className="text-xs text-gray-700">
                        <div className="font-semibold text-gray-900">{label}</div>
                        <div className="mt-0.5 text-[11px] italic text-gray-500">(Ký, họ tên)</div>
                        <div className="mt-12 border-t border-gray-400/60 pt-1 text-[10px] text-gray-400">Ký tên</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

