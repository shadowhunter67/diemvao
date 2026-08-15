import { useState } from 'react';
import { Calculator, CheckCircle2, XCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS } from '../../core/subjects';
import { iuSources } from './sources';
import { iuAdmissionMethods } from './methods';
import { evaluateIuAdmission } from './evaluate';
import type { IuAwardTier } from './bonus';
import { iuPrograms } from './data/programs';
import { IU_PRIORITY_CATEGORY_POINTS_100, IU_PRIORITY_REGION_POINTS_100 } from './priority';

interface IuPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

const AWARD_TIER_LABELS: Record<IuAwardTier, string> = {
  none: 'Không có',
  'national-third': 'Giải Ba cấp Quốc gia (+7)',
  'national-second': 'Giải Nhì cấp Quốc gia (+8)',
  'national-first': 'Giải Nhất cấp Quốc gia (+9)',
  international: 'Giải Quốc tế (+10)',
};

/** IU Exact Calculator — nguồn 2026-08-13/14 (đọc qua trình duyệt thật, trang chủ + trang thông
 * tin tuyển sinh render bằng JS/accordion). Điểm học lực + Điểm cộng (3 thành phần) + Điểm ưu
 * tiên (có giảm) đều verified đầy đủ cho "Thí sinh tốt nghiệp THPT 2026" — tính ra Điểm xét
 * tuyển thật, so sánh trực tiếp với điểm trúng tuyển 38 ngành 2026. */
export function IuPage({ onChangeSchool }: IuPageProps) {
  const { profile, updateProfile } = useApplicantProfile();
  const [combinationId, setCombinationId] = useState('');
  const combination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === combinationId);
  const [hasPrioritySchool, setHasPrioritySchool] = useState(false);
  const [specialAchievementCount, setSpecialAchievementCount] = useState(0);
  const [awardTier, setAwardTier] = useState<IuAwardTier>('none');
  const [certificateUsedForExemption, setCertificateUsedForExemption] = useState(false);
  const [programId, setProgramId] = useState('');

  const evaluation = evaluateIuAdmission(profile, {
    subjectContext: combination ? { combinationId: combination.id, subjects: combination.subjects } : undefined,
    hasPrioritySchool,
    specialAchievementCount,
    awardTier,
    certificateUsedForThptExemption: certificateUsedForExemption,
    programId: programId || undefined,
  });
  const academicStep = evaluation.explanation.find((s) => s.id === 'iu-academic');
  const bonusStep = evaluation.explanation.find((s) => s.id === 'iu-bonus');
  const priorityStep = evaluation.explanation.find((s) => s.id === 'iu-priority');

  const region = profile.priority?.region ?? '';
  const category = profile.priority?.category ?? '';
  const detectedCertificate = profile.certificates?.ielts ?? profile.certificates?.toeflIbt ?? profile.certificates?.toeic;

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'IU', name: 'Trường Đại học Quốc tế – ĐHQG TP.HCM', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/iu`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ: {iuAdmissionMethods[0].name}</h2>
          <MethodCapabilitySummary method={iuAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            <span className="font-mono text-ink">Điểm xét tuyển = Điểm học lực + Điểm cộng + Điểm ưu tiên</span> (thang
            100). Điểm học lực = 40%×THPT + 50%×ĐGNL + 10%×Học bạ — không có ĐGNL 2026 thì thay bằng 0.83×THPT. Ngưỡng
            đảm bảo chất lượng: Điểm xét tuyển ≥ 50.
          </p>
        </section>

        <section id="calculator" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Tính Điểm xét tuyển</h2>
          </div>

          <div className="mt-3 max-w-xs">
            <label htmlFor="iu-combination-select" className="text-xs font-medium text-ink">
              Tổ hợp xét tuyển
            </label>
            <select
              id="iu-combination-select"
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

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm thưởng</legend>
            <label htmlFor="iu-award-tier" className="mt-1 block text-xs font-medium text-ink">
              Đủ điều kiện tuyển thẳng (Bộ GD&ĐT) nhưng không dùng quyền tuyển thẳng
            </label>
            <select
              id="iu-award-tier"
              value={awardTier}
              onChange={(e) => setAwardTier(e.target.value as IuAwardTier)}
              className="mt-1 w-full max-w-xs rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              {(Object.keys(AWARD_TIER_LABELS) as IuAwardTier[]).map((tier) => (
                <option key={tier} value={tier}>
                  {AWARD_TIER_LABELS[tier]}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm xét thưởng (tối đa 5)</legend>
            <label className="mt-1.5 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={hasPrioritySchool} onChange={(e) => setHasPrioritySchool(e.target.checked)} />
              Học ≥2 năm tại 1 trong 149 trường ưu tiên + học lực 3 năm Tốt trở lên (+3)
            </label>
            <label className="mt-2 flex items-center gap-2 text-sm text-ink">
              Số giải thưởng đặc biệt (HSG khuyến khích QG/VISEF/VIFOTEC/Euréka/...)
              <input
                id="iu-special-achievement-count"
                name="iu-special-achievement-count"
                type="number"
                min={0}
                value={specialAchievementCount}
                onChange={(e) => setSpecialAchievementCount(Math.max(0, Number(e.target.value)))}
                className="w-16 rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              />
              (+2/giải)
            </label>
          </fieldset>

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm khuyến khích (tối đa 5)</legend>
            <p className="text-xs text-muted">
              Chứng chỉ ngoại ngữ (IELTS/TOEFL iBT/TOEIC) đọc từ hồ sơ chung —
              {detectedCertificate !== undefined ? ' đã phát hiện điểm chứng chỉ trong hồ sơ.' : ' chưa có trong hồ sơ.'}
            </p>
            <label className="mt-2 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={certificateUsedForExemption}
                onChange={(e) => setCertificateUsedForExemption(e.target.checked)}
              />
              Chứng chỉ này đã dùng để miễn thi/quy đổi điểm môn Tiếng Anh THPT (không dùng lại được cho điểm khuyến khích)
            </label>
          </fieldset>

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm ưu tiên khu vực/đối tượng</legend>
            <div className="mt-1 flex flex-wrap gap-3">
              <div>
                <label htmlFor="iu-priority-region" className="text-xs font-medium text-ink">
                  Khu vực
                </label>
                <select
                  id="iu-priority-region"
                  value={region}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, region: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(IU_PRIORITY_REGION_POINTS_100).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="iu-priority-category" className="text-xs font-medium text-ink">
                  Đối tượng ưu tiên
                </label>
                <select
                  id="iu-priority-category"
                  value={category}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, category: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(IU_PRIORITY_CATEGORY_POINTS_100).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">Lưu vào hồ sơ chung — dùng lại được ở trang trường khác.</p>
          </fieldset>

          <div className="mt-4 max-w-sm">
            <label htmlFor="iu-program-select" className="text-xs font-medium text-ink">
              Ngành xét tuyển (để so điểm trúng tuyển 2026)
            </label>
            <select
              id="iu-program-select"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="">Chưa chọn ngành</option>
              {iuPrograms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          {academicStep && bonusStep && priorityStep && evaluation.score && (
            <div className="mt-5 rounded-2xl bg-surface p-4">
              <p className="text-sm text-ink">
                Điểm học lực: <strong className="text-ink">{academicStep.output?.toFixed(2)}</strong> / 100
              </p>
              <p className="mt-1 text-sm text-ink">
                Điểm cộng: <strong className="text-ink">{bonusStep.output?.toFixed(2)}</strong> / 10
              </p>
              <p className="mt-1 text-sm text-ink">
                Điểm ưu tiên: <strong className="text-ink">{priorityStep.output?.toFixed(2)}</strong>
                {priorityStep.formula?.startsWith('[') ? ' (đã giảm)' : ''}
              </p>
              <p className="mt-2 text-base text-ink">
                Điểm xét tuyển: <strong className="text-xl text-primary">{evaluation.score.value.toFixed(2)}</strong> / 100
              </p>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-ink">
                {evaluation.eligibility?.status === 'eligible' ? (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                ) : (
                  <XCircle size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
                )}
                <span>{evaluation.eligibility?.reasons.join(' ')}</span>
              </p>
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {iuSources.map((source) => (
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
