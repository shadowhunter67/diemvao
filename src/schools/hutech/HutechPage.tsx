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
import { hutechSources } from './sources';
import { hutechAdmissionMethods } from './methods';
import { hutechKnowledgeGaps } from './knowledgeGaps';
import { evaluateHutechThptAdmission, evaluateHutechDgnlAdmission, evaluateHutechVsatAdmission } from './evaluate';
import type { HutechThresholdGroup } from './eligibility';
import { HUTECH_PRIORITY_REGION_POINTS_30, HUTECH_PRIORITY_CATEGORY_POINTS_30 } from './priority';
import type { AdmissionEvaluation } from '../../core/admissionEvaluation';

interface HutechPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

const THRESHOLD_GROUP_LABELS: Record<HutechThresholdGroup, string> = {
  medicine: 'Y khoa',
  pharmacy: 'Dược',
  'pharmacy-law': 'Luật/Luật kinh tế',
  'nursing-lab': 'Điều dưỡng/Kỹ thuật xét nghiệm y học',
  standard: 'Các ngành còn lại',
};

/** HUTECH Page — batch 2026-08-21. Chỉ 2/4 phương thức có Page tính điểm (xét THPT/xét ĐGNL) —
 * exact trong phạm vi KHÔNG có thành tích cộng điểm. Xét học bạ (unavailable, cần dữ liệu 6 học
 * kỳ) và xét V-SAT (eligibility-only, thang điểm chưa rõ) hiển thị trung thực bằng banner, không
 * có form tính điểm riêng cho 2 phương thức đó. */
export function HutechPage({ onChangeSchool }: HutechPageProps) {
  const { profile, updateProfile } = useApplicantProfile();
  const [combinationId, setCombinationId] = useState('');
  const combination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === combinationId);
  const [thresholdGroup, setThresholdGroup] = useState<HutechThresholdGroup>('standard');
  const [hasBonusAchievement, setHasBonusAchievement] = useState(false);

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

  const thptEvaluation = evaluateHutechThptAdmission(profile, {
    subjectContext: combination ? { combinationId: combination.id, subjects: combination.subjects } : undefined,
    thresholdGroup,
    hasBonusAchievement,
  });

  const [dgnlOverride, setDgnlOverride] = useState('');
  const profileDgnl = profile.exams?.vact?.total;
  const effectiveDgnl = dgnlOverride.trim() !== '' ? Number(dgnlOverride) : profileDgnl;
  const dgnlProfile = effectiveDgnl !== undefined ? { ...profile, exams: { vact: { ...profile.exams?.vact, total: effectiveDgnl } } } : profile;
  const dgnlEvaluation = evaluateHutechDgnlAdmission(dgnlProfile, { thresholdGroup, hasBonusAchievement });
  const dgnlPriority = dgnlEvaluation.explanation.find((s) => s.id === 'hutech-dgnl-priority');

  const [vsatScoreInput, setVsatScoreInput] = useState('');
  const vsatEvaluation = evaluateHutechVsatAdmission({
    vsatScore: vsatScoreInput.trim() !== '' ? Number(vsatScoreInput) : undefined,
    thresholdGroup,
  });

  function renderResult(evaluation: AdmissionEvaluation, scale: number, label: string) {
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
          school={{ shortName: 'HUTECH', name: 'Trường Đại học Công nghệ TP. Hồ Chí Minh', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/hutech`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ tính điểm: {hutechAdmissionMethods[0].name} · {hutechAdmissionMethods[3].name}</h2>
          <MethodCapabilitySummary method={hutechAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            <span className="font-mono text-ink">Điểm xét tuyển = Điểm học lực + Điểm ưu tiên</span> (thang 30 cho xét
            THPT, thang 1200 cho xét ĐGNL). Điểm học lực xét THPT = tổng thô 3 môn (không nhân hệ số);
            xét ĐGNL dùng trực tiếp tổng điểm ĐGNL.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Phạm vi chưa tính được</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {hutechKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="calculator" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Xét kết quả thi TN THPT 2026</h2>
          </div>

          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="hutech-combination" className="text-xs font-medium text-ink">
                Tổ hợp 3 môn
              </label>
              <select
                id="hutech-combination"
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
              <label htmlFor="hutech-threshold-group" className="text-xs font-medium text-ink">
                Nhóm ngành (tra ngưỡng đầu vào)
              </label>
              <select
                id="hutech-threshold-group"
                value={thresholdGroup}
                onChange={(e) => setThresholdGroup(e.target.value as HutechThresholdGroup)}
                className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                {(Object.keys(THRESHOLD_GROUP_LABELS) as HutechThresholdGroup[]).map((g) => (
                  <option key={g} value={g}>
                    {THRESHOLD_GROUP_LABELS[g]}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 pb-2 text-sm text-ink">
              <input type="checkbox" checked={hasBonusAchievement} onChange={(e) => setHasBonusAchievement(e.target.checked)} />
              Có thành tích cộng điểm
            </label>
          </div>
          <SharedProfileNotice className="mt-2" />
          {hasBonusAchievement && (
            <p className="mt-2 text-xs text-warning">
              Bảng điểm thưởng/khuyến khích cụ thể của HUTECH chưa tìm được nguồn công khai — kết quả dưới đây sẽ không tính được.
            </p>
          )}

          {combination && (
            <div className="mt-4 flex flex-wrap gap-3 rounded-xl bg-surface p-4">
              {combination.subjects.map((subjectId) => (
                <div key={subjectId}>
                  <label htmlFor={`hutech-thpt-${subjectId}`} className="text-xs font-medium text-ink">
                    {SUBJECT_LABELS[subjectId]}
                  </label>
                  <input
                    id={`hutech-thpt-${subjectId}`}
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
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm ưu tiên khu vực/đối tượng</legend>
            <div className="mt-1 flex flex-wrap gap-3">
              <div>
                <label htmlFor="hutech-priority-region" className="text-xs font-medium text-ink">
                  Khu vực
                </label>
                <select
                  id="hutech-priority-region"
                  value={region}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, region: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(HUTECH_PRIORITY_REGION_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hutech-priority-category" className="text-xs font-medium text-ink">
                  Đối tượng ưu tiên
                </label>
                <select
                  id="hutech-priority-category"
                  value={category}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, category: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(HUTECH_PRIORITY_CATEGORY_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <SharedProfileNotice className="mt-2" />
          </fieldset>

          {renderResult(thptEvaluation, 30, 'Điểm xét tuyển (xét THPT)')}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Xét kết quả ĐGNL ĐHQG TP.HCM 2026</h2>
          <div className="mt-3 max-w-xs">
            <label htmlFor="hutech-dgnl" className="text-xs font-medium text-ink">
              Tổng điểm ĐGNL (thang 1200){profileDgnl !== undefined ? ' — đã có trong hồ sơ chung' : ''}
            </label>
            <input
              id="hutech-dgnl"
              type="number"
              min={0}
              max={1200}
              value={dgnlOverride !== '' ? dgnlOverride : profileDgnl ?? ''}
              onChange={(e) => setDgnlOverride(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>
          {dgnlPriority && dgnlEvaluation.score && (
            <p className="mt-3 text-sm text-ink">
              Điểm ưu tiên: <strong className="text-ink">{dgnlPriority.output?.toFixed(2)}</strong>
              {dgnlPriority.formula?.startsWith('[') ? ' (đã giảm)' : ''}
            </p>
          )}
          {renderResult(dgnlEvaluation, 1200, 'Điểm xét tuyển (xét ĐGNL)')}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Xét kết quả V-SAT 2026 (chỉ kiểm tra ngưỡng)</h2>
          <p className="mt-1 text-sm text-muted">
            Thang điểm tối đa/công thức quy đổi V-SAT của HUTECH chưa xác định rõ từ nguồn — chỉ so được điểm thô với ngưỡng đầu vào.
          </p>
          <div className="mt-3 max-w-xs">
            <label htmlFor="hutech-vsat" className="text-xs font-medium text-ink">
              Điểm bài thi V-SAT
            </label>
            <input
              id="hutech-vsat"
              type="number"
              min={0}
              value={vsatScoreInput}
              onChange={(e) => setVsatScoreInput(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>
          {vsatScoreInput.trim() !== '' && (
            <p className="mt-3 flex items-start gap-1.5 text-sm text-ink">
              {vsatEvaluation.eligibility?.status === 'eligible' ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              ) : (
                <XCircle size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
              )}
              <span>{vsatEvaluation.eligibility?.reasons.join(' ')}</span>
            </p>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {hutechSources.map((source) => (
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
