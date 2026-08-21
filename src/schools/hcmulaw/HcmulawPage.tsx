import { useState } from 'react';
import { AlertTriangle, Calculator, CheckCircle2, XCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { isValidThptScore } from '../../core/thptProfile';
import { SUBJECT_LABELS, type SubjectId } from '../../core/subjects';
import type { AdmissionEvaluation } from '../../core/admissionEvaluation';
import { hcmulawSources } from './sources';
import { hcmulawAdmissionMethods } from './methods';
import { hcmulawKnowledgeGaps } from './knowledgeGaps';
import { evaluateHcmulawThpt5Admission, evaluateHcmulawVsat4Admission } from './evaluate';
import { hcmulawPrograms, findHcmulawProgram, type HcmulawProgramId } from './programs';
import { HCMULAW_PRIORITY_REGION_POINTS_30, HCMULAW_PRIORITY_CATEGORY_POINTS_30 } from './priority';

interface HcmulawPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/** HCMULAW Page — batch 2026-08-21. Chỉ 2/4 phương thức có Page tính điểm (PT5 thi THPT / PT4
 * V-SAT) — exact. PT2/PT3 (học bạ, cần TB 6 học kỳ) hiển thị trung thực là chưa tính được. */
export function HcmulawPage({ onChangeSchool }: HcmulawPageProps) {
  const { profile, updateProfile } = useApplicantProfile();
  const [programId, setProgramId] = useState<HcmulawProgramId | ''>('');
  const program = findHcmulawProgram(programId || undefined);
  const [combinationCode, setCombinationCode] = useState('');
  const combination = program?.combinations.find((c) => c.code === combinationCode);

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

  const thpt5Evaluation = evaluateHcmulawThpt5Admission(profile, { programId: programId || undefined, combinationCode: combinationCode || undefined });

  const [vsatScores, setVsatScores] = useState<Partial<Record<SubjectId, string>>>({});
  const vsat4Evaluation = evaluateHcmulawVsat4Admission(profile, {
    programId: programId || undefined,
    combinationCode: combinationCode || undefined,
    vsatScoresBySubject: combination
      ? Object.fromEntries(
          combination.subjects
            .map((s) => [s, vsatScores[s] !== undefined && vsatScores[s] !== '' ? Number(vsatScores[s]) : undefined])
            .filter(([, v]) => v !== undefined)
        )
      : undefined,
  });

  function renderResult(evaluation: AdmissionEvaluation, label: string) {
    if (evaluation.score) {
      return (
        <div className="mt-4 rounded-2xl bg-surface p-4">
          <p className="text-base text-ink">
            {label}: <strong className="text-xl text-primary">{evaluation.score.value.toFixed(2)}</strong> / 30
          </p>
          <p className="mt-2 flex items-start gap-1.5 text-sm text-ink">
            {evaluation.eligibility?.status === 'ineligible' ? (
              <XCircle size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
            ) : (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            )}
            <span>{evaluation.eligibility?.reasons.join(' ')}</span>
          </p>
        </div>
      );
    }
    if (evaluation.missingInputs.length > 0 || evaluation.missingRules.length > 0) {
      return (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-warning/10 p-4 text-sm text-warning">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{[...evaluation.missingInputs, ...evaluation.missingRules].join(' ')}</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'HCMULAW', name: 'Trường Đại học Luật Thành phố Hồ Chí Minh', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/hcmulaw`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ: {hcmulawAdmissionMethods[3].name} · {hcmulawAdmissionMethods[2].name}</h2>
          <MethodCapabilitySummary method={hcmulawAdmissionMethods[3]} />
          <p className="mt-4 text-sm text-muted">
            <span className="font-mono text-ink">Điểm xét tuyển = Điểm tổ hợp môn + Điểm ưu tiên</span> (thang 30,
            không có điểm cộng ở cả 2 phương thức). PT5 dùng tổng thô điểm thi 3 môn; PT4 quy đổi RIÊNG TỪNG MÔN từ
            điểm V-SAT sang thang thi TN THPT qua bảng bách phân vị chính thức, rồi cộng lại.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Phạm vi chưa tính được</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {hcmulawKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="calculator" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Chọn ngành và tổ hợp</h2>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <div>
              <label htmlFor="hcmulaw-program" className="text-xs font-medium text-ink">
                Ngành xét tuyển
              </label>
              <select
                id="hcmulaw-program"
                value={programId}
                onChange={(e) => {
                  setProgramId(e.target.value as HcmulawProgramId | '');
                  setCombinationCode('');
                }}
                className="mt-1 w-full min-w-[260px] rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                <option value="">Chưa chọn ngành</option>
                {hcmulawPrograms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.name} (sàn {p.threshold30}/30)
                  </option>
                ))}
              </select>
            </div>
            {program && (
              <div>
                <label htmlFor="hcmulaw-combination" className="text-xs font-medium text-ink">
                  Tổ hợp 3 môn
                </label>
                <select
                  id="hcmulaw-combination"
                  value={combinationCode}
                  onChange={(e) => setCombinationCode(e.target.value)}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Chưa chọn tổ hợp</option>
                  {program.combinations.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.subjects.map((s) => SUBJECT_LABELS[s]).join(', ')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <SharedProfileNotice className="mt-2" />

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm ưu tiên khu vực/đối tượng</legend>
            <div className="mt-1 flex flex-wrap gap-3">
              <div>
                <label htmlFor="hcmulaw-priority-region" className="text-xs font-medium text-ink">
                  Khu vực
                </label>
                <select
                  id="hcmulaw-priority-region"
                  value={region}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, region: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(HCMULAW_PRIORITY_REGION_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hcmulaw-priority-category" className="text-xs font-medium text-ink">
                  Đối tượng ưu tiên
                </label>
                <select
                  id="hcmulaw-priority-category"
                  value={category}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, category: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(HCMULAW_PRIORITY_CATEGORY_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <SharedProfileNotice className="mt-2" />
          </fieldset>

          {combination && (
            <>
              <div className="mt-4 rounded-xl bg-surface p-4">
                <p className="text-sm font-medium text-ink">PT5 — Điểm thi TN THPT theo tổ hợp {combination.code}</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {combination.subjects.map((subjectId) => (
                    <div key={subjectId}>
                      <label htmlFor={`hcmulaw-thpt-${subjectId}`} className="text-xs font-medium text-ink">
                        {SUBJECT_LABELS[subjectId]}
                      </label>
                      <input
                        id={`hcmulaw-thpt-${subjectId}`}
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
                {renderResult(thpt5Evaluation, 'Điểm xét tuyển PT5')}
              </div>

              <div className="mt-4 rounded-xl bg-surface p-4">
                <p className="text-sm font-medium text-ink">PT4 — Điểm bài thi V-SAT theo tổ hợp {combination.code} (thang 150/môn)</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {combination.subjects.map((subjectId) => (
                    <div key={subjectId}>
                      <label htmlFor={`hcmulaw-vsat-${subjectId}`} className="text-xs font-medium text-ink">
                        {SUBJECT_LABELS[subjectId]}
                      </label>
                      <input
                        id={`hcmulaw-vsat-${subjectId}`}
                        type="number"
                        min={0}
                        max={150}
                        value={vsatScores[subjectId] ?? ''}
                        onChange={(e) => setVsatScores((prev) => ({ ...prev, [subjectId]: e.target.value }))}
                        className="mt-1 w-20 rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted">Chỉ hỗ trợ tổ hợp gồm 7 môn có bảng quy đổi công bố (Toán/Văn/Anh/Lý/Hóa/Sử/Địa).</p>
                {renderResult(vsat4Evaluation, 'Điểm xét tuyển PT4')}
              </div>
            </>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {hcmulawSources.map((source) => (
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
