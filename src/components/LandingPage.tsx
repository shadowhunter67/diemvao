import { useMemo, useState } from 'react';
import { schoolRegistry } from '../schools';
import { siteConfig } from '../config/site';
import type { SchoolModule, SchoolStatus } from '../core/schoolModule';
import { useApplicantProfile } from '../core/applicantProfileContextCore';
import { summarizeApplicantProfile } from '../core/applicantProfileSummary';
import { deriveSchoolCtaLabel } from '../core/schoolCta';
import { SharedProfileEditor } from './SharedProfileEditor';

interface LandingPageProps {
  onSelectSchool: (schoolId: string) => void;
  onOpenCompare: () => void;
}

/** Wording hướng tới thí sinh/phụ huynh — tránh thuật ngữ kỹ thuật ("calculator", "formula
 * verified"). */
const STATUS_TEXT: Record<SchoolStatus, string> = {
  supported: 'Có thể tính điểm của bạn',
  researching: 'Đang bổ sung dữ liệu',
  'formula-incomplete': 'Chưa đủ dữ liệu chính thức để tính điểm',
};

/** Chấm trạng thái nhỏ trước tên CTA — màu suy trực tiếp từ capability thật (không hard-code theo
 * school ID), cùng nguồn với `deriveSchoolCtaLabel`. */
function schoolStatusDotClass(school: SchoolModule): string {
  const c = school.capabilities;
  if (c?.exactCalculator) return 'bg-success';
  if (c?.partialCalculator || c?.scoreConversion || c?.eligibility) return 'bg-warning';
  return 'bg-ink/20';
}

/** Bỏ dấu tiếng Việt để so khớp không phân biệt "bách khoa" / "bach khoa". */
function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase();
}

/** Bảng màu badge viết tắt xoay vòng theo index — chỉ để phân biệt trực quan giữa các thẻ trên
 * cùng 1 hàng, không mang ý nghĩa xếp hạng/trạng thái (trạng thái đã có chấm màu riêng). */
const BADGE_PALETTE = [
  'bg-accent/10 text-accent',
  'bg-teal-500/10 text-teal-600',
  'bg-amber-500/10 text-amber-700',
  'bg-rose-500/10 text-rose-600',
  'bg-sky-500/10 text-sky-600',
  'bg-emerald-500/10 text-emerald-600',
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
  const { profile, updateProfile, updateVactTotal, clearProfile } = useApplicantProfile();
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

      <div className="mx-auto mt-8 max-w-2xl rounded-card border border-accent/20 bg-accent/5 px-4 py-3 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-ink">
            <span className="font-medium">Hồ sơ điểm dùng chung.</span>{' '}
            <span className="text-muted">Nhập ở đây, rồi UniscoreVN áp cho từng trường — thiếu gì sẽ báo khi so sánh.</span>
          </p>
          {profileSummary.hasData && (
            <button
              type="button"
              onClick={handleClearProfile}
              className="shrink-0 text-xs font-medium text-muted underline-offset-2 hover:text-danger hover:underline"
            >
              Xóa hồ sơ đã lưu
            </button>
          )}
        </div>
        {profileSummary.hasData && (
          <p className="mt-1.5 text-xs text-muted">
            {[
              profileSummary.vactTotal !== undefined ? `ĐGNL: ${profileSummary.vactTotal}` : null,
              profileSummary.thptSubjectCount > 0 ? `THPT: ${profileSummary.thptSubjectCount} môn đã lưu` : null,
              profileSummary.transcriptSubjectCount > 0 ? `Học bạ: ${profileSummary.transcriptSubjectCount} môn đã lưu` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
        <details open={profileSummary.hasData} className="mt-2 rounded-md border border-accent/15 bg-surface/70 px-3 py-2">
          <summary className="cursor-pointer text-xs font-medium text-ink">Nhập / chỉnh sửa điểm</summary>
          <SharedProfileEditor profile={profile} updateProfile={updateProfile} updateVactTotal={updateVactTotal} />
        </details>
        {profileSummary.hasData && (
          <button
            type="button"
            onClick={onOpenCompare}
            className="mt-3 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20"
          >
            Xem hồ sơ ở tất cả trường
          </button>
        )}
      </div>

      <div className="mx-auto mt-8 max-w-5xl">
        <h2 className="text-sm font-semibold text-ink">Chọn trường để bắt đầu</h2>

        <div className="mt-3 max-w-2xl">
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
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSchools.map((school, index) => {
              const isClickable = school.Page !== undefined;
              const buttonLabel = deriveSchoolCtaLabel(school);
              const badgeColor = BADGE_PALETTE[index % BADGE_PALETTE.length];
              return (
                <li key={school.id} className="flex flex-col rounded-card border border-ink/10 bg-surface p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <div
                      aria-hidden="true"
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold leading-none ${badgeColor}`}
                    >
                      {school.shortName.slice(0, 5)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{school.shortName}</p>
                      <p className="text-xs text-muted">{school.name}</p>
                    </div>
                  </div>

                  <p className="mt-3 flex-1 text-xs leading-relaxed text-muted">
                    {school.about ?? school.summary ?? STATUS_TEXT[school.status]}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted">
                      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${schoolStatusDotClass(school)}`} />
                      {STATUS_TEXT[school.status]}
                    </span>
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
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-6 text-center text-xs leading-relaxed text-muted">
          Xem chi tiết research công thức từng trường tại{' '}
          <a
            href="https://github.com/shadowhunter67/uniscorevn/blob/main/docs/admission-research-2026.md"
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
