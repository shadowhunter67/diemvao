import { useEffect } from 'react';
import { X } from 'lucide-react';
import { schoolRegistry, activeSchoolId } from '../schools';
import type { SchoolStatus } from '../core/schoolModule';

interface SchoolSelectorProps {
  open: boolean;
  onClose: () => void;
}

const STATUS_LABEL: Record<SchoolStatus, string> = {
  supported: 'Tính điểm',
  researching: 'Đang bổ sung',
  'formula-incomplete': 'Chưa đủ dữ liệu chính thức',
};

export function SchoolSelector({ open, onClose }: SchoolSelectorProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const schools = Object.values(schoolRegistry).sort((a, b) => a.shortName.localeCompare(b.shortName, 'vi'));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 pt-16 backdrop-blur-sm sm:pt-24">
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className="fixed inset-0 cursor-default"
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Chọn trường"
        className="relative w-full max-w-md rounded-card bg-surface p-6 shadow-card sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Chọn trường</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-md p-1.5 text-muted transition hover:bg-ink/5 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">ĐHQG-HCM</p>

        <ul className="mt-3 flex flex-col gap-2">
          {schools.map((school) => {
            const isActive = school.id === activeSchoolId;
            const isSupported = school.status === 'supported';
            return (
              <li
                key={school.id}
                className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                  isActive ? 'border-accent/40 bg-accent/10' : 'border-ink/10'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-ink">{school.shortName}</p>
                  <p className="text-xs text-muted">{school.name}</p>
                </div>
                {isSupported ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 rounded-md border border-accent/30 bg-surface px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    {isActive ? 'Đang chọn' : STATUS_LABEL[school.status]}
                  </button>
                ) : (
                  <span className="shrink-0 rounded-md border border-ink/10 px-3 py-1.5 text-xs font-medium text-muted">
                    {STATUS_LABEL[school.status]}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Xem chi tiết research công thức từng trường tại{' '}
          <a
            href="https://github.com/shadowhunter67/diemvao/blob/main/docs/admission-research-2026.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            docs/admission-research-2026.md
          </a>
          .
        </p>
      </div>
    </div>
  );
}
