import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { isValidThptScore } from '../../core/thptProfile';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS, type SubjectId } from '../../core/subjects';
import { round2 } from '../../core/round2';
import { hcmusSources } from './sources';
import { checkHcmusNuclearEngineeringCondition, checkHcmusThptThreshold } from './eligibility';
import { hcmusKnowledgeGaps } from './knowledgeGaps';
import { hcmusAdmissionMethods } from './methods';

interface HcmusPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/**
 * HCMUS Admission Checker — nguồn 2026-08-13 (docs/CHANGELOG.md). Ngưỡng THPT tổ hợp (≥15/30) đọc
 * được dạng text nên implement thật; ngưỡng ĐGNL nằm trong ảnh (unparsed) nên KHÔNG hiện số —
 * chỉ nói rõ chưa đọc được. Điều kiện ngành Kỹ thuật hạt nhân (Toán, Lý ≥7.5) đọc được nên có
 * checker riêng. KHÔNG có exact calculator — trường chưa công bố trọng số/công thức kết hợp.
 */
export function HcmusPage({ onChangeSchool }: HcmusPageProps) {
  const { profile, updateProfile } = useApplicantProfile();
  const [selectedCombinationId, setSelectedCombinationId] = useState('');
  const [thptSubjectDrafts, setThptSubjectDrafts] = useState<Partial<Record<SubjectId, string>>>({});
  const selectedCombination = COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === selectedCombinationId);

  function handleThptSubjectChange(subjectId: SubjectId, value: string) {
    setThptSubjectDrafts((prev) => ({ ...prev, [subjectId]: value }));
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
    updateProfile((current) => ({
      ...current,
      thpt: { scores: { ...current.thpt?.scores, [subjectId]: parsed } },
    }));
  }

  function getEffectiveThptSubjectScore(subjectId: SubjectId): number | undefined {
    if (Object.prototype.hasOwnProperty.call(thptSubjectDrafts, subjectId)) {
      const draft = thptSubjectDrafts[subjectId];
      if (draft === undefined || draft.trim() === '') return undefined;
      const parsed = Number(draft);
      return !Number.isNaN(parsed) && isValidThptScore(parsed) ? parsed : undefined;
    }
    return profile.thpt?.scores?.[subjectId];
  }

  function getEffectiveThptSubjectInput(subjectId: SubjectId): string {
    if (Object.prototype.hasOwnProperty.call(thptSubjectDrafts, subjectId)) return thptSubjectDrafts[subjectId] ?? '';
    const score = profile.thpt?.scores?.[subjectId];
    return score !== undefined ? String(score) : '';
  }

  const thptRawTotal = selectedCombination
    ? selectedCombination.subjects.reduce<number | undefined>((total, subjectId) => {
        const score = getEffectiveThptSubjectScore(subjectId);
        return total === undefined || score === undefined ? undefined : round2(total + score);
      }, 0)
    : undefined;
  const missingSubjects = selectedCombination?.subjects.filter((subjectId) => getEffectiveThptSubjectScore(subjectId) === undefined) ?? [];
  const thptResult = thptRawTotal !== undefined ? checkHcmusThptThreshold(thptRawTotal) : null;

  const mathScore = profile.thpt?.scores?.math;
  const physicsScore = profile.thpt?.scores?.physics;
  const [checkNuclear, setCheckNuclear] = useState(false);
  const nuclearResult = mathScore !== undefined && physicsScore !== undefined ? checkHcmusNuclearEngineeringCondition(mathScore, physicsScore) : null;

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'HCMUS', name: 'Trường Đại học Khoa học Tự nhiên – ĐHQG TP.HCM', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/hcmus`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ: {hcmusAdmissionMethods[0].name}</h2>
          <MethodCapabilitySummary method={hcmusAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            Phương thức 2 xét kết hợp điểm thi tốt nghiệp THPT 2026 (hoặc ĐGNL ĐHQG-HCM) với điểm học bạ 3 năm. Trường
            chưa công bố công thức/trọng số kết hợp dạng text — UniscoreVN chỉ kiểm tra được ngưỡng đầu vào THPT.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">UniscoreVN chưa tính được điểm xét tuyển cho HCMUS</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {hcmusKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
            <p className="mt-2 leading-relaxed">
              Trong lúc chờ, bạn có thể kiểm tra ngưỡng đầu vào THPT (đọc được dạng text) và điều kiện riêng ngành Kỹ
              thuật hạt nhân bên dưới.
            </p>
          </div>
        </section>

        <section id="threshold" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Kiểm tra ngưỡng đầu vào THPT</h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Chỉ áp dụng tổ hợp phổ biến (A00/A01/B00/D01) — chưa map đủ tổ hợp cho toàn bộ 39 ngành/nhóm ngành.
          </p>
          <div className="mt-3 max-w-xs">
            <label htmlFor="hcmus-combination-select" className="text-xs font-medium text-ink">
              Tổ hợp xét tuyển
            </label>
            <select
              id="hcmus-combination-select"
              value={selectedCombinationId}
              onChange={(event) => {
                setSelectedCombinationId(event.target.value);
                setThptSubjectDrafts({});
              }}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="">Chưa chọn tổ hợp</option>
              {COMMON_SUBJECT_COMBINATIONS.map((combination) => (
                <option key={combination.id} value={combination.id}>
                  {combination.id} — {combination.subjects.map((subjectId) => SUBJECT_LABELS[subjectId]).join(', ')}
                </option>
              ))}
            </select>
          </div>

          {selectedCombination && (
            <div className="mt-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {selectedCombination.subjects.map((subjectId) => (
                  <label key={subjectId} className="block rounded-lg border border-ink/10 bg-surface p-3">
                    <span className="text-xs font-medium text-ink">{SUBJECT_LABELS[subjectId]}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={10}
                      value={getEffectiveThptSubjectInput(subjectId)}
                      onChange={(event) => handleThptSubjectChange(subjectId, event.target.value)}
                      placeholder="0 - 10"
                      aria-label={`Điểm thi THPT môn ${SUBJECT_LABELS[subjectId]}`}
                      className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                    />
                  </label>
                ))}
              </div>
              <SharedProfileNotice className="mt-2" />
              {missingSubjects.length > 0 ? (
                <p className="mt-2 text-xs text-muted">
                  Còn thiếu {missingSubjects.map((subjectId) => SUBJECT_LABELS[subjectId]).join(', ')}.
                </p>
              ) : (
                thptResult && (
                  <p className={`mt-3 flex items-start gap-1.5 text-sm ${thptResult.pass ? 'text-success' : 'text-muted'}`}>
                    {thptResult.pass ? (
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <XCircle size={16} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
                    )}
                    <span>
                      Tổng: <strong>{thptRawTotal?.toFixed(2)}</strong>/30 — {thptResult.requiredText}
                      {thptResult.pass ? ' — đạt' : ' — chưa đạt'}
                    </span>
                  </p>
                )
              )}
            </div>
          )}

          <label className="mt-5 flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={checkNuclear} onChange={(e) => setCheckNuclear(e.target.checked)} />
            Tôi muốn kiểm tra điều kiện riêng ngành Kỹ thuật hạt nhân
          </label>
          {checkNuclear &&
            (nuclearResult ? (
              <p className={`mt-2 flex items-start gap-1.5 text-sm ${nuclearResult.pass ? 'text-success' : 'text-muted'}`}>
                {nuclearResult.pass ? (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                ) : (
                  <XCircle size={16} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
                )}
                <span>
                  {nuclearResult.requiredText} {nuclearResult.pass ? '— đạt' : '— chưa đạt'}
                </span>
              </p>
            ) : (
              <p className="mt-2 text-xs text-muted">Cần điểm Toán và Vật lý (đã nhập trong tổ hợp có 2 môn này, hoặc chọn tổ hợp A00/A01).</p>
            ))}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {hcmusSources.map((source) => (
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
