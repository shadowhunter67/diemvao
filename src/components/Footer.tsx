import { siteConfig } from '../config/site';

export function Footer() {
  return (
    <footer className="mt-10 border-t border-ink/5 pt-6 pb-10 text-sm text-muted">
      <p className="font-semibold text-ink">{siteConfig.name}</p>
      <p className="mt-1 max-w-2xl leading-relaxed">Công cụ hỗ trợ tính và mô phỏng điểm xét tuyển đại học.</p>
      <p className="mt-1 max-w-2xl leading-relaxed">
        {siteConfig.name} là công cụ độc lập, không thuộc các trường đại học được hỗ trợ.
      </p>
    </footer>
  );
}
