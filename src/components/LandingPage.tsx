import { useEffect, useMemo, useState } from 'react';
import { schoolRegistry } from '../schools';
import { siteConfig } from '../config/site';
import type { SchoolModule, SchoolRegion } from '../core/schoolModule';
import { useApplicantProfile } from '../core/applicantProfileContextCore';
import { summarizeApplicantProfile } from '../core/applicantProfileSummary';
import { deriveSchoolCtaLabel, hasSchoolCtaAction } from '../core/schoolCta';
import {
  SUPPORT_STATUS_LABELS,
  deriveInstitutionSupportStatus,
  getEntityLevelLabel,
  institutionCoverage,
  type InstitutionSupportStatus,
} from '../data/institutionCoverage';
import { SharedProfileEditor } from './SharedProfileEditor';
import {
  filterSchoolsForLanding,
  getStableBadgePaletteIndex,
  hasActiveLandingFilters,
  INITIAL_VISIBLE_SCHOOL_COUNT,
  SUPPORT_TIER_ORDER,
  VISIBLE_SCHOOL_INCREMENT,
  type LandingEntityFilter,
  type LandingSortMode,
  type OptionalLandingFilter,
} from './landingCatalog';

interface LandingPageProps {
  onSelectSchool: (schoolId: string) => void;
  onOpenCompare: () => void;
}

const BADGE_PALETTE = [
  'bg-accent/10 text-accent',
  'bg-teal-500/10 text-teal-600',
  'bg-amber-500/10 text-amber-700',
  'bg-rose-500/10 text-rose-600',
  'bg-sky-500/10 text-sky-600',
  'bg-emerald-500/10 text-emerald-600',
];

type CapabilityTier = InstitutionSupportStatus;

const TIER_LABELS: Record<CapabilityTier, string> = {
  'verified-calculator': SUPPORT_STATUS_LABELS['verified-calculator'],
  'partial-calculator': SUPPORT_STATUS_LABELS['partial-calculator'],
  'eligibility-only': SUPPORT_STATUS_LABELS['eligibility-only'],
  researched: SUPPORT_STATUS_LABELS.researched,
  'catalog-only': SUPPORT_STATUS_LABELS['catalog-only'],
};

const REGION_LABELS: Record<SchoolRegion, string> = { hcm: 'TP.HCM', hanoi: 'Hà Nội', other: 'Khu vực khác' };

const ENTITY_FILTER_LABELS: Record<Exclude<LandingEntityFilter, 'all'>, string> = {
  university: 'Đại học',
  academy: 'Học viện',
  college: 'Cao đẳng',
  college_pedagogy: 'CĐ sư phạm/GDMN',
  vocational_college: 'CĐ nghề',
};

const SORT_LABELS: Record<LandingSortMode, string> = {
  useful: 'Hữu ích nhất',
  az: 'Tên A-Z',
};

function schoolStatusDotClass(school: SchoolModule): string {
  const supportStatus = deriveInstitutionSupportStatus(school);
  if (supportStatus === 'verified-calculator') return 'bg-success';
  if (supportStatus === 'partial-calculator' || supportStatus === 'eligibility-only' || supportStatus === 'researched') return 'bg-warning';
  return 'bg-ink/20';
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: OptionalLandingFilter<T>;
  onChange: (value: OptionalLandingFilter<T>) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-muted">
      <span className="shrink-0">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as OptionalLandingFilter<T>)}
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
  const [regionFilter, setRegionFilter] = useState<OptionalLandingFilter<SchoolRegion>>('all');
  const [tierFilter, setTierFilter] = useState<OptionalLandingFilter<CapabilityTier>>('all');
  const [entityFilter, setEntityFilter] = useState<LandingEntityFilter>('all');
  const [sortMode, setSortMode] = useState<LandingSortMode>('useful');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_SCHOOL_COUNT);
  const schools = useMemo(() => Object.values(schoolRegistry), []);
  const filters = useMemo(() => ({ query, entityFilter, regionFilter, tierFilter, sortMode }), [query, entityFilter, regionFilter, tierFilter, sortMode]);
  const filteredSchools = useMemo(() => filterSchoolsForLanding(schools, filters), [schools, filters]);
  const visibleSchools = filteredSchools.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSchools.length;
  const filtersActive = hasActiveLandingFilters(filters);
  const collegeCount = institutionCoverage.pedagogicalColleges + institutionCoverage.vocationalColleges;
  const tierCounts = useMemo(() => {
    const counts: Record<CapabilityTier, number> = {
      'verified-calculator': 0,
      'partial-calculator': 0,
      'eligibility-only': 0,
      researched: 0,
      'catalog-only': 0,
    };
    for (const school of schools) counts[deriveInstitutionSupportStatus(school)] += 1;
    return counts;
  }, [schools]);

  const { profile, updateProfile, updateVactTotal, clearProfile } = useApplicantProfile();
  const profileSummary = summarizeApplicantProfile(profile);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_SCHOOL_COUNT);
  }, [query, entityFilter, regionFilter, tierFilter, sortMode]);

  function resetFilters() {
    setQuery('');
    setEntityFilter('all');
    setRegionFilter('all');
    setTierFilter('all');
    setSortMode('useful');
  }

  function handleClearProfile() {
    if (typeof window !== 'undefined' && !window.confirm('Xóa toàn bộ hồ sơ điểm dùng chung đã lưu? Hành động này không thể hoàn tác.')) {
      return;
    }
    clearProfile();
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{siteConfig.name}</h1>
        <p className="mt-2 text-base text-muted sm:text-lg">{siteConfig.tagline}</p>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Đại học · Học viện · Cao đẳng. Nhập điểm một lần, so sánh theo quy tắc tuyển sinh riêng của từng cơ sở. Công thức chỉ được tính khi có đủ nguồn chính thức.
        </p>
      </div>

      <div className="mx-auto mt-7 max-w-2xl rounded-card border border-accent/20 bg-accent/5 px-4 py-3 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-ink">
            <span className="font-medium">Hồ sơ điểm dùng chung.</span>{' '}
            <span className="text-muted">Nhập ở đây, rồi {siteConfig.name} áp cho từng cơ sở; thiếu gì sẽ báo khi so sánh.</span>
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
            className="mt-3 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            So sánh với hồ sơ này
          </button>
        )}
      </div>

      <div className="mx-auto mt-7 max-w-5xl">
        <section className="mb-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4" aria-label="Thống kê độ phủ dữ liệu">
          <div className="rounded-card border border-ink/10 bg-surface p-3">
            <p className="text-xs text-muted">Cơ sở & đơn vị</p>
            <p className="mt-1 text-lg font-semibold text-ink">{institutionCoverage.totalCatalogEntries}</p>
          </div>
          <div className="rounded-card border border-ink/10 bg-surface p-3">
            <p className="text-xs text-muted">Cơ sở độc lập</p>
            <p className="mt-1 text-lg font-semibold text-ink">{institutionCoverage.independentEducationInstitutions}</p>
          </div>
          <div className="rounded-card border border-ink/10 bg-surface p-3">
            <p className="text-xs text-muted">Có dữ liệu tuyển sinh</p>
            <p className="mt-1 text-lg font-semibold text-ink">{institutionCoverage.admissionDataAvailable}</p>
          </div>
          <div className="rounded-card border border-ink/10 bg-surface p-3">
            <p className="text-xs text-muted">Calculator xác minh</p>
            <p className="mt-1 text-lg font-semibold text-ink">{institutionCoverage.fullyVerified}</p>
          </div>
        </section>
        <p className="mb-6 text-center text-xs text-muted">
          {institutionCoverage.universityInstitutions} đại học · {institutionCoverage.academies} học viện · {collegeCount} cao đẳng
          <span className="hidden sm:inline"> · </span>
          <span className="block sm:inline">
            {institutionCoverage.independentEducationInstitutions} cơ sở độc lập + {institutionCoverage.internalUnitEntries} đơn vị nội bộ = {institutionCoverage.totalCatalogEntries} mục danh mục
          </span>
        </p>

        <h2 className="text-sm font-semibold text-ink">Chọn cơ sở để bắt đầu</h2>
        <div className="mt-3 max-w-2xl">
          <label htmlFor="school-search" className="sr-only">
            Tìm cơ sở theo tên, mã trường hoặc tên viết tắt
          </label>
          <input
            id="school-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tên, mã trường hoặc tên viết tắt..."
            className="w-full rounded-card border border-ink/10 bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Lọc theo mức hỗ trợ">
          <button
            type="button"
            onClick={() => setTierFilter('all')}
            aria-pressed={tierFilter === 'all'}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              tierFilter === 'all'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-ink/10 bg-surface text-muted hover:border-ink/20'
            }`}
          >
            Tất cả ({schools.length})
          </button>
          {SUPPORT_TIER_ORDER.filter((tier) => tierCounts[tier] > 0).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setTierFilter(tier)}
              aria-pressed={tierFilter === tier}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                tierFilter === tier
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-ink/10 bg-surface text-muted hover:border-ink/20'
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  tier === 'verified-calculator' ? 'bg-success' : tier === 'catalog-only' ? 'bg-ink/20' : 'bg-warning'
                }`}
              />
              {TIER_LABELS[tier]} ({tierCounts[tier]})
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <FilterSelect
            label="Loại"
            value={entityFilter}
            onChange={setEntityFilter}
            options={(Object.entries(ENTITY_FILTER_LABELS) as [Exclude<LandingEntityFilter, 'all'>, string][]).map(([value, label]) => ({
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
          <label className="flex items-center gap-1.5 text-xs text-muted">
            <span className="shrink-0">Sắp xếp</span>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as LandingSortMode)}
              className="rounded-md border border-ink/10 bg-surface px-2 py-1 text-xs text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              {(Object.entries(SORT_LABELS) as [LandingSortMode, string][]).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {filtersActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-md border border-ink/10 bg-surface px-2.5 py-1 text-xs font-medium text-muted transition hover:border-danger/30 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="mt-4 text-xs text-muted" aria-live="polite">
          {filteredSchools.length} kết quả
          {filteredSchools.length > 0 ? ` · Đang hiển thị ${visibleSchools.length}` : ''}
        </div>

        {filteredSchools.length === 0 ? (
          <div className="mt-4 rounded-card border border-ink/10 bg-surface p-5 text-center text-sm text-muted">
            <p>Không tìm thấy cơ sở phù hợp.</p>
            <p className="mt-1 text-xs">Thử tên khác, mã trường hoặc bỏ bớt bộ lọc.</p>
            {filtersActive && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSchools.map((school) => {
              const hasCtaAction = hasSchoolCtaAction(school);
              const buttonLabel = deriveSchoolCtaLabel(school);
              const supportStatus = deriveInstitutionSupportStatus(school);
              const isCatalogOnly = supportStatus === 'catalog-only';
              const badgeColor = BADGE_PALETTE[getStableBadgePaletteIndex(school.id, BADGE_PALETTE.length)];
              return (
                <li key={school.id} className={`flex flex-col rounded-card border border-ink/10 bg-surface shadow-card ${isCatalogOnly ? 'p-3' : 'p-4'}`}>
                  <div className="flex items-start gap-3">
                    <div
                      aria-hidden="true"
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold leading-none ${badgeColor}`}
                    >
                      {school.shortName.slice(0, 5)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{school.shortName}</p>
                      <p className="text-xs text-muted">{school.name}</p>
                      <p className="mt-1 text-[11px] text-muted">{getEntityLevelLabel(school)}</p>
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">
                    {school.about ?? school.summary ?? TIER_LABELS[supportStatus]}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted">
                      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${schoolStatusDotClass(school)}`} />
                      {TIER_LABELS[supportStatus]}
                    </span>
                    {hasCtaAction ? (
                      <button
                        type="button"
                        onClick={() => (school.Page ? onSelectSchool(school.id) : onOpenCompare())}
                        className="shrink-0 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      >
                        {buttonLabel}
                      </button>
                    ) : (
                      <span className="shrink-0 text-right text-xs font-medium text-muted opacity-80">
                        Chưa có dữ liệu chi tiết
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {hasMore && (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((current) => Math.min(current + VISIBLE_SCHOOL_INCREMENT, filteredSchools.length))}
              className="rounded-md border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Xem thêm {Math.min(VISIBLE_SCHOOL_INCREMENT, filteredSchools.length - visibleSchools.length)}
            </button>
          </div>
        )}

        <p className="mt-5 text-center text-xs leading-relaxed text-muted">
          Xem nguồn & phương pháp dữ liệu tuyển sinh tại{' '}
          <a
            href="https://github.com/shadowhunter67/uniscorevn/blob/main/docs/admission-research-2026.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            tài liệu dữ liệu
          </a>
          .
        </p>
      </div>
    </div>
  );
}
