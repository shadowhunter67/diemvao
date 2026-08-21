/**
 * localStorage wrapper KHÔNG BAO GIỜ throw ra ngoài — `setItem`/`getItem`/`removeItem` thật có thể
 * throw (quota exceeded, storage disabled, private/incognito mode ở 1 số browser, in-app browser
 * hạn chế, extension can thiệp, SSR không có `localStorage`). Trước batch này, các callsite gọi
 * `localStorage.*` trực tiếp trong effect (vd `ApplicantProfileProvider`, `HcmutCalculatorPage`) —
 * throw ở đó là uncaught error trong React effect, có thể sập UI nếu không có error boundary bọc
 * ngoài. Chính sách: persistence failure là "best-effort, im lặng" — app luôn tiếp tục chạy bằng
 * in-memory state, KHÔNG che giấu bằng cách nuốt lỗi ở tầng logic nghiệp vụ (sanitize/parse vẫn giữ
 * nguyên hành vi cũ, chỉ bọc thêm access tới storage thật).
 *
 * KHÔNG check `typeof window === 'undefined'` riêng — tham chiếu `localStorage` (global chưa khai
 * báo ở SSR/node) tự ném `ReferenceError`, đã nằm trong try/catch bên dưới, không cần check trùng.
 */
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Trả `true` nếu ghi thành công, `false` nếu storage từ chối (quota/disabled/...) — caller không
 * bắt buộc phải xử lý return value (phần lớn callsite hiện có là "fire and forget" trong effect),
 * nhưng giá trị trả về sẵn sàng cho caller nào cần biết ghi có thành công hay không. */
export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemoveItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
