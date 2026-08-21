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
import type { AdmissionEvaluation } from '../../core/admissionEvaluation';
import { ufmSources } from './sources';
import { ufmAdmissionMethods } from './methods';
import { ufmKnowledgeGaps } from './knowledgeGaps';
import { evaluateUfmThptAdmission, evaluateUfmHocbaAdmission, evaluateUfmDgnlAdmission, evaluateUfmVsatAdmission } from './evaluate';
import type { UfmThresholdGroup } from './eligibility';
import type { UfmBonusInput } from './bonus';
import { UFM_PRIORITY_REGION_POINTS_30, UFM_PRIORITY_CATEGORY_POINTS_30 } from './priority';

interface UfmPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

const THRESHOLD_GROUP_LABELS: Record<UfmThresholdGroup, string> = {
  standard: 'Ngành thường',
  'law-economics': 'Luật kinh tế',
};

const ENGLISH_TIER_LABELS: { value: 0 | 0.5 | 0.75 | 1.5; label: string }[] = [
  { value: 0, label: 'Không có/không dùng' },
  { value: 0.5, label: 'Mức thấp (vd IELTS ≤5.0, TOEFL iBT ≤45) — +0,5' },
  { value: 0.75, label: 'Mức trung (vd IELTS 5.5-6.5, TOEFL iBT 46-93) — +0,75' },
  { value: 1.5, label: 'Mức cao (vd IELTS ≥7.0, TOEFL iBT ≥94) — +1,5' },
];

/** UFM Page — batch 2026-08-21. CẢ 4/4 phương thức (thi TN THPT/học bạ/ĐGNL/V-SAT) exact trong
 * phạm vi chương trình Chuẩn. Điểm cộng (b1/b2/b3) dùng chung 1 fieldset cho cả 4 phương thức. */
export function UfmPage({ onChangeSchool }: UfmPageProps) {
  const { profile, updateProfile } = useApplicantProfile();
  const [combinationId, setCombinationId] = useState('');
  const combination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === combinationId);
  const [thresholdGroup, setThresholdGroup] = useState<UfmThresholdGroup>('standard');

  const [nationalAchievementLevel, setNationalAchievementLevel] = useState<'' | 'first' | 'second' | 'third'>('');
  const [nationalEncouragementAward, setNationalEncouragementAward] = useState(false);
  const [giftedSchoolStudent, setGiftedSchoolStudent] = useState(false);
  const [goodStudentThreeYears, setGoodStudentThreeYears] = useState(false);
  const [englishCertificateTier, setEnglishCertificateTier] = useState<0 | 0.5 | 0.75 | 1.5>(0);

  const bonus: UfmBonusInput = {
    nationalAchievementLevel: nationalAchievementLevel || undefined,
    nationalEncouragementAward,
    giftedSchoolStudent,
    goodStudentThreeYears,
    englishCertificateTier: englishCertificateTier === 0 ? undefined : englishCertificateTier,
  };

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

  const [transcriptDrafts, setTranscriptDrafts] = useState<Record<string, string>>({});
  function transcriptKey(subjectId: SubjectId, grade: 'grade10' | 'grade11' | 'grade12') {
    return `${subjectId}:${grade}`;
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
  const thptEvaluation = evaluateUfmThptAdmission(profile, { subjectContext, thresholdGroup, bonus });
  const hocbaEvaluation = evaluateUfmHocbaAdmission(profile, { subjectContext, thresholdGroup, bonus });

  const [dgnlOverride, setDgnlOverride] = useState('');
  const profileDgnl = profile.exams?.vact?.total;
  const effectiveDgnl = dgnlOverride.trim() !== '' ? Number(dgnlOverride) : profileDgnl;
  const dgnlProfile = effectiveDgnl !== undefined ? { ...profile, exams: { vact: { ...profile.exams?.vact, total: effectiveDgnl } } } : profile;
  const dgnlEvaluation = evaluateUfmDgnlAdmission(dgnlProfile, { thresholdGroup, bonus });

  const [vsatScoreInput, setVsatScoreInput] = useState('');
  const vsatEvaluation = evaluateUfmVsatAdmission(profile, {
    vsatScore: vsatScoreInput.trim() !== '' ? Number(vsatScoreInput) : undefined,
    thresholdGroup,
    bonus,
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
    if (evaluation.eligibility) {
      return (
        <p className="mt-3 flex items-start gap-1.5 text-sm text-ink">
          {evaluation.eligibility.status === 'ineligible' ? (
            <XCircle size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
          ) : (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          )}
          <span>{evaluation.eligibility.reasons.join(' ')}</span>
        </p>
      );
    }
    return null;
  }

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'UFM', name: 'Trường Đại học Tài chính – Marketing', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/ufm`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Cả 4 phương thức đang hỗ trợ (chương trình Chuẩn)</h2>
          <p className="mt-1 text-sm text-muted">{ufmAdmissionMethods.map((m) => m.name).join(' · ')}</p>
          <MethodCapabilitySummary method={ufmAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            <span className="font-mono text-ink">Điểm xét tuyển = Điểm quy đổi tương đương + Điểm cộng + Điểm ưu tiên</span>{' '}
            (thang 30). Thi TN THPT dùng thẳng tổng thô 3 môn; học bạ/ĐGNL/V-SAT quy đổi qua bảng bách phân vị chính
            thức sang thang tương đương thi TN THPT trước khi cộng.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Phạm vi chưa tính được</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {ufmKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="calculator" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Thiết lập chung</h2>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <div>
              <label htmlFor="ufm-combination" className="text-xs font-medium text-ink">
                Tổ hợp 3 môn (dùng cho thi THPT & học bạ)
              </label>
              <select
                id="ufm-combination"
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
            <div>
              <label htmlFor="ufm-threshold-group" className="text-xs font-medium text-ink">
                Nhóm ngành (tra ngưỡng đầu vào)
              </label>
              <select
                id="ufm-threshold-group"
                value={thresholdGroup}
                onChange={(e) => setThresholdGroup(e.target.value as UfmThresholdGroup)}
                className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                {(Object.keys(THRESHOLD_GROUP_LABELS) as UfmThresholdGroup[]).map((g) => (
                  <option key={g} value={g}>
                    {THRESHOLD_GROUP_LABELS[g]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <SharedProfileNotice className="mt-2" />

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm cộng (b1+b2+b3, tối đa 3,0 — dùng chung cả 4 phương thức)</legend>
            <div className="mt-1">
              <label htmlFor="ufm-b1" className="text-xs font-medium text-ink">
                b1: giải HSG/KHKT cấp quốc gia
              </label>
              <select
                id="ufm-b1"
                value={nationalAchievementLevel}
                onChange={(e) => setNationalAchievementLevel(e.target.value as '' | 'first' | 'second' | 'third')}
                className="mt-1 w-full max-w-xs rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                <option value="">Không có</option>
                <option value="first">Giải Nhất (+3,0)</option>
                <option value="second">Giải Nhì (+2,0)</option>
                <option value="third">Giải Ba (+1,5)</option>
              </select>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={nationalEncouragementAward} onChange={(e) => setNationalEncouragementAward(e.target.checked)} />
                b2: giải khuyến khích HSG/KHKT cấp quốc gia (+1,0)
              </label>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={giftedSchoolStudent} onChange={(e) => setGiftedSchoolStudent(e.target.checked)} />
                b2: học sinh trường chuyên/năng khiếu (+0,75)
              </label>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={goodStudentThreeYears} onChange={(e) => setGoodStudentThreeYears(e.target.checked)} />
                b2: học lực Giỏi trở lên cả 3 năm (+0,75)
              </label>
            </div>
            <div className="mt-2">
              <label htmlFor="ufm-b3" className="text-xs font-medium text-ink">
                b3: chứng chỉ Tiếng Anh
              </label>
              <select
                id="ufm-b3"
                value={englishCertificateTier}
                onChange={(e) => setEnglishCertificateTier(Number(e.target.value) as 0 | 0.5 | 0.75 | 1.5)}
                className="mt-1 w-full max-w-xs rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                {ENGLISH_TIER_LABELS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm ưu tiên khu vực/đối tượng</legend>
            <div className="mt-1 flex flex-wrap gap-3">
              <div>
                <label htmlFor="ufm-priority-region" className="text-xs font-medium text-ink">
                  Khu vực
                </label>
                <select
                  id="ufm-priority-region"
                  value={region}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, region: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(UFM_PRIORITY_REGION_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ufm-priority-category" className="text-xs font-medium text-ink">
                  Đối tượng ưu tiên
                </label>
                <select
                  id="ufm-priority-category"
                  value={category}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, category: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(UFM_PRIORITY_CATEGORY_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <SharedProfileNotice className="mt-2" />
          </fieldset>
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Xét kết quả thi TN THPT 2026</h2>
          {combination && (
            <div className="mt-3 flex flex-wrap gap-3 rounded-xl bg-surface p-4">
              {combination.subjects.map((subjectId) => (
                <div key={subjectId}>
                  <label htmlFor={`ufm-thpt-${subjectId}`} className="text-xs font-medium text-ink">
                    {SUBJECT_LABELS[subjectId]}
                  </label>
                  <input
                    id={`ufm-thpt-${subjectId}`}
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
          {renderResult(thptEvaluation, 'Điểm xét tuyển (thi TN THPT)')}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Xét học bạ THPT</h2>
          {combination && (
            <div className="mt-3 overflow-x-auto rounded-xl bg-surface p-4">
              <table className="w-full min-w-[420px] text-sm text-ink">
                <thead>
                  <tr className="text-left text-xs text-muted">
                    <th className="pb-2">Môn</th>
                    <th className="pb-2">Lớp 10</th>
                    <th className="pb-2">Lớp 11</th>
                    <th className="pb-2">Lớp 12</th>
                  </tr>
                </thead>
                <tbody>
                  {combination.subjects.map((subjectId) => (
                    <tr key={subjectId} className="border-t border-ink/5">
                      <td className="py-1.5 pr-2">{SUBJECT_LABELS[subjectId]}</td>
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
          {renderResult(hocbaEvaluation, 'Điểm xét tuyển (học bạ)')}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Xét kết quả ĐGNL ĐHQG TP.HCM 2026</h2>
          <div className="mt-3 max-w-xs">
            <label htmlFor="ufm-dgnl" className="text-xs font-medium text-ink">
              Tổng điểm ĐGNL (thang 1200){profileDgnl !== undefined ? ' — đã có trong hồ sơ chung' : ''}
            </label>
            <input
              id="ufm-dgnl"
              type="number"
              min={0}
              max={1200}
              value={dgnlOverride !== '' ? dgnlOverride : profileDgnl ?? ''}
              onChange={(e) => setDgnlOverride(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>
          {renderResult(dgnlEvaluation, 'Điểm xét tuyển (ĐGNL)')}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Xét kết quả V-SAT 2026</h2>
          <div className="mt-3 max-w-xs">
            <label htmlFor="ufm-vsat" className="text-xs font-medium text-ink">
              Tổng điểm V-SAT (thang 450)
            </label>
            <input
              id="ufm-vsat"
              type="number"
              min={0}
              max={450}
              value={vsatScoreInput}
              onChange={(e) => setVsatScoreInput(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>
          {renderResult(vsatEvaluation, 'Điểm xét tuyển (V-SAT)')}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {ufmSources.map((source) => (
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
