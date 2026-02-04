export function formatMoney(amount: number) {
    const compact = new Intl.NumberFormat("vi-VN", {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
    }).format(amount);

    return `${compact} ₫`;
}

export function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency", // currency = tiền tệ
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}