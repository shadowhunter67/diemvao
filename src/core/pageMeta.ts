/** Đổi document.title (và description nếu có) theo route hiện tại — không dùng thư viện SEO. */
export function setPageMeta(title: string, description?: string): void {
  if (typeof document === 'undefined') return;
  document.title = title;
  if (description === undefined) return;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', description);
}
