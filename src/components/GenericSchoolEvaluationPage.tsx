import { useMemo } from 'react';
import type { SchoolModule } from '../core/schoolModule';
import { useApplicantProfile } from '../core/applicantProfileContextCore';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS } from '../core/subjects';
import { SharedProfileEditor } from './SharedProfileEditor';
import { evaluateSchool, type GenericSchoolEvaluationResult } from '../evaluation/schoolEvaluation';
import { deriveInstitutionSupportStatus, SUPPORT_STATUS_LABELS } from '../data/institutionCoverage';

interface GenericSchoolEvaluationPageProps {
  school: SchoolModule;
  onChangeSchool: () => void;
  onOpenCompare: (schoolId: string) => void;
}

function buildGenericContext(preferredCombinationId: string | undefined) {
  const combination = COMMON_SUBJECT_COMBINATIONS.find((item) => item.id === preferredCombinationId);
  return combination ? { subjectContext: { combinationId: combination.id, subjects: combination.subjects } } : {};
}

function statusLabel(result: GenericSchoolEvaluationResult): string {
  switch (result.status) {
    case 'calculated':
      return 'Đã tính được điểm';
    case 'partial':
      return 'Tính được một phần';
    case 'eligible':
      return 'Đủ điều kiện trong phạm vi đã biết';
    case 'ineligible':
      return 'Không đủ điều kiện';
    case 'missing-input':
      return 'Cần bổ sung dữ liệu';
    case 'unsupported':
      return 'Chưa hỗ trợ tính';
  }
}

function resultTone(result: GenericSchoolEvaluationResult): string {
  if (result.status === 'calculated' || result.status === 'eligible') return 'border-success/25 bg-success/5';
  if (result.status === 'ineligible') return 'border-danger/25 bg-danger/5';
  if (result.status === 'partial' || result.status === 'missing-input') return 'border-warning/25 bg-warning/5';
  return 'border-ink/10 bg-surface';
}

function renderScore(result: GenericSchoolEvaluationResult) {
  if (result.score === undefined || result.scoreScale === undefined) return null;
  return (
    <p className="mt-2 text-2xl font-semibold text-ink">
      {result.score.toFixed(2)}
      <span className="text-base font-medium text-muted">/{result.scoreScale}</span>
    </p>
  );
}

export function GenericSchoolEvaluationPage({ school, onChangeSchool, onOpenCompare }: GenericSchoolEvaluationPageProps) {
  const { profile, updateProfile, updateVactTotal } = useApplicantProfile();
  const context = useMemo(() => buildGenericContext(profile.preferredCombinationId), [profile.preferredCombinationId]);
  const result = useMemo(() => evaluateSchool(profile, school.id, { context }), [profile, school.id, context]);
  const supportStatus = deriveInstitutionSupportStatus(school);
  const selectedCombination = COMMON_SUBJECT_COMBINATIONS.find((item) => item.id === profile.preferredCombinationId);
  const sources = school.catalogSources ?? [];
  const canEvaluate = supportStatus === 'verified-calculator' || supportStatus === 'partial-calculator' || supportStatus === 'eligibility-only';

  return (
    <div className="min-h-svh bg-bg">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <button type="button" onClick={onChangeSchool} className="text-xs font-medium text-accent underline-offset-2 hover:underline">
          Về trang chủ
        </button>

        <header className="mt-5 border-b border-ink/10 pb-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{SUPPORT_STATUS_LABELS[supportStatus]}</p>
          <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{school.name}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{school.summary ?? school.about ?? 'Thông tin tuyển sinh đang được chuẩn hóa.'}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onOpenCompare(school.id)}
              className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              So sánh trường này
            </button>
          </div>
        </header>

        <section className="mt-5 rounded-card border border-ink/10 bg-surface p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-ink">Hồ sơ dùng chung</h2>
              <p className="mt-1 text-xs text-muted">
                {selectedCombination
                  ? `Tổ hợp đang dùng: ${selectedCombination.id} (${selectedCombination.subjects.map((subjectId) => SUBJECT_LABELS[subjectId]).join(' - ')})`
                  : 'Chưa chọn tổ hợp môn dùng chung.'}
              </p>
            </div>
          </div>
          <details className="mt-3 rounded-md border border-ink/10 bg-surface-soft px-3 py-2">
            <summary className="cursor-pointer text-xs font-medium text-ink">Nhập / chỉnh sửa điểm</summary>
            <SharedProfileEditor profile={profile} updateProfile={updateProfile} updateVactTotal={updateVactTotal} />
          </details>
        </section>

        <section className={`mt-5 rounded-card border p-4 ${resultTone(result)}`} aria-live="polite">
          <h2 className="text-sm font-semibold text-ink">{canEvaluate ? statusLabel(result) : 'Thông tin tuyển sinh'}</h2>
          {canEvaluate ? (
            <>
              {renderScore(result)}
              {result.missingInputs.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-ink">Cần bổ sung</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-muted">
                    {result.missingInputs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.notes.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-ink">Phạm vi hỗ trợ</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-muted">
                    {result.notes.slice(0, 6).map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">UniScoreVN đã có nguồn tuyển sinh công khai cho trường này, nhưng chưa đủ dữ liệu để tính điểm hoặc kết luận điều kiện.</p>
          )}
        </section>

        {sources.length > 0 && (
          <section className="mt-5 rounded-card border border-ink/10 bg-surface p-4">
            <h2 className="text-sm font-semibold text-ink">Nguồn chính thức</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {sources.map((source) => (
                <li key={`${source.title}-${source.url}`}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-2 hover:underline">
                    {source.title}
                  </a>
                  {source.checkedAt ? <span className="text-xs text-muted"> · kiểm tra {source.checkedAt}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
