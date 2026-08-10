import { schoolRegistry } from '../schools';
import { siteConfig } from '../config/site';
import type { SchoolStatus } from '../core/schoolModule';

interface LandingPageProps {
  onSelectSchool: (schoolId: string) => void;
}

const STATUS_LABEL: Record<SchoolStatus, string> = {
  supported: 'Tính điểm',
  researching: 'Đang bổ sung',
  'formula-incomplete': 'Chưa đủ dữ liệu chính thức',
};

export function LandingPage({ onSelectSchool }: LandingPageProps) {
  const schools = Object.values(schoolRegistry).sort((a, b) => a.shortName.localeCompare(b.shortName, 'vi'));

  return (
    <div className="py-10 sm:py-14">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{siteConfig.name}</h1>
        <p className="mt-2 text-base text-muted sm:text-lg">{siteConfig.tagline}</p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <h2 className="text-sm font-semibold text-ink">Chọn trường để bắt đầu</h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">ĐHQG-HCM</p>

        <ul className="mt-3 flex flex-col gap-2">
          {schools.map((school) => {
            const isSupported = school.status === 'supported';
            return (
              <li
                key={school.id}
                className="flex items-center justify-between gap-3 rounded-card border border-ink/10 bg-surface p-4 shadow-card"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{school.shortName}</p>
                  <p className="text-xs text-muted">{school.name}</p>
                </div>
                {isSupported ? (
                  <button
                    type="button"
                    onClick={() => onSelectSchool(school.id)}
                    className="shrink-0 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    {STATUS_LABEL[school.status]}
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

        <p className="mt-4 text-center text-xs leading-relaxed text-muted">
          Xem chi tiết research công thức từng trường tại{' '}
          <a
            href="https://github.com/shadowhunter67/uniscore/blob/main/docs/admission-research-2026.md"
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
