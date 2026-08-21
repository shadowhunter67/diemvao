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
import { huflitSources } from './sources';
import { huflitAdmissionMethods } from './methods';
import { huflitKnowledgeGaps } from './knowledgeGaps';
import { evaluateHuflitPt1Admission, evaluateHuflitPt2Admission, evaluateHuflitPt3Admission } from './evaluate';
import { HUFLIT_PRIORITY_REGION_POINTS_30, HUFLIT_PRIORITY_CATEGORY_POINTS_30 } from './priority';

interface HuflitPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/** HUFLIT Page — batch 2026-08-21. PT1 (thi THPT)/PT2 (học bạ)/PT3 (ĐGNL) — exact trong phạm vi
 * KHÔNG có thành tích cộng điểm (PT1/PT2). Checkbox "có thành tích" chuyển kết quả về partial
 * trung thực (bảng điểm thưởng cụ thể chưa có nguồn) thay vì tính sai. */
export function HuflitPage({ onChangeSchool }: HuflitPageProps) {
  const { profile, updateProfile } = useApplicantProfile();
  const [combinationId, setCombinationId] = useState('');
  const combination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === combinationId);
  const [isLawProgram, setIsLawProgram] = useState(false);
  const [hasBonusAchievement, setHasBonusAchievement] = useState(false);
  const [transcriptDrafts, setTranscriptDrafts] = useState<Record<string, string>>({});

  function transcriptKey(subjectId: SubjectId, grade: 'grade10' | 'grade11' | 'grade12') {
    return `${subjectId}:${grade}`;
  }

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

  function handleTranscriptChange(subjectId: SubjectId, grade: 'grade10' | 'grade11' | 'grade12', value: string) {
    setTranscriptDrafts((prev) => ({ ...prev, [transcriptKey(subjectId, grade)]: value }));
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

  function getTranscriptInput(subjectId: SubjectId, grade: 'grade10' | 'grade11' | 'grade12'): string {
    const key = transcriptKey(subjectId, grade);
    if (key in transcriptDrafts) return transcriptDrafts[key];
    const value = profile.transcript?.[grade]?.[subjectId];
    return value !== undefined ? String(value) : '';
  }

  const region = profile.priority?.region ?? '';
  const category = profile.priority?.category ?? '';

  const subjectContext = combination ? { combinationId: combination.id, subjects: combination.subjects } : undefined;
  const lawProgramId = isLawProgram ? 'luat' : undefined;
  const pt1Evaluation = evaluateHuflitPt1Admission(profile, { subjectContext, hasBonusAchievement, programId: lawProgramId });
  const pt2Evaluation = evaluateHuflitPt2Admission(profile, { subjectContext, hasBonusAchievement, programId: lawProgramId });

  const [dgnlOverride, setDgnlOverride] = useState('');
  const profileDgnl = profile.exams?.vact?.total;
  const effectiveDgnl = dgnlOverride.trim() !== '' ? Number(dgnlOverride) : profileDgnl;
  const pt3Profile = effectiveDgnl !== undefined ? { ...profile, exams: { vact: { ...profile.exams?.vact, total: effectiveDgnl } } } : profile;
  const pt3Evaluation = evaluateHuflitPt3Admission(pt3Profile, { programId: lawProgramId });
  const pt3Priority = pt3Evaluation.explanation.find((s) => s.id === 'huflit-pt3-priority');

  function renderResult(evaluation: ReturnType<typeof evaluateHuflitPt1Admission>, scale: number, label: string) {
    if (evaluation.score) {
      return (
        <div className="mt-4 rounded-2xl bg-surface p-4">
          <p className="text-base text-ink">
            {label}: <strong className="text-xl text-primary">{evaluation.score.value.toFixed(2)}</strong> / {scale}
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
          school={{ shortName: 'HUFLIT', name: 'Trường Đại học Ngoại ngữ - Tin học TP. Hồ Chí Minh', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/huflit`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ</h2>
          <p className="mt-1 text-sm text-muted">{huflitAdmissionMethods.map((m) => m.name).join(' · ')}</p>
          <MethodCapabilitySummary method={huflitAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            <span className="font-mono text-ink">Điểm xét tuyển = Học lực + Điểm cộng + Điểm ưu tiên</span> (thang 30
            cho PT1/PT2, thang 1200 cho PT3). Điểm học lực PT1 = tổng thô 3 môn thi THPT; PT2 = tổng thô điểm TB 3 môn
            3 năm; PT3 = tổng điểm ĐGNL ĐHQG-HCM.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Phạm vi chưa tính được</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {huflitKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="calculator" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">PT1/PT2 — Thi THPT & Học bạ</h2>
          </div>

          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="huflit-combination" className="text-xs font-medium text-ink">
                Tổ hợp 3 môn
              </label>
              <select
                id="huflit-combination"
                value={combinationId}
                onChange={(e) => setCombinationId(e.target.value)}
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
            <label className="flex items-center gap-2 pb-2 text-sm text-ink">
              <input type="checkbox" checked={isLawProgram} onChange={(e) => setIsLawProgram(e.target.checked)} />
              Ngành Luật/Luật kinh tế (ngưỡng riêng)
            </label>
            <label className="flex items-center gap-2 pb-2 text-sm text-ink">
              <input type="checkbox" checked={hasBonusAchievement} onChange={(e) => setHasBonusAchievement(e.target.checked)} />
              Có thành tích cộng điểm (giải thưởng/chứng chỉ)
            </label>
          </div>
          <SharedProfileNotice className="mt-2" />
          {hasBonusAchievement && (
            <p className="mt-2 text-xs text-warning">
              Bảng điểm thưởng/khuyến khích cụ thể của HUFLIT chưa tìm được nguồn công khai — kết quả dưới đây sẽ không có Điểm cộng.
            </p>
          )}

          {combination && (
            <div className="mt-4 overflow-x-auto rounded-xl bg-surface p-4">
              <table className="w-full min-w-[420px] text-sm text-ink">
                <thead>
                  <tr className="text-left text-xs text-muted">
                    <th className="pb-2">Môn</th>
                    <th className="pb-2">Điểm thi TN THPT</th>
                    <th className="pb-2">Lớp 10</th>
                    <th className="pb-2">Lớp 11</th>
                    <th className="pb-2">Lớp 12</th>
                  </tr>
                </thead>
                <tbody>
                  {combination.subjects.map((subjectId) => (
                    <tr key={subjectId} className="border-t border-ink/5">
                      <td className="py-1.5 pr-2">{SUBJECT_LABELS[subjectId]}</td>
                      <td className="py-1.5 pr-2">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.01}
                          value={profile.thpt?.scores?.[subjectId] ?? ''}
                          onChange={(e) => handleThptChange(subjectId, e.target.value)}
                          className="w-20 rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                        />
                      </td>
                      {(['grade10', 'grade11', 'grade12'] as const).map((grade) => (
                        <td key={grade} className="py-1.5 pr-2">
                          <input
                            type="number"
                            min={0}
                            max={10}
                            step={0.01}
                            value={getTranscriptInput(subjectId, grade)}
                            onChange={(e) => handleTranscriptChange(subjectId, grade, e.target.value)}
                            className="w-20 rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm ưu tiên khu vực/đối tượng</legend>
            <div className="mt-1 flex flex-wrap gap-3">
              <div>
                <label htmlFor="huflit-priority-region" className="text-xs font-medium text-ink">
                  Khu vực
                </label>
                <select
                  id="huflit-priority-region"
                  value={region}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, region: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(HUFLIT_PRIORITY_REGION_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="huflit-priority-category" className="text-xs font-medium text-ink">
                  Đối tượng ưu tiên
                </label>
                <select
                  id="huflit-priority-category"
                  value={category}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, category: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(HUFLIT_PRIORITY_CATEGORY_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <SharedProfileNotice className="mt-2" />
          </fieldset>

          <div className="mt-2">
            <p className="text-sm font-medium text-ink">PT1 (thi THPT)</p>
            {renderResult(pt1Evaluation, 30, 'Điểm xét tuyển PT1')}
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-ink">PT2 (học bạ)</p>
            {renderResult(pt2Evaluation, 30, 'Điểm xét tuyển PT2')}
          </div>
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">PT3 — Xét theo ĐGNL ĐHQG-HCM</h2>
          <div className="mt-3 max-w-xs">
            <label htmlFor="huflit-dgnl" className="text-xs font-medium text-ink">
              Tổng điểm ĐGNL (thang 1200){profileDgnl !== undefined ? ' — đã có trong hồ sơ chung' : ''}
            </label>
            <input
              id="huflit-dgnl"
              type="number"
              min={0}
              max={1200}
              value={dgnlOverride !== '' ? dgnlOverride : profileDgnl ?? ''}
              onChange={(e) => setDgnlOverride(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>
          {pt3Priority && pt3Evaluation.score && (
            <p className="mt-3 text-sm text-ink">
              Điểm ưu tiên: <strong className="text-ink">{pt3Priority.output?.toFixed(2)}</strong>
              {pt3Priority.formula?.startsWith('[') ? ' (đã giảm)' : ''}
            </p>
          )}
          {renderResult(pt3Evaluation, 1200, 'Điểm xét tuyển PT3')}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {huflitSources.map((source) => (
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
