import { siteConfig } from '../config/site';

const LINK_CLASS =
  'rounded-sm text-muted underline-offset-2 transition hover:text-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';

export function Footer() {
  return (
    <footer className="mt-10 border-t border-ink/10 pt-6 pb-8 text-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
        <div className="max-w-md text-muted">
          <p className="font-semibold text-ink">{siteConfig.name}</p>
          <p className="mt-1 leading-relaxed">{siteConfig.tagline}</p>
          <p className="mt-2 leading-relaxed">
            {siteConfig.name} là công cụ độc lập, không thuộc các trường đại học được hỗ trợ.
          </p>
        </div>

        <nav aria-label="Liên kết Uniscore" className="flex flex-col gap-2 sm:items-end">
          <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            GitHub
          </a>
          <a href={siteConfig.issuesUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            Báo lỗi &amp; góp ý
          </a>
          <a href="#data-sources" className={LINK_CLASS}>
            Nguồn dữ liệu
          </a>
        </nav>
      </div>

      <p className="mt-6 border-t border-ink/5 pt-4 text-xs text-muted">© 2026 {siteConfig.name}</p>
    </footer>
  );
}
