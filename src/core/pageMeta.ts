import { siteConfig } from '../config/site';

export interface PageMetaOptions {
  title: string;
  /** Bỏ trống thì dùng `siteConfig.description` mặc định. */
  description?: string;
  /** Đường dẫn route hiện tại (vd '/', '/compare', '/hcmut') — dùng để dựng canonical/og:url tuyệt
   * đối. KHÔNG được luôn luôn là '/' (mỗi route hợp lệ phải có canonical đúng route đó). */
  path: string;
}

function upsertMetaByName(name: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLinkCanonical(href: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Cập nhật title/description/canonical/Open Graph/Twitter card theo route hiện tại (runtime,
 * không dùng thư viện SEO/không SSR). GIỚI HẠN đã biết: đây là SPA client-side, crawler không chạy
 * JS (đa số social-preview bot vẫn chạy JS, nhưng không phải tất cả) sẽ chỉ thấy meta tĩnh trong
 * index.html (trang chủ). Không có ảnh OG riêng cho từng route — repo chưa có asset ảnh social
 * preview thật, không tự tạo ảnh giả ở đây (og:image bị bỏ qua, Twitter card dùng "summary" không
 * cần ảnh bắt buộc).
 */
export function setPageMeta({ title, description, path }: PageMetaOptions): void {
  if (typeof document === 'undefined') return;

  const desc = description ?? siteConfig.description;
  const canonicalUrl = `${siteConfig.canonicalUrl}${path}`;

  document.title = title;
  upsertMetaByName('description', desc);
  upsertLinkCanonical(canonicalUrl);

  upsertMetaByProperty('og:site_name', siteConfig.name);
  upsertMetaByProperty('og:type', 'website');
  upsertMetaByProperty('og:title', title);
  upsertMetaByProperty('og:description', desc);
  upsertMetaByProperty('og:url', canonicalUrl);

  upsertMetaByName('twitter:card', 'summary');
  upsertMetaByName('twitter:title', title);
  upsertMetaByName('twitter:description', desc);
}
