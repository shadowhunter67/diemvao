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
import { iuhSources } from './sources';
import { iuhAdmissionMethods } from './methods';
import { iuhKnowledgeGaps } from './knowledgeGaps';
import { evaluateIuhCombinedAdmission } from './evaluate';
import type { IuhAwardLevel, IuhRewardInput } from './bonus';
import { IUH_PRIORITY_REGION_POINTS_30, IUH_PRIORITY_CATEGORY_POINTS_30 } from './priority';

interface IuhPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;
const IELTS_ENCOURAGEMENT_OPTIONS = [0, 4.5, 5.0, 5.5, 6.0, 6.5] as const;

/** IUH Page — batch 2026-08-21. 1 phương thức duy nhất (xét tuyển kết hợp, Trụ sở chính TP.HCM,
 * chương trình Chuẩn) — ĐXT = Max(XT1, XT2, XT3), cả 3 nhánh đều tính được nếu đủ dữ liệu. */
export function IuhPage({ onChangeSchool }: IuhPageProps) {
  const { profile, updateProfile } = useApplicantProfile();
  const [combinationId, setCombinationId] = useState('');
  const combination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === combinationId);

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

  function handleTranscriptChange(subjectId: SubjectId, value: string) {
    if (value.trim() === '') {
      updateProfile((current) => {
        const nextGrade12 = { ...current.transcript?.grade12 };
        delete nextGrade12[subjectId];
        return { ...current, transcript: { ...current.transcript, grade12: nextGrade12 } };
      });
      return;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed) || !isValidThptScore(parsed)) return;
    updateProfile((current) => ({
      ...current,
      transcript: { ...current.transcript, grade12: { ...current.transcript?.grade12, [subjectId]: parsed } },
    }));
  }

  const [academicAward, setAcademicAward] = useState<'' | IuhAwardLevel>('');
  const [scienceContestAward, setScienceContestAward] = useState<'' | IuhAwardLevel>('');
  const [threeYearExcellent, setThreeYearExcellent] = useState(false);
  const [otherOutstandingAchievement, setOtherOutstandingAchievement] = useState(false);
  const [ieltsEncouragement, setIeltsEncouragement] = useState<(typeof IELTS_ENCOURAGEMENT_OPTIONS)[number]>(0);

  const reward: IuhRewardInput = {
    academicAward: academicAward || undefined,
    scienceContestAward: scienceContestAward || undefined,
    threeYearExcellent,
    otherOutstandingAchievement,
  };

  const [dgnlOverride, setDgnlOverride] = useState('');
  const profileDgnl = profile.exams?.vact?.total;
  const effectiveDgnl = dgnlOverride.trim() !== '' ? Number(dgnlOverride) : profileDgnl;
  const evaluationProfile = effectiveDgnl !== undefined ? { ...profile, exams: { vact: { ...profile.exams?.vact, total: effectiveDgnl } } } : profile;

  const region = profile.priority?.region ?? '';
  const category = profile.priority?.category ?? '';

  const evaluation = evaluateIuhCombinedAdmission(evaluationProfile, {
    subjectContext: combination ? { combinationId: combination.id, subjects: combination.subjects } : undefined,
    englishEncouragement30: ieltsEncouragement > 0 ? ieltsEncouragement : undefined,
    reward,
  });

  const dtnStep = evaluation.explanation.find((s) => s.id === 'iuh-dtn');
  const ddgnlStep = evaluation.explanation.find((s) => s.id === 'iuh-ddgnl');
  const dhbStep = evaluation.explanation.find((s) => s.id === 'iuh-dhb');
  const priorityStep = evaluation.explanation.find((s) => s.id === 'iuh-priority');
  const bonusStep = evaluation.explanation.find((s) => s.id === 'iuh-bonus');
  const xt1Step = evaluation.explanation.find((s) => s.id === 'iuh-xt1');
  const xt2Step = evaluation.explanation.find((s) => s.id === 'iuh-xt2');
  const xt3Step = evaluation.explanation.find((s) => s.id === 'iuh-xt3');

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'IUH', name: 'Trường Đại học Công nghiệp Thành phố Hồ Chí Minh', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/iuh`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ: {iuhAdmissionMethods[0].name}</h2>
          <MethodCapabilitySummary method={iuhAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            <span className="font-mono text-ink">ĐXT = Max(XT1; XT2; XT3)</span> (thang 30). XT1 = 0,7×ĐK + 0,3×ĐHB +
            Đ(Kv;Đt) + ĐC; XT2 = ĐTN + Đ(Kv;Đt) + ĐC; XT3 = ĐĐGNL + Đ(Kv;Đt) + ĐC; ĐK = Max(ĐTN, ĐĐGNL); ĐĐGNL =
            (Kết quả ĐGNL × 30) / 1139 (ĐTK 2026).
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Phạm vi chưa tính được</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {iuhKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="calculator" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Tính điểm xét tuyển kết hợp</h2>
          </div>

          <div className="mt-3 max-w-xs">
            <label htmlFor="iuh-combination" className="text-xs font-medium text-ink">
              Tổ hợp 3 môn
            </label>
            <select
              id="iuh-combination"
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
          <SharedProfileNotice className="mt-2" />

          {combination && (
            <div className="mt-4 overflow-x-auto rounded-xl bg-surface p-4">
              <table className="w-full min-w-[380px] text-sm text-ink">
                <thead>
                  <tr className="text-left text-xs text-muted">
                    <th className="pb-2">Môn</th>
                    <th className="pb-2">Điểm thi TN THPT (ĐTN)</th>
                    <th className="pb-2">Điểm học bạ lớp 12 (ĐHB)</th>
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
                      <td className="py-1.5 pr-2">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.01}
                          value={profile.transcript?.grade12?.[subjectId] ?? ''}
                          onChange={(e) => handleTranscriptChange(subjectId, e.target.value)}
                          className="w-20 rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 max-w-xs">
            <label htmlFor="iuh-dgnl" className="text-xs font-medium text-ink">
              Tổng điểm ĐGNL ĐHQG-HCM (thang 1200, tùy chọn){profileDgnl !== undefined ? ' — đã có trong hồ sơ chung' : ''}
            </label>
            <input
              id="iuh-dgnl"
              type="number"
              min={0}
              max={1200}
              value={dgnlOverride !== '' ? dgnlOverride : profileDgnl ?? ''}
              onChange={(e) => setDgnlOverride(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm xét thưởng (tối đa 1,5)</legend>
            <div className="mt-1 flex flex-wrap gap-3">
              <div>
                <label htmlFor="iuh-academic-award" className="text-xs font-medium text-ink">
                  Giải HSG/Olympic văn hóa cấp tỉnh/thành trở lên
                </label>
                <select
                  id="iuh-academic-award"
                  value={academicAward}
                  onChange={(e) => setAcademicAward(e.target.value as '' | IuhAwardLevel)}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không có</option>
                  <option value="second-or-above">Giải Nhì trở lên (+1,5)</option>
                  <option value="other">Giải khác (+1,25)</option>
                </select>
              </div>
              <div>
                <label htmlFor="iuh-science-award" className="text-xs font-medium text-ink">
                  Giải cuộc thi KHKT cấp tỉnh/thành trở lên
                </label>
                <select
                  id="iuh-science-award"
                  value={scienceContestAward}
                  onChange={(e) => setScienceContestAward(e.target.value as '' | IuhAwardLevel)}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không có</option>
                  <option value="second-or-above">Giải Nhì trở lên (+1,5)</option>
                  <option value="other">Giải khác (+1,25)</option>
                </select>
              </div>
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={threeYearExcellent} onChange={(e) => setThreeYearExcellent(e.target.checked)} />
              Học lực Giỏi cả 3 năm lớp 10/11/12 (+1,25)
            </label>
            <label className="mt-1.5 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={otherOutstandingAchievement} onChange={(e) => setOtherOutstandingAchievement(e.target.checked)} />
              Thành tích nổi bật khác được tổ chức xác nhận (+0,75)
            </label>
            <p className="mt-2 text-xs text-muted">
              3/7 hạng mục còn lại (trường ký kết hợp tác/trường chuyên/Top trường) cần tra danh mục trường động, chưa hỗ trợ.
            </p>
          </fieldset>

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm khuyến khích (IELTS)</legend>
            <label htmlFor="iuh-ielts" className="mt-1 block text-xs font-medium text-ink">
              Mốc IELTS (hoặc chứng chỉ khác đã tự quy đổi tương đương)
            </label>
            <select
              id="iuh-ielts"
              value={ieltsEncouragement}
              onChange={(e) => setIeltsEncouragement(Number(e.target.value) as (typeof IELTS_ENCOURAGEMENT_OPTIONS)[number])}
              className="mt-1 w-full max-w-xs rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value={0}>Không có</option>
              <option value={4.5}>IELTS 4.5 (+0,5)</option>
              <option value={5.0}>IELTS 5.0 (+0,75)</option>
              <option value={5.5}>IELTS 5.5 (+1,0)</option>
              <option value={6.0}>IELTS 6.0 (+1,25)</option>
              <option value={6.5}>IELTS 6.5 trở lên (+1,5)</option>
            </select>
          </fieldset>

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm ưu tiên khu vực/đối tượng</legend>
            <div className="mt-1 flex flex-wrap gap-3">
              <div>
                <label htmlFor="iuh-priority-region" className="text-xs font-medium text-ink">
                  Khu vực
                </label>
                <select
                  id="iuh-priority-region"
                  value={region}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, region: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(IUH_PRIORITY_REGION_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="iuh-priority-category" className="text-xs font-medium text-ink">
                  Đối tượng ưu tiên
                </label>
                <select
                  id="iuh-priority-category"
                  value={category}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, category: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(IUH_PRIORITY_CATEGORY_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <SharedProfileNotice className="mt-2" />
          </fieldset>

          {(dtnStep || ddgnlStep) && (
            <div className="mt-5 rounded-2xl bg-surface p-4">
              {dtnStep && (
                <p className="text-sm text-ink">
                  ĐTN: <strong className="text-ink">{dtnStep.output?.toFixed(2)}</strong> / 30
                </p>
              )}
              {ddgnlStep && (
                <p className="mt-1 text-sm text-ink">
                  ĐĐGNL: <strong className="text-ink">{ddgnlStep.output?.toFixed(2)}</strong> / 30
                </p>
              )}
              {dhbStep && (
                <p className="mt-1 text-sm text-ink">
                  ĐHB: <strong className="text-ink">{dhbStep.output?.toFixed(2)}</strong> / 30
                </p>
              )}
              {priorityStep && (
                <p className="mt-1 text-sm text-ink">
                  Điểm ưu tiên: <strong className="text-ink">{priorityStep.output?.toFixed(2)}</strong>
                  {priorityStep.formula?.startsWith('[') ? ' (đã giảm)' : ''}
                </p>
              )}
              {bonusStep && (
                <p className="mt-1 text-sm text-ink">
                  Điểm cộng: <strong className="text-ink">{bonusStep.output?.toFixed(2)}</strong>
                </p>
              )}
              <div className="mt-2 flex flex-col gap-1 text-sm text-ink">
                {xt1Step && (
                  <p>
                    XT1: <strong>{xt1Step.output?.toFixed(2)}</strong>
                  </p>
                )}
                {xt2Step && (
                  <p>
                    XT2: <strong>{xt2Step.output?.toFixed(2)}</strong>
                  </p>
                )}
                {xt3Step && (
                  <p>
                    XT3: <strong>{xt3Step.output?.toFixed(2)}</strong>
                  </p>
                )}
              </div>
              {evaluation.score && (
                <p className="mt-2 text-base text-ink">
                  ĐXT — Điểm xét tuyển cuối cùng: <strong className="text-xl text-primary">{evaluation.score.value.toFixed(2)}</strong> / 30
                </p>
              )}
              {!evaluation.score && evaluation.missingInputs.length > 0 && (
                <p className="mt-2 flex items-start gap-1.5 text-sm text-warning">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{evaluation.missingInputs.join(' ')}</span>
                </p>
              )}
              {evaluation.eligibility && (
                <p className="mt-2 flex items-start gap-1.5 text-sm text-ink">
                  {evaluation.eligibility.status === 'ineligible' ? (
                    <XCircle size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  )}
                  <span>{evaluation.eligibility.reasons.join(' ')}</span>
                </p>
              )}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {iuhSources.map((source) => (
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
