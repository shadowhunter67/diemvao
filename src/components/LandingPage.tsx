import { useMemo, useState } from 'react';
import { schoolRegistry } from '../schools';
import { siteConfig } from '../config/site';
import type { SchoolEntityLevel, SchoolModule, SchoolRegion, SchoolStatus } from '../core/schoolModule';
import { useApplicantProfile } from '../core/applicantProfileContextCore';
import { summarizeApplicantProfile } from '../core/applicantProfileSummary';
import { deriveSchoolCtaLabel } from '../core/schoolCta';
import {
  SUPPORT_STATUS_LABELS,
  deriveInstitutionSupportStatus,
  getEntityLevelLabel,
  getSchoolEntityLevel,
  institutionCoverage,
  type InstitutionSupportStatus,
} from '../data/institutionCoverage';
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
  const supportStatus = deriveInstitutionSupportStatus(school);
  if (supportStatus === 'verified-calculator') return 'bg-success';
  if (supportStatus === 'partial-calculator' || supportStatus === 'eligibility-only') return 'bg-warning';
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

type StatusFilter = SchoolStatus | 'all';
type EntityFilter = 'university' | 'academy' | 'college' | 'college_pedagogy' | 'vocational_college' | 'all';

/** Thứ tự hiển thị chip lọc: "đầy đủ nhất" trước, khớp thứ tự người dùng quan tâm khi chọn trường. */
const STATUS_FILTER_ORDER: SchoolStatus[] = ['supported', 'researching', 'formula-incomplete'];

/** Mức tính điểm THẬT SỰ derive từ `capabilities` (không phải `status`, vốn còn phụ thuộc có Page
 * hay chưa — xem `schoolModule.ts`) — cùng nguồn với `schoolStatusDotClass`. */
type CapabilityTier = InstitutionSupportStatus;

function deriveCapabilityTier(school: SchoolModule): CapabilityTier {
  return deriveInstitutionSupportStatus(school);
}

const TIER_LABELS: Record<CapabilityTier, string> = {
  'verified-calculator': SUPPORT_STATUS_LABELS['verified-calculator'],
  'partial-calculator': SUPPORT_STATUS_LABELS['partial-calculator'],
  'eligibility-only': SUPPORT_STATUS_LABELS['eligibility-only'],
  researched: SUPPORT_STATUS_LABELS.researched,
  'catalog-only': SUPPORT_STATUS_LABELS['catalog-only'],
};

const REGION_LABELS: Record<SchoolRegion, string> = { hcm: 'TP.HCM', hanoi: 'Hà Nội', other: 'Khu vực khác' };
const ENTITY_FILTER_LABELS: Record<Exclude<EntityFilter, 'all'>, string> = {
  university: 'Đại học',
  academy: 'Học viện',
  college: 'Cao đẳng',
  college_pedagogy: 'CĐ sư phạm/GDMN',
  vocational_college: 'CĐ nghề',
};
const UNIVERSITY_FILTER_LEVELS: readonly SchoolEntityLevel[] = ['institution', 'university_system', 'member_university', 'other_degree_awarding_institution'];

function matchesEntityFilter(school: SchoolModule, filter: EntityFilter): boolean {
  const entityLevel = getSchoolEntityLevel(school);
  if (filter === 'all') return true;
  if (filter === 'university') return UNIVERSITY_FILTER_LEVELS.includes(entityLevel);
  if (filter === 'academy') return entityLevel === 'academy';
  if (filter === 'college') return entityLevel === 'college_pedagogy' || entityLevel === 'vocational_college';
  return entityLevel === filter;
}

type OptionalFilter<T extends string> = T | 'all';

/** Select nhỏ dùng chung cho các bộ lọc phụ (khu vực/mức tính điểm) — trường nào chưa set field
 * tương ứng thì luôn bị loại khỏi mọi lựa chọn khác "Tất cả" (không đoán mặc định). */
function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: OptionalFilter<T>;
  onChange: (value: OptionalFilter<T>) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-muted">
      <span className="shrink-0">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as OptionalFilter<T>)}
        className="rounded-md border border-ink/10 bg-surface px-2 py-1 text-xs text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <option value="all">Tất cả</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function LandingPage({ onSelectSchool, onOpenCompare }: LandingPageProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [regionFilter, setRegionFilter] = useState<OptionalFilter<SchoolRegion>>('all');
  const [tierFilter, setTierFilter] = useState<OptionalFilter<CapabilityTier>>('all');
  const [entityFilter, setEntityFilter] = useState<EntityFilter>('all');
  const schools = useMemo(
    () => Object.values(schoolRegistry).sort((a, b) => a.shortName.localeCompare(b.shortName, 'vi')),
    []
  );
  const statusCounts = useMemo(() => {
    const counts: Record<SchoolStatus, number> = { supported: 0, researching: 0, 'formula-incomplete': 0 };
    for (const school of schools) counts[school.status] += 1;
    return counts;
  }, [schools]);

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
  const filteredSchools = schools
    .filter(
      (school) =>
        normalizedQuery === '' ||
        normalizeForSearch(school.shortName).includes(normalizedQuery) ||
        normalizeForSearch(school.name).includes(normalizedQuery) ||
        normalizeForSearch(school.admissionCode ?? '').includes(normalizedQuery) ||
        (school.aliases ?? []).some((alias) => normalizeForSearch(alias).includes(normalizedQuery))
    )
    .filter((school) => statusFilter === 'all' || school.status === statusFilter)
    .filter((school) => matchesEntityFilter(school, entityFilter))
    .filter((school) => regionFilter === 'all' || school.region === regionFilter)
    .filter((school) => tierFilter === 'all' || deriveCapabilityTier(school) === tierFilter);

  return (
    <div className="py-10 sm:py-14">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{siteConfig.name}</h1>
        <p className="mt-2 text-base text-muted sm:text-lg">{siteConfig.tagline}</p>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Đại học · Học viện · Cao đẳng. Nhập điểm một lần, rồi xem từng cơ sở áp dụng quy tắc riêng:
          nơi nào tính được chính xác, nơi nào mới tính được một phần, và nguồn nào đang được dùng.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-card border border-accent/20 bg-accent/5 px-4 py-3 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-ink">
            <span className="font-medium">Hồ sơ điểm dùng chung.</span>{' '}
            <span className="text-muted">Nhập ở đây, rồi {siteConfig.name} áp cho từng cơ sở — thiếu gì sẽ báo khi so sánh.</span>
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
        <section className="mb-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4" aria-label="Thống kê độ phủ dữ liệu">
          <div className="rounded-card border border-ink/10 bg-surface p-3">
            <p className="text-xs text-muted">Tổng catalog</p>
            <p className="mt-1 text-lg font-semibold text-ink">{institutionCoverage.totalCatalogEntries}</p>
          </div>
          <div className="rounded-card border border-ink/10 bg-surface p-3">
            <p className="text-xs text-muted">Đại học/hệ ĐH</p>
            <p className="mt-1 text-lg font-semibold text-ink">{institutionCoverage.universityInstitutions}</p>
          </div>
          <div className="rounded-card border border-ink/10 bg-surface p-3">
            <p className="text-xs text-muted">Cao đẳng</p>
            <p className="mt-1 text-lg font-semibold text-ink">
              {institutionCoverage.pedagogicalColleges + institutionCoverage.vocationalColleges}
            </p>
          </div>
          <div className="rounded-card border border-ink/10 bg-surface p-3">
            <p className="text-xs text-muted">Calculator xác minh</p>
            <p className="mt-1 text-lg font-semibold text-ink">{institutionCoverage.fullyVerified}</p>
          </div>
        </section>
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

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Lọc theo trạng thái">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            aria-pressed={statusFilter === 'all'}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              statusFilter === 'all'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-ink/10 bg-surface text-muted hover:border-ink/20'
            }`}
          >
            Tất cả ({schools.length})
          </button>
          {STATUS_FILTER_ORDER.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === status
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-ink/10 bg-surface text-muted hover:border-ink/20'
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  status === 'supported' ? 'bg-success' : status === 'researching' ? 'bg-warning' : 'bg-ink/20'
                }`}
              />
              {STATUS_TEXT[status]} ({statusCounts[status]})
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <FilterSelect
            label="Loại"
            value={entityFilter}
            onChange={setEntityFilter}
            options={(Object.entries(ENTITY_FILTER_LABELS) as [Exclude<EntityFilter, 'all'>, string][]).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <FilterSelect
            label="Khu vực"
            value={regionFilter}
            onChange={setRegionFilter}
            options={(Object.entries(REGION_LABELS) as [SchoolRegion, string][]).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <FilterSelect
            label="Mức tính điểm"
            value={tierFilter}
            onChange={setTierFilter}
            options={(Object.entries(TIER_LABELS) as [CapabilityTier, string][]).map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </div>

        {filteredSchools.length === 0 ? (
          <p className="mt-4 rounded-card border border-ink/10 bg-surface p-4 text-center text-sm text-muted">
            {query.trim() === ''
              ? 'Không có trường nào khớp bộ lọc đang chọn.'
              : `Không tìm thấy trường phù hợp với "${query.trim()}".`}
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
                      <p className="mt-1 text-[11px] text-muted">{getEntityLevelLabel(school)}</p>
                    </div>
                  </div>

                  <p className="mt-3 flex-1 text-xs leading-relaxed text-muted">
                    {school.about ?? school.summary ?? STATUS_TEXT[school.status]}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted">
                      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${schoolStatusDotClass(school)}`} />
                      {SUPPORT_STATUS_LABELS[deriveInstitutionSupportStatus(school)]}
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
