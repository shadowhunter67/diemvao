import { useMemo, useState } from 'react';
import { schoolRegistry } from '../schools';
import { siteConfig } from '../config/site';
import type { SchoolCapabilities, SchoolStatus } from '../core/schoolModule';
import { useApplicantProfile } from '../core/applicantProfileContextCore';
import { summarizeApplicantProfile } from '../core/applicantProfileSummary';

interface LandingPageProps {
  onSelectSchool: (schoolId: string) => void;
  onOpenCompare: () => void;
}

/** Wording hướng tới thí sinh/phụ huynh — tránh thuật ngữ kỹ thuật ("calculator", "formula
 * verified"). Chi tiết kỹ thuật hơn vẫn có ở badge capabilities bên dưới cho ai cần biết sâu. */
const STATUS_TEXT: Record<SchoolStatus, string> = {
  supported: '✓ Có thể tính điểm của bạn',
  researching: '○ Đang bổ sung dữ liệu',
  'formula-incomplete': '○ Chưa đủ dữ liệu chính thức để tính điểm',
};

/** Bỏ dấu tiếng Việt để so khớp không phân biệt "bách khoa" / "bach khoa". */
function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase();
}

const CAPABILITY_LABELS: { key: keyof SchoolCapabilities; label: string }[] = [
  { key: 'admissionInfo', label: 'Thông tin' },
  { key: 'programs', label: 'Ngành' },
  { key: 'eligibility', label: 'Điều kiện' },
  { key: 'cutoffs', label: 'Điểm chuẩn' },
  { key: 'exactCalculator', label: 'Tính điểm chính xác' },
];

export function LandingPage({ onSelectSchool, onOpenCompare }: LandingPageProps) {
  const [query, setQuery] = useState('');
  const schools = useMemo(
    () => Object.values(schoolRegistry).sort((a, b) => a.shortName.localeCompare(b.shortName, 'vi')),
    []
  );

  // Batch 6, workstream O/P — cho user thấy rõ họ đang có "hồ sơ điểm dùng chung" (đã nhập ở 1
  // trường, có thể dùng lại ở trường khác) + cách xóa nếu muốn. Không build dashboard lớn — chỉ 1
  // dòng summary cực ngắn, im lặng hoàn toàn nếu profile rỗng (không hint giả).
  const { profile, clearProfile } = useApplicantProfile();
  const profileSummary = summarizeApplicantProfile(profile);

  function handleClearProfile() {
    if (typeof window !== 'undefined' && !window.confirm('Xóa toàn bộ hồ sơ điểm dùng chung đã lưu? Hành động này không thể hoàn tác.')) {
      return;
    }
    clearProfile();
  }

  const normalizedQuery = normalizeForSearch(query.trim());
  const filteredSchools =
    normalizedQuery === ''
      ? schools
      : schools.filter(
          (school) =>
            normalizeForSearch(school.shortName).includes(normalizedQuery) ||
            normalizeForSearch(school.name).includes(normalizedQuery)
        );

  return (
    <div className="py-10 sm:py-14">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{siteConfig.name}</h1>
        <p className="mt-2 text-base text-muted sm:text-lg">{siteConfig.tagline}</p>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Nhập điểm một lần, rồi xem nhiều trường tự áp dụng quy tắc riêng: trường nào tính được chính xác,
          trường nào mới tính được một phần, và nguồn nào đang được dùng.
        </p>
      </div>

      {profileSummary.hasData && (
        <div className="mx-auto mt-8 max-w-2xl rounded-card border border-accent/20 bg-accent/5 px-4 py-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-ink">
              <span className="font-medium">Đã lưu hồ sơ điểm dùng chung.</span>{' '}
              <span className="text-muted">Điểm đã nhập có thể được dùng lại khi bạn xem trường khác.</span>
            </p>
            <button
              type="button"
              onClick={handleClearProfile}
              className="shrink-0 text-xs font-medium text-muted underline-offset-2 hover:text-danger hover:underline"
            >
              Xóa hồ sơ đã lưu
            </button>
          </div>
          <p className="mt-1.5 text-xs text-muted">
            {[
              profileSummary.vactTotal !== undefined ? `ĐGNL: ${profileSummary.vactTotal}` : null,
              profileSummary.thptSubjectCount > 0 ? `THPT: ${profileSummary.thptSubjectCount} môn đã lưu` : null,
              profileSummary.transcriptSubjectCount > 0 ? `Học bạ: ${profileSummary.transcriptSubjectCount} môn đã lưu` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <details className="mt-2 rounded-md border border-accent/15 bg-surface/70 px-3 py-2">
            <summary className="cursor-pointer text-xs font-medium text-ink">Xem hồ sơ đã lưu</summary>
            <dl className="mt-2 grid gap-2 text-xs text-muted sm:grid-cols-3">
              <div>
                <dt className="font-medium text-ink">ĐGNL</dt>
                <dd>{profileSummary.vactTotal !== undefined ? profileSummary.vactTotal : 'Chưa có'}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">THPT</dt>
                <dd>
                  {profileSummary.thptSubjects.length > 0
                    ? profileSummary.thptSubjects.map((subject) => `${subject.label}: ${subject.score}`).join(' · ')
                    : 'Chưa có'}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Học bạ</dt>
                <dd>
                  {profileSummary.transcriptSubjects.length > 0
                    ? profileSummary.transcriptSubjects.map((subject) => subject.label).join(' · ')
                    : 'Chưa có'}
                </dd>
              </div>
            </dl>
          </details>
          <button
            type="button"
            onClick={onOpenCompare}
            className="mt-3 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20"
          >
            Xem hồ sơ ở tất cả trường
          </button>
        </div>
      )}

      {!profileSummary.hasData && (
        <div className="mx-auto mt-8 max-w-2xl rounded-card border border-ink/10 bg-surface px-4 py-3 text-sm shadow-card">
          <p className="font-medium text-ink">Xem hồ sơ ở tất cả trường</p>
          <p className="mt-1 text-xs text-muted">
            Nhập điểm ở một trường trước, rồi UniscoreVN sẽ tổng hợp chính xác/một phần/chưa hỗ trợ cho từng trường.
          </p>
        </div>
      )}

      <div className="mx-auto mt-8 max-w-2xl">
        <h2 className="text-sm font-semibold text-ink">Chọn trường để bắt đầu</h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">ĐHQG-HCM</p>

        <div className="mt-3">
          <label htmlFor="school-search" className="sr-only">
            Tìm trường theo tên
          </label>
          <input
            id="school-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm trường theo tên, ví dụ: Bách Khoa, UEH, Kinh tế..."
            className="w-full rounded-card border border-ink/10 bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          />
        </div>

        {filteredSchools.length === 0 ? (
          <p className="mt-4 rounded-card border border-ink/10 bg-surface p-4 text-center text-sm text-muted">
            Không tìm thấy trường phù hợp với "{query.trim()}".
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {filteredSchools.map((school) => {
              const isClickable = school.Page !== undefined;
              const buttonLabel = school.status === 'supported' ? 'Tính điểm' : 'Xem thông tin';
              return (
                <li
                  key={school.id}
                  className="flex items-center justify-between gap-3 rounded-card border border-ink/10 bg-surface p-4 shadow-card"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{school.shortName}</p>
                    <p className="text-xs text-muted">{school.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{school.summary ?? STATUS_TEXT[school.status]}</p>
                    {school.capabilities && (
                      <ul className="mt-1.5 flex flex-wrap gap-1">
                        {CAPABILITY_LABELS.filter(({ key }) => school.capabilities?.[key]).map(({ key, label }) => (
                          <li
                            key={key}
                            className="rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success"
                          >
                            {label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {isClickable ? (
                    <button
                      type="button"
                      onClick={() => onSelectSchool(school.id)}
                      className="shrink-0 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      {buttonLabel}
                    </button>
                  ) : (
                    <span className="shrink-0 rounded-md border border-ink/10 px-3 py-1.5 text-xs font-medium text-muted opacity-70">
                      Chưa mở
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

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
