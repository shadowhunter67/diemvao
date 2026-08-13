import { useState } from 'react';
import { AlertTriangle, Calculator, CheckCircle2 } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS } from '../../core/subjects';
import { iuSources } from './sources';
import { iuKnowledgeGaps } from './knowledgeGaps';
import { iuAdmissionMethods } from './methods';
import { evaluateIuAdmission } from './evaluate';

interface IuPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/** IU Admission Partial Calculator — nguồn 2026-08-13 (đọc qua trình duyệt thật vì trang chủ
 * render bằng JS). Điểm học lực (k1/k2/k3) FULLY verified — tính được thật. "Điểm thưởng"/"điểm
 * khuyến khích"/bảng mức ưu tiên nằm trong PDF 24 trang chưa đọc được → chỉ ra NGƯỠNG DƯỚI, không
 * phải Điểm xét tuyển chính thức. */
export function IuPage({ onChangeSchool }: IuPageProps) {
  const { profile } = useApplicantProfile();
  const [combinationId, setCombinationId] = useState('');
  const combination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === combinationId);
  const [hasPrioritySchool, setHasPrioritySchool] = useState(false);
  const [specialAchievementCount, setSpecialAchievementCount] = useState(0);

  const evaluation = evaluateIuAdmission(profile, {
    subjectContext: combination ? { combinationId: combination.id, subjects: combination.subjects } : undefined,
    hasPrioritySchool,
    specialAchievementCount,
  });
  const academicStep = evaluation.explanation.find((s) => s.id === 'iu-academic');
  const bonusStep = evaluation.explanation.find((s) => s.id === 'iu-xet-thuong');
  const lowerBoundScore = academicStep && bonusStep ? round2Display(academicStep.output! + bonusStep.output!) : undefined;

  function round2Display(n: number) {
    return Math.round(n * 100) / 100;
  }

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
            <span className="font-mono text-ink">Điểm học lực = 40%×THPT + 50%×ĐGNL + 10%×Học bạ</span> (mỗi thành phần quy
            đổi thang 100). Không có ĐGNL 2026 thì thay bằng 0.83×THPT.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">UniscoreVN chỉ tính được ngưỡng dưới, chưa phải Điểm xét tuyển chính thức</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {iuKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="calculator" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Tính Điểm học lực</h2>
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

          <fieldset className="mt-4">
            <legend className="text-xs font-medium text-ink">Điểm xét thưởng đã biết (2/nhiều tiêu chí)</legend>
            <label className="mt-1.5 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={hasPrioritySchool} onChange={(e) => setHasPrioritySchool(e.target.checked)} />
              Học ≥2 năm tại 1 trong 149 trường ưu tiên + học lực 3 năm Tốt trở lên (+3)
            </label>
            <label className="mt-2 flex items-center gap-2 text-sm text-ink">
              Số giải thưởng đặc biệt (HSG/VISEF/...)
              <input
                id="iu-special-achievement-count"
                name="iu-special-achievement-count"
                type="number"
                min={0}
                value={specialAchievementCount}
                onChange={(e) => setSpecialAchievementCount(Math.max(0, Number(e.target.value)))}
                className="w-16 rounded-md border border-ink/10 bg-surface px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              />
              (+2/giải, tối đa 5 tổng)
            </label>
          </fieldset>

          {academicStep && bonusStep && (
            <div className="mt-5 rounded-2xl bg-surface p-4">
              <p className="text-sm text-ink">
                Điểm học lực: <strong className="text-primary">{academicStep.output?.toFixed(2)}</strong> / 100
              </p>
              <p className="mt-1 text-sm text-ink">
                Điểm xét thưởng đã biết: <strong>{bonusStep.output?.toFixed(2)}</strong> / 5
              </p>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-ink">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  Ngưỡng dưới: <strong>{lowerBoundScore?.toFixed(2)}</strong> / 100 —{' '}
                  {evaluation.eligibility?.reasons[0]}
                </span>
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
