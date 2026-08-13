import { useState } from 'react';
import { AlertTriangle, Award, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS } from '../../core/subjects';
import { uhsSources } from './sources';
import { UHS_PROGRAMS } from './programs';
import { UHS_BONUS_CRITERIA, checkUhsBonusEligibility } from './bonus';
import { uhsKnowledgeGaps } from './knowledgeGaps';
import { uhsAdmissionMethods } from './methods';
import { evaluateUhsAdmission } from './evaluate';

interface UhsPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/** UHS Admission Checker — nguồn 2026-08-13. Chỉ Y khoa/Dược có ngưỡng số cụ thể; bonus chỉ có
 * eligibility checker (không có mức điểm); trọng số Phương thức 2 dạng khoảng nên KHÔNG có exact
 * calculator. Chưa có bảng điểm chuẩn 2026 (nguồn catalog ĐHQG-HCM cần xử lý riêng, xem gap). */
export function UhsPage({ onChangeSchool }: UhsPageProps) {
  const { profile } = useApplicantProfile();
  const [programId, setProgramId] = useState('');
  const program = UHS_PROGRAMS.find((p) => p.id === programId);
  const [combinationId, setCombinationId] = useState('');
  const combination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === combinationId && program?.combinations.includes(c.id));

  const evaluation = evaluateUhsAdmission(profile, {
    subjectContext: combination ? { combinationId: combination.id, subjects: combination.subjects } : undefined,
    program: programId === 'medicine' || programId === 'pharmacy' ? programId : undefined,
  });

  const [selectedBonusIds, setSelectedBonusIds] = useState<string[]>([]);
  const matchedBonus = checkUhsBonusEligibility(selectedBonusIds);

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'UHS', name: 'Trường Đại học Khoa học Sức khỏe – ĐHQG TP.HCM', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/uhs`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ: {uhsAdmissionMethods[0].name}</h2>
          <MethodCapabilitySummary method={uhsAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            Phương thức 2 kết hợp điểm thi THPT (30-35%), ĐGNL (45-50%), học bạ (20%) — trọng số công bố dạng khoảng
            nên UniscoreVN chưa tính được điểm cuối. Chỉ Y khoa/Dược có ngưỡng đầu vào số cụ thể.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">UniscoreVN chưa tính được điểm xét tuyển cho UHS</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {uhsKnowledgeGaps.map((gap) => (
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

          <div className="mt-3 max-w-xs">
            <label htmlFor="uhs-program-select" className="text-xs font-medium text-ink">
              Ngành
            </label>
            <select
              id="uhs-program-select"
              value={programId}
              onChange={(e) => {
                setProgramId(e.target.value);
                setCombinationId('');
              }}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="">Chưa chọn ngành</option>
              {UHS_PROGRAMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {program && !program.hasSpecificThreshold && (
              <p className="mt-1.5 text-xs text-muted">Ngành này chưa có ngưỡng số cụ thể trong nguồn đã đọc.</p>
            )}
          </div>

          {program && (
            <div className="mt-3 max-w-xs">
              <label htmlFor="uhs-combination-select" className="text-xs font-medium text-ink">
                Tổ hợp
              </label>
              <select
                id="uhs-combination-select"
                value={combinationId}
                onChange={(e) => setCombinationId(e.target.value)}
                className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                <option value="">Chưa chọn tổ hợp</option>
                {program.combinations.map((id) => {
                  const c = COMMON_SUBJECT_COMBINATIONS.find((x) => x.id === id);
                  return (
                    <option key={id} value={id}>
                      {id}
                      {c ? ` — ${c.subjects.map((s) => SUBJECT_LABELS[s]).join(', ')}` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <SharedProfileNotice className="mt-2" />

          {evaluation.eligibility?.status !== 'unknown' && (
            <p className={`mt-3 flex items-start gap-1.5 text-sm ${evaluation.eligibility?.status === 'eligible' ? 'text-success' : 'text-muted'}`}>
              {evaluation.eligibility?.status === 'eligible' ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              ) : (
                <XCircle size={16} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
              )}
              <span>{evaluation.eligibility?.reasons[0]}</span>
            </p>
          )}
        </section>

        <section id="bonus" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Điều kiện được xét điểm cộng</h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Trường chỉ công bố AI được xét, chưa công bố mức điểm cụ thể cho từng tiêu chí.
          </p>
          <div className="mt-3 flex flex-col gap-1.5">
            {UHS_BONUS_CRITERIA.map((criterion) => (
              <label key={criterion.id} className="flex items-start gap-2 text-xs text-ink">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={selectedBonusIds.includes(criterion.id)}
                  onChange={() =>
                    setSelectedBonusIds((prev) => (prev.includes(criterion.id) ? prev.filter((x) => x !== criterion.id) : [...prev, criterion.id]))
                  }
                />
                {criterion.label}
              </label>
            ))}
          </div>
          {matchedBonus.length > 0 && (
            <p className="mt-3 text-xs text-muted">Bạn đủ điều kiện được xét {matchedBonus.length} tiêu chí — chưa rõ số điểm thực nhận.</p>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {uhsSources.map((source) => (
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
