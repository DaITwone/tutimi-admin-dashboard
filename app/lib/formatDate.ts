export function formatDateShort(dateString: string) {
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit"
    })
}