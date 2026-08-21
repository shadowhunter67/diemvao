import { useState } from 'react';
import { AlertTriangle, Calculator, CheckCircle2, XCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { isValidThptScore } from '../../core/thptProfile';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS, type SubjectId } from '../../core/subjects';
import { umpSources } from './sources';
import { umpAdmissionMethods } from './methods';
import { umpKnowledgeGaps } from './knowledgeGaps';
import { evaluateUmpAdmission } from './evaluate';
import { umpPrograms, type UmpCombinationId } from './programs';
import { UMP_PRIORITY_REGION_POINTS_30, UMP_PRIORITY_CATEGORY_POINTS_30 } from './priority';

interface UmpPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;
const UMP_COMBINATION_IDS: readonly UmpCombinationId[] = ['A00', 'B00', 'B08', 'D01', 'D07'];

/** UMP Page — batch 2026-08-21. Phương thức duy nhất (xét kết quả thi TN THPT 2026), exact
 * calculator KHÔNG điều kiện (khác nhiều trường khác — công thức điểm khuyến khích cũng verified
 * đầy đủ). Điều kiện giới tính riêng ngành Hộ sinh và cutoffs 2026 chưa có — hiển thị trung thực. */
export function UmpPage({ onChangeSchool }: UmpPageProps) {
  const { profile, updateProfile } = useApplicantProfile();
  const [combinationId, setCombinationId] = useState<UmpCombinationId | ''>('');
  const combination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === combinationId);
  const [programId, setProgramId] = useState('');
  const selectedProgram = umpPrograms.find((p) => p.id === programId);

  function handleThptChange(subjectId: SubjectId, value: string) {
    if (value.trim() === '') {
      updateProfile((current) => {
        const nextScores = { ...current.thpt?.scores };
        delete nextScores[subjectId];
        return { ...current, thpt: { scores: nextScores } };
      });
      return;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed) || !isValidThptScore(parsed)) return;
    updateProfile((current) => ({ ...current, thpt: { scores: { ...current.thpt?.scores, [subjectId]: parsed } } }));
  }

  const region = profile.priority?.region ?? '';
  const category = profile.priority?.category ?? '';

  const evaluation = evaluateUmpAdmission(profile, {
    subjectContext: combination ? { combinationId: combination.id, subjects: combination.subjects } : undefined,
    selectedProgramId: programId || undefined,
  });
  const academicStep = evaluation.explanation.find((s) => s.id === 'ump-academic-score');
  const priorityStep = evaluation.explanation.find((s) => s.id === 'ump-priority');
  const bonusStep = evaluation.explanation.find((s) => s.id === 'ump-bonus');

  const [ielts, setIelts] = useState('');
  const [toefl, setToefl] = useState('');
  const [sat, setSat] = useState('');

  function updateCertificate(field: 'ielts' | 'toeflIbt' | 'sat', value: string) {
    if (value.trim() === '') {
      updateProfile((current) => {
        const next = { ...current.certificates };
        delete next[field];
        return { ...current, certificates: next };
      });
      return;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    updateProfile((current) => ({ ...current, certificates: { ...current.certificates, [field]: parsed } }));
  }

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'UMP', name: 'Trường Đại học Y Dược Thành phố Hồ Chí Minh', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/ump`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ: {umpAdmissionMethods[0].name}</h2>
          <MethodCapabilitySummary method={umpAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            <span className="font-mono text-ink">Điểm xét tuyển = Tổng điểm 3 môn + Điểm ưu tiên + Điểm khuyến khích</span>{' '}
            (thang 30, không nhân hệ số môn nào). Điểm khuyến khích = 0,9 × (điểm/thang tối đa) IELTS/TOEFL
            iBT/SAT, cộng dồn, kẹp trần 1,50.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Phạm vi chưa tính được</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {umpKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="calculator" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Tính Điểm xét tuyển</h2>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <div>
              <label htmlFor="ump-combination" className="text-xs font-medium text-ink">
                Tổ hợp xét tuyển
              </label>
              <select
                id="ump-combination"
                value={combinationId}
                onChange={(e) => setCombinationId(e.target.value as UmpCombinationId | '')}
                className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                <option value="">Chưa chọn tổ hợp</option>
                {UMP_COMBINATION_IDS.map((id) => {
                  const c = COMMON_SUBJECT_COMBINATIONS.find((x) => x.id === id);
                  return (
                    <option key={id} value={id}>
                      {id} — {c?.subjects.map((s) => SUBJECT_LABELS[s]).join(', ')}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="ump-program" className="text-xs font-medium text-ink">
                Ngành xét tuyển (để tra ngưỡng đầu vào)
              </label>
              <select
                id="ump-program"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="mt-1 w-full min-w-[240px] rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                <option value="">Chưa chọn ngành</option>
                {umpPrograms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.name} (sàn {p.threshold30}/30)
                  </option>
                ))}
              </select>
            </div>
          </div>
          {selectedProgram?.femaleOnly && (
            <p className="mt-2 text-xs text-warning">Ngành này chỉ tuyển Nữ (điều kiện UniscoreVN chưa tự kiểm tra được).</p>
          )}
          <SharedProfileNotice className="mt-2" />

          {combination && (
            <div className="mt-4 flex flex-wrap gap-3 rounded-xl bg-surface p-4">
              {combination.subjects.map((subjectId) => (
                <div key={subjectId}>
                  <label htmlFor={`ump-thpt-${subjectId}`} className="text-xs font-medium text-ink">
                    {SUBJECT_LABELS[subjectId]}
                  </label>
                  <input
                    id={`ump-thpt-${subjectId}`}
                    type="number"
                    min={0}
                    max={10}
                    step={0.01}
                    value={profile.thpt?.scores?.[subjectId] ?? ''}
                    onChange={(e) => handleThptChange(subjectId, e.target.value)}
                    className="mt-1 w-20 rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                  />
                </div>
              ))}
            </div>
          )}

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm khuyến khích (chứng chỉ, tối đa 1,50)</legend>
            <div className="mt-1 flex flex-wrap gap-3">
              <div>
                <label htmlFor="ump-ielts" className="text-xs font-medium text-ink">
                  IELTS (≥6.0)
                </label>
                <input
                  id="ump-ielts"
                  type="number"
                  min={0}
                  max={9}
                  step={0.5}
                  value={ielts !== '' ? ielts : profile.certificates?.ielts ?? ''}
                  onChange={(e) => {
                    setIelts(e.target.value);
                    updateCertificate('ielts', e.target.value);
                  }}
                  className="mt-1 w-20 rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                />
              </div>
              <div>
                <label htmlFor="ump-toefl" className="text-xs font-medium text-ink">
                  TOEFL iBT (≥80)
                </label>
                <input
                  id="ump-toefl"
                  type="number"
                  min={0}
                  max={120}
                  value={toefl !== '' ? toefl : profile.certificates?.toeflIbt ?? ''}
                  onChange={(e) => {
                    setToefl(e.target.value);
                    updateCertificate('toeflIbt', e.target.value);
                  }}
                  className="mt-1 w-20 rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                />
              </div>
              <div>
                <label htmlFor="ump-sat" className="text-xs font-medium text-ink">
                  SAT (≥1340)
                </label>
                <input
                  id="ump-sat"
                  type="number"
                  min={0}
                  max={1600}
                  value={sat !== '' ? sat : profile.certificates?.sat ?? ''}
                  onChange={(e) => {
                    setSat(e.target.value);
                    updateCertificate('sat', e.target.value);
                  }}
                  className="mt-1 w-20 rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                />
              </div>
            </div>
            <SharedProfileNotice className="mt-2" />
          </fieldset>

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm ưu tiên khu vực/đối tượng</legend>
            <div className="mt-1 flex flex-wrap gap-3">
              <div>
                <label htmlFor="ump-priority-region" className="text-xs font-medium text-ink">
                  Khu vực
                </label>
                <select
                  id="ump-priority-region"
                  value={region}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, region: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(UMP_PRIORITY_REGION_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ump-priority-category" className="text-xs font-medium text-ink">
                  Đối tượng ưu tiên
                </label>
                <select
                  id="ump-priority-category"
                  value={category}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, category: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(UMP_PRIORITY_CATEGORY_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <SharedProfileNotice className="mt-2" />
          </fieldset>

          {academicStep && priorityStep && evaluation.score && (
            <div className="mt-5 rounded-2xl bg-surface p-4">
              <p className="text-sm text-ink">
                Tổng điểm 3 môn: <strong className="text-ink">{academicStep.output?.toFixed(2)}</strong> / 30
              </p>
              <p className="mt-1 text-sm text-ink">
                Điểm ưu tiên: <strong className="text-ink">{priorityStep.output?.toFixed(2)}</strong>
                {priorityStep.formula?.startsWith('[') ? ' (đã giảm)' : ''}
              </p>
              {bonusStep && (
                <p className="mt-1 text-sm text-ink">
                  Điểm khuyến khích: <strong className="text-ink">{bonusStep.output?.toFixed(2)}</strong>
                </p>
              )}
              <p className="mt-2 text-base text-ink">
                Điểm xét tuyển: <strong className="text-xl text-primary">{evaluation.score.value.toFixed(2)}</strong> / 30
              </p>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-ink">
                {evaluation.eligibility?.status === 'eligible' ? (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                ) : evaluation.eligibility?.status === 'ineligible' ? (
                  <XCircle size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
                ) : null}
                <span>{evaluation.eligibility?.reasons.join(' ')}</span>
              </p>
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {umpSources.map((source) => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-2 hover:underline">
                  {source.title}
                </a>
                <span className="text-muted"> — {source.publisher} </span>
                <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-muted">{verificationLabel(source.verification)}</span>
              </li>
            ))}
          </ul>
        </section>

        <Footer />
      </div>
    </div>
  );
}
