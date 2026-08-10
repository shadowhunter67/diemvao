import { RotateCcw } from 'lucide-react';
import { ShareButton } from './ShareButton';
import { siteConfig } from '../config/site';
import { activeSchool } from '../schools';

interface HeaderProps {
  onReset: () => void;
  buildShareUrl: () => string;
  onChangeSchool: () => void;
}

export function Header({ onReset, buildShareUrl, onChangeSchool }: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{siteConfig.name}</h1>
        <p className="mt-1 text-sm text-muted sm:text-base">{siteConfig.tagline}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
            {activeSchool.shortName}
          </span>
          <span className="text-sm text-ink">{activeSchool.name}</span>
          <button
            type="button"
            onClick={onChangeSchool}
            className="rounded-sm text-xs font-medium text-accent underline-offset-2 transition hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            Đổi trường
          </button>
        </div>
        <p className="mt-0.5 text-xs text-muted">Xét tuyển tổng hợp {activeSchool.year}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ShareButton buildShareUrl={buildShareUrl} />
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-surface-soft hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Đặt lại
        </button>
      </div>
    </header>
  );
}
