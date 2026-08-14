import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Layers, ShieldCheck, XCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { isValidThptScore } from '../../core/thptProfile';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS, type SubjectId } from '../../core/subjects';
import { round2 } from '../../core/round2';
import { usshSources } from './sources';
import { checkUsshDgnlThreshold } from './eligibility';
import { usshKnowledgeGaps } from './knowledgeGaps';
import { usshAdmissionMethods } from './methods';
import { buildUsshEvaluationInput } from './applicantProfileAdapter';
import { evaluateUsshAdmission } from './evaluate';
import { calculateUsshDt3Score, describeUsshDt1Dt2Blocker } from './calculator';
import { usshPrograms } from './data/programs';
import { usshCutoffs } from './data/cutoffs';

const TRANSCRIPT_GRADES = ['grade10', 'grade11', 'grade12'] as const;
type TranscriptGrade = (typeof TRANSCRIPT_GRADES)[number];
const TRANSCRIPT_GRADE_LABELS: Record<TranscriptGrade, string> = { grade10: 'Lớp 10', grade11: 'Lớp 11', grade12: 'Lớp 12' };
const TRACK_LABELS: Record<string, string> = { standard: 'Chuẩn', 'linked-2-2': 'Liên kết 2+2', 'international-standard': 'Chuẩn quốc tế' };

interface UsshPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/**
 * USSH Admission Checker — re-audit 2026-08-13/14. ĐT3 (90%ĐGNL+10%Học bạ) tính được đầy đủ; ĐT1/
 * ĐT2 vẫn blocked bởi α1/α2 (xem `calculator.ts`). Đã có registry 54 chương trình × cutoff 2026
 * (3 track: Chuẩn/Liên kết 2+2/Chuẩn quốc tế).
 */
export function UsshPage({ onChangeSchool }: UsshPageProps) {
  const { profile, updateProfile, updateVactTotal } = useApplicantProfile();
  const [selectedCombinationId, setSelectedCombinationId] = useState('');
  const selectedCombination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === selectedCombinationId);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const selectedProgram = usshPrograms.find((p) => p.id === selectedProgramId);
  const [transcriptDrafts, setTranscriptDrafts] = useState<Partial<Record<`${TranscriptGrade}-${SubjectId}`, string>>>({});

  const [dgnlManualOverride, setDgnlManualOverride] = useState(false);
  const [dgnlInput, setDgnlInput] = useState('');
  const profileDgnl = profile.exams?.vact?.total;
  const usingProfileDgnl = !dgnlManualOverride && profileDgnl !== undefined;
  const effectiveDgnlRaw = usingProfileDgnl ? String(profileDgnl) : dgnlInput;
  const dgnlValue = effectiveDgnlRaw.trim() !== '' ? Number(effectiveDgnlRaw) : undefined;
  const dgnlResult = dgnlValue !== undefined ? checkUsshDgnlThreshold(dgnlValue) : null;

  function handleDgnlChange(value: string) {
    setDgnlInput(value);
    const parsed = value.trim() !== '' ? Number(value) : NaN;
    if (!Number.isNaN(parsed)) updateVactTotal(parsed, 'user-total-input');
  }

  function transcriptDraftKey(grade: TranscriptGrade, subjectId: SubjectId): `${TranscriptGrade}-${SubjectId}` {
    return `${grade}-${subjectId}`;
  }

  function handleTranscriptChange(grade: TranscriptGrade, subjectId: SubjectId, value: string) {
    const key = transcriptDraftKey(grade, subjectId);
    setTranscriptDrafts((prev) => ({ ...prev, [key]: value }));
    if (value.trim() === '') {
      updateProfile((current) => {
        const nextGrade = { ...current.transcript?.[grade] };
        delete nextGrade[subjectId];
        return { ...current, transcript: { ...current.transcript, [grade]: nextGrade } };
      });
      return;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed) || !isValidThptScore(parsed)) return;
    updateProfile((current) => ({
      ...current,
      transcript: { ...current.transcript, [grade]: { ...current.transcript?.[grade], [subjectId]: parsed } },
    }));
  }

  function getEffectiveTranscriptInput(grade: TranscriptGrade, subjectId: SubjectId): string {
    const key = transcriptDraftKey(grade, subjectId);
    if (Object.prototype.hasOwnProperty.call(transcriptDrafts, key)) return transcriptDrafts[key] ?? '';
    const score = profile.transcript?.[grade]?.[subjectId];
    return score !== undefined ? String(score) : '';
  }

  function getEffectiveTranscriptScore(grade: TranscriptGrade, subjectId: SubjectId): number | undefined {
    const key = transcriptDraftKey(grade, subjectId);
    if (Object.prototype.hasOwnProperty.call(transcriptDrafts, key)) {
      const draft = transcriptDrafts[key];
      if (draft === undefined || draft.trim() === '') return undefined;
      const parsed = Number(draft);
      return !Number.isNaN(parsed) && isValidThptScore(parsed) ? parsed : undefined;
    }
    return profile.transcript?.[grade]?.[subjectId];
  }

  const transcriptTotal30 = selectedCombination
    ? selectedCombination.subjects.reduce<number | undefined>((total, subjectId) => {
        if (total === undefined) return undefined;
        const g10 = getEffectiveTranscriptScore('grade10', subjectId);
        const g11 = getEffectiveTranscriptScore('grade11', subjectId);
        const g12 = getEffectiveTranscriptScore('grade12', subjectId);
        if (g10 === undefined || g11 === undefined || g12 === undefined) return undefined;
        return round2(total + (g10 + g11 + g12) / 3);
      }, 0)
    : undefined;

  const dt3Result = dgnlValue !== undefined && transcriptTotal30 !== undefined ? calculateUsshDt3Score({ dgnlRaw1200: dgnlValue, transcriptTotal30 }) : null;
  const dt1Blocker = describeUsshDt1Dt2Blocker('DT1');
  const dt2Blocker = describeUsshDt1Dt2Blocker('DT2');
  const selectedProgramCutoffs = selectedProgram ? usshCutoffs.filter((c) => c.programId === selectedProgram.id) : [];

  const evaluationInput = buildUsshEvaluationInput(
    profile,
    selectedCombination ? { combinationId: selectedCombination.id, subjects: selectedCombination.subjects } : undefined
  );
  const evaluation = evaluateUsshAdmission(profile, selectedCombination ? { subjectContext: { combinationId: selectedCombination.id, subjects: selectedCombination.subjects } } : {});

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'USSH', name: 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/ussh`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ: {usshAdmissionMethods[0].name}</h2>
          <MethodCapabilitySummary method={usshAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            USSH xét theo 3 đối tượng ĐT1/ĐT2/ĐT3. UniscoreVN đã tính được <strong>ĐT3</strong> (90%ĐGNL+10%Học bạ) đầy
            đủ — ĐT1/ĐT2 vẫn thiếu do hệ số α1 (chưa rõ vai trò trong công thức) và α2 (độ lệch tổ hợp riêng ngành,
            chưa công bố bảng giá trị).
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">UniscoreVN chưa tính được điểm xét tuyển CUỐI CÙNG cho USSH</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {usshKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="dt3-calculator" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Tính ĐT3 + xem điểm chuẩn 2026</h2>
          </div>
          <p className="mt-1 text-sm text-muted">ĐT3 = 0.90×(ĐGNL×100/1200) + 0.10×(Học bạ×100/30) — CHƯA gồm Điểm cộng/Điểm ưu tiên.</p>

          <div className="mt-4 max-w-sm">
            <label htmlFor="ussh-program-select" className="text-xs font-medium text-ink">
              Chương trình xét tuyển (54 chương trình 2026)
            </label>
            <select
              id="ussh-program-select"
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="">Chưa chọn chương trình</option>
              {usshPrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.code} — {program.name} ({TRACK_LABELS[program.track]})
                </option>
              ))}
            </select>
          </div>

          {selectedProgram && selectedProgramCutoffs.length > 0 && (
            <div className="mt-3 rounded-md bg-surface p-3 text-xs text-ink">
              <p className="font-medium">Điểm chuẩn 2026 — {selectedProgram.code} ({TRACK_LABELS[selectedProgram.track]})</p>
              <div className="mt-1.5 flex flex-wrap gap-3">
                {(['DT1', 'DT2', 'DT3'] as const).map((type) => (
                  <span key={type}>
                    {type}: <strong>{selectedProgramCutoffs.find((c) => c.applicantTypeId === type)?.score.toFixed(2)}</strong>/100
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedCombination ? (
            <div className="mt-5">
              <p className="text-xs font-medium text-ink">Điểm học bạ theo tổ hợp {selectedCombination.id} (thang 10 mỗi năm)</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[420px] border-separate border-spacing-1 text-xs">
                  <thead>
                    <tr>
                      <th className="text-left text-muted">Môn</th>
                      {TRANSCRIPT_GRADES.map((grade) => (
                        <th key={grade} className="text-left text-muted">
                          {TRANSCRIPT_GRADE_LABELS[grade]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCombination.subjects.map((subjectId) => (
                      <tr key={subjectId}>
                        <td className="py-1 font-medium text-ink">{SUBJECT_LABELS[subjectId]}</td>
                        {TRANSCRIPT_GRADES.map((grade) => (
                          <td key={grade}>
                            <input
                              type="number"
                              inputMode="decimal"
                              min={0}
                              max={10}
                              value={getEffectiveTranscriptInput(grade, subjectId)}
                              onChange={(event) => handleTranscriptChange(grade, subjectId, event.target.value)}
                              placeholder="0-10"
                              aria-label={`Học bạ ${TRANSCRIPT_GRADE_LABELS[grade]} môn ${SUBJECT_LABELS[subjectId]}`}
                              className="w-full rounded-md border border-ink/10 bg-surface px-2 py-1.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-xs text-muted">Chọn tổ hợp ở mục "Kiểm tra ngưỡng đầu vào" bên dưới để nhập điểm học bạ.</p>
          )}

          {dt3Result ? (
            <div className="mt-5 rounded-md border border-accent/30 bg-accent/10 p-4">
              <p className="text-sm text-ink">
                ĐT3 (trước Điểm cộng/Điểm ưu tiên): <strong className="text-primary">{dt3Result.scoreBeforeBonusAndPriority.toFixed(2)}</strong>
                <span className="text-muted"> / 100</span>
              </p>
              <p className="mt-1 text-xs text-muted">
                ĐGNL: {dt3Result.dgnlComponent.toFixed(2)} · Học bạ: {dt3Result.transcriptComponent.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted">Đây CHƯA phải điểm xét tuyển cuối cùng — còn thiếu Điểm cộng và Điểm ưu tiên (trường chưa công bố).</p>
            </div>
          ) : (
            <p className="mt-5 text-xs text-muted">Cần điểm ĐGNL + điểm học bạ (theo tổ hợp) để tính ĐT3.</p>
          )}

          <details className="mt-4 rounded-md border border-ink/10 bg-surface px-3 py-2">
            <summary className="cursor-pointer text-xs font-medium text-ink">Vì sao ĐT1/ĐT2 chưa tính được?</summary>
            <div className="mt-2 space-y-2 text-xs text-muted">
              <p>
                <strong className="text-ink">ĐT1</strong> ({dt1Blocker.knownWeights}): {dt1Blocker.reason}
              </p>
              <p>
                <strong className="text-ink">ĐT2</strong> ({dt2Blocker.knownWeights}): {dt2Blocker.reason}
              </p>
            </div>
          </details>
        </section>

        <section id="threshold" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Kiểm tra ngưỡng đầu vào</h2>
          </div>

          <div className="mt-4 max-w-xs">
            <label htmlFor="ussh-dgnl-input" className="text-xs font-medium text-ink">
              Điểm ĐGNL ĐHQG-HCM (thang 1200)
            </label>
            <input
              id="ussh-dgnl-input"
              type="number"
              inputMode="decimal"
              min={0}
              max={1200}
              value={effectiveDgnlRaw}
              onChange={(e) => {
                handleDgnlChange(e.target.value);
                setDgnlManualOverride(true);
              }}
              placeholder="0 - 1200"
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
            <SharedProfileNotice className="mt-1.5" />
            {dgnlResult && (
              <p className={`mt-2 flex items-start gap-1.5 text-sm ${dgnlResult.pass ? 'text-success' : 'text-muted'}`}>
                {dgnlResult.pass ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> : <XCircle size={16} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />}
                <span>
                  {dgnlResult.requiredText} {dgnlResult.pass ? '— đạt' : '— chưa đạt'}
                </span>
              </p>
            )}
          </div>

          <div className="mt-5 max-w-xs">
            <label htmlFor="ussh-combination-select" className="text-xs font-medium text-ink">
              Tổ hợp THPT (chỉ tổ hợp phổ biến)
            </label>
            <select
              id="ussh-combination-select"
              value={selectedCombinationId}
              onChange={(e) => setSelectedCombinationId(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="">Chưa chọn tổ hợp</option>
              {COMMON_SUBJECT_COMBINATIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.subjects.map((s) => SUBJECT_LABELS[s]).join(', ')}
                </option>
              ))}
            </select>
          </div>

          {selectedCombination && (
            <div className="mt-3 rounded-md bg-surface p-3 text-sm text-ink">
              <p>THPT tổ hợp: {evaluationInput.thptRawTotal30 !== undefined ? `${evaluationInput.thptRawTotal30.toFixed(2)}/30` : 'Thiếu điểm môn — nhập ở trang HCMUT/UEL để dùng lại tại đây'}</p>
              <p className="mt-1">Học bạ tổ hợp: {evaluationInput.transcriptTotal30 !== undefined ? `${evaluationInput.transcriptTotal30.toFixed(2)}/30` : 'Thiếu điểm học bạ 3 năm'}</p>
            </div>
          )}

          {evaluation.eligibility && evaluation.eligibility.status !== 'unknown' && (
            <div className="mt-4 rounded-md bg-surface-soft p-3 text-xs text-muted">
              {evaluation.eligibility.reasons.map((reason, i) => (
                <p key={i}>{reason}</p>
              ))}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {usshSources.map((source) => (
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
