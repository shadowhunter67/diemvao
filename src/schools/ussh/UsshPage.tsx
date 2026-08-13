import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS } from '../../core/subjects';
import { usshSources } from './sources';
import { checkUsshDgnlThreshold } from './eligibility';
import { usshKnowledgeGaps } from './knowledgeGaps';
import { usshAdmissionMethods } from './methods';
import { buildUsshEvaluationInput } from './applicantProfileAdapter';
import { evaluateUsshAdmission } from './evaluate';

interface UsshPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/**
 * USSH Admission Checker — nguồn 2026-08-13. 3 ngưỡng riêng biệt (THPT/học bạ/ĐGNL) đọc được text
 * — KHÔNG có exact/partial calculator vì hệ số α1/α2 kết hợp thành điểm tổng hợp trường chưa công
 * bố giá trị (chỉ nói nguyên tắc xây dựng).
 */
export function UsshPage({ onChangeSchool }: UsshPageProps) {
  const { profile, updateVactTotal } = useApplicantProfile();
  const [selectedCombinationId, setSelectedCombinationId] = useState('');
  const selectedCombination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === selectedCombinationId);

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
            USSH xét kết hợp THPT/học bạ và ĐGNL qua hệ số α1 (quy đổi ĐGNL↔THPT) và α2 (độ lệch giữa tổ hợp) theo
            ngành — trường chưa công bố giá trị cụ thể nên UniscoreVN chỉ kiểm tra được 3 ngưỡng riêng biệt.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">UniscoreVN chưa tính được điểm xét tuyển tổng hợp cho USSH</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {usshKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
          </div>
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
