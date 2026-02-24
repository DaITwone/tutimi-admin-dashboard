export function formatMoney(amount: number) {
    const compact = new Intl.NumberFormat("vi-VN", {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1, // chỉ cho tối đa 1 số thập phân
    }).format(amount);

    return `${compact} ₫`;
}

export function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency", // currency = tiền tệ
    currency: "VND",
    maximumFractionDigits: 0, // không dùng số thập phân
  }).format(amount);
}