import { useState } from 'react';
import { AlertTriangle, ArrowRightLeft, Award, CheckCircle2, GraduationCap, ShieldCheck, XCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { isValidThptScore } from '../../core/thptProfile';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS, type SubjectId } from '../../core/subjects';
import { round2 } from '../../core/round2';
import { uelPrograms } from './data/programs';
import { uelCutoffs } from './data/cutoffs';
import { uelSources } from './sources';
import { checkThptThreshold } from './eligibility';
import { UEL_PRIORITY_BY_ZONE_SCALE_100 } from './data/thresholds';
import { UEL_BONUS_CATEGORIES, UEL_BONUS_OVERALL_CAP, type UelBonusCategoryId } from './data/bonus';
import { calculateUelBonusEligibility } from './bonus';
import { buildUelEvaluationInput } from './applicantProfileAdapter';
import { loadStoredUelCombinationId, saveStoredUelCombinationId } from './comparisonContextStorage';
import { convertDgnlToScale100 } from './dgnlConversion';
import { uelKnowledgeGaps } from './knowledgeGaps';
import { uelAdmissionMethods } from './methods';
import { calculateUelEffectivePriority } from './priorityReduction';

interface UelExplorerPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/**
 * UEL Admission Explorer — cùng pattern UitInfoPage.tsx (Level A/B/C thật, Level D exact
 * calculator blocked). Research 2026-08-11, xem docs/admission-research-2026.md. Formula 3
 * thành phần (ĐGNL/THPT/học bạ) đã biết ĐẦY ĐỦ cách quy đổi (rõ hơn UIT), nhưng KHÔNG mở exact
 * calculator vì còn thiếu bảng điểm cộng chứng chỉ ngoại ngữ chi tiết theo mức — sai phần này vẫn
 * có thể ra điểm cuối sai, nên giữ nguyên tắc "đúng dữ liệu > mở đủ calculator".
 */
export function UelExplorerPage({ onChangeSchool }: UelExplorerPageProps) {
  const cutoffsByProgram = new Map(uelCutoffs.map((cutoff) => [cutoff.programId, cutoff]));

  // Batch 5, workstream N/O — trường thứ 3 (sau HCMUT/UEH) đọc CÙNG `ApplicantProfile.exams.
  // vact.total` dùng chung, chứng minh kiến trúc profile không phải special-case 2 trường. Cùng
  // pattern UI với `UehExplorerPage.tsx`: ưu tiên số có sẵn trong hồ sơ, cho phép override, ghi
  // ngược qua `updateVactTotal` (đi qua reconcile policy, không tự gán field rời rạc).
  const { profile, updateProfile, updateVactTotal } = useApplicantProfile();
  const [selectedCombinationId, setSelectedCombinationId] = useState(loadStoredUelCombinationId);
  const [thptSubjectDrafts, setThptSubjectDrafts] = useState<Partial<Record<SubjectId, string>>>({});
  const selectedCombination = COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === selectedCombinationId);
  const uelInput = buildUelEvaluationInput(
    profile,
    selectedCombination ? { combinationId: selectedCombination.id, subjects: selectedCombination.subjects } : undefined
  );
  const profileDgnlTotal = uelInput.dgnlScore;
  const [dgnlManualOverride, setDgnlManualOverride] = useState(false);
  const [dgnlInput, setDgnlInput] = useState('');
  const usingProfileDgnlValue = !dgnlManualOverride && profileDgnlTotal !== undefined;
  const effectiveDgnlRaw = usingProfileDgnlValue ? String(profileDgnlTotal) : dgnlInput;
  const dgnlScale100 = effectiveDgnlRaw.trim() !== '' ? convertDgnlToScale100(Number(effectiveDgnlRaw)) : undefined;
  const [dgnlComponentsClearedNotice, setDgnlComponentsClearedNotice] = useState(false);

  function handleManualDgnlChange(value: string) {
    setDgnlInput(value);
    const parsed = value.trim() !== '' ? Number(value) : NaN;
    if (!Number.isNaN(parsed)) {
      const { componentsCleared } = updateVactTotal(parsed, 'user-total-input');
      // Sticky trong cả phiên sửa — xem giải thích ở UehExplorerPage.tsx (cùng bug, cùng fix).
      setDgnlComponentsClearedNotice((prev) => prev || componentsCleared);
    } else {
      setDgnlComponentsClearedNotice(false);
    }
  }

  function handleThptSubjectChange(subjectId: SubjectId, value: string) {
    setThptSubjectDrafts((prev) => ({ ...prev, [subjectId]: value }));
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
    updateProfile((current) => ({
      ...current,
      thpt: {
        scores: {
          ...current.thpt?.scores,
          [subjectId]: parsed,
        },
      },
    }));
  }

  function getEffectiveThptSubjectInput(subjectId: SubjectId): string {
    if (Object.prototype.hasOwnProperty.call(thptSubjectDrafts, subjectId)) {
      return thptSubjectDrafts[subjectId] ?? '';
    }
    const profileScore = profile.thpt?.scores?.[subjectId];
    return profileScore !== undefined ? String(profileScore) : '';
  }

  function getEffectiveThptSubjectScore(subjectId: SubjectId): number | undefined {
    if (Object.prototype.hasOwnProperty.call(thptSubjectDrafts, subjectId)) {
      const draft = thptSubjectDrafts[subjectId];
      if (draft === undefined || draft.trim() === '') return undefined;
      const parsed = Number(draft);
      return !Number.isNaN(parsed) && isValidThptScore(parsed) ? parsed : undefined;
    }
    return profile.thpt?.scores?.[subjectId];
  }

  function getThptSubjectSourceLabel(subjectId: SubjectId): string {
    const draft = thptSubjectDrafts[subjectId];
    if (draft !== undefined && draft.trim() !== '' && isValidThptScore(Number(draft))) return 'Bạn vừa nhập tại UEL';
    if (draft !== undefined && draft.trim() !== '' && !isValidThptScore(Number(draft))) return 'Điểm phải trong khoảng 0–10';
    if (profile.thpt?.scores?.[subjectId] !== undefined) return 'Từ hồ sơ đã lưu';
    return 'Chưa có';
  }

  const [academicPlusBonusInput, setAcademicPlusBonusInput] = useState('');
  const [standardPriorityInput, setStandardPriorityInput] = useState('');
  const priorityReductionResult =
    academicPlusBonusInput.trim() !== '' && standardPriorityInput.trim() !== ''
      ? calculateUelEffectivePriority({
          academicPlusBonus: Number(academicPlusBonusInput),
          standardPriority: Number(standardPriorityInput),
        })
      : null;

  const [manualThptRaw, setManualThptRaw] = useState('');
  const thptRawTotalFromSubjects = selectedCombination
    ? selectedCombination.subjects.reduce<number | undefined>((total, subjectId) => {
        const score = getEffectiveThptSubjectScore(subjectId);
        return total === undefined || score === undefined ? undefined : round2(total + score);
      }, 0)
    : undefined;
  const thptRawForThreshold =
    thptRawTotalFromSubjects !== undefined ? thptRawTotalFromSubjects : manualThptRaw.trim() !== '' ? Number(manualThptRaw) : undefined;
  const thptResult = thptRawForThreshold !== undefined ? checkThptThreshold(thptRawForThreshold) : null;
  const missingThptSubjects =
    selectedCombination?.subjects.filter((subjectId) => getEffectiveThptSubjectScore(subjectId) === undefined) ?? [];

  const [selectedBonus, setSelectedBonus] = useState<UelBonusCategoryId[]>([]);
  function toggleBonus(id: UelBonusCategoryId) {
    setSelectedBonus((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }
  const bonusEligibility = calculateUelBonusEligibility(selectedBonus);

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'UEL', name: 'Trường Đại học Kinh tế - Luật – ĐHQG TP.HCM', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/uel`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ: {uelAdmissionMethods[0].name}</h2>
          <MethodCapabilitySummary method={uelAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            Thang điểm 100:{' '}
            <span className="font-mono text-ink">Điểm xét tuyển = Học lực + Điểm cộng + Điểm ưu tiên</span>. Điểm học
            lực (có đủ ĐGNL+THPT): <span className="font-mono text-ink">55%×ĐGNL + 35%×THPT + 10%×Học bạ</span> — nếu
            chỉ có THPT: <span className="font-mono text-ink">90%×THPT + 10%×Học bạ</span>; nếu chỉ có ĐGNL:{' '}
            <span className="font-mono text-ink">90%×ĐGNL + 10%×Học bạ</span>.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            <li>ĐGNL quy đổi thang 100 = điểm bài thi ĐGNL × 100/1200</li>
            <li>THPT quy đổi thang 100 = tổng 3 môn tổ hợp × 100/30</li>
            <li>
              Học bạ quy đổi thang 100 = tổng điểm trung bình 3 môn tổ hợp × 100/30, mỗi môn lấy trung bình cả năm
              lớp 10, 11, 12
            </li>
          </ul>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">UniscoreVN chưa tính được điểm xét tuyển chính xác cho UEL</p>
            <p className="mt-1 leading-relaxed">
              3 thành phần điểm học lực đã có công thức quy đổi rõ ràng, nhưng vẫn còn thiếu để ra một điểm cuối cùng
              đáng tin cậy:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {uelKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
            <p className="mt-2 leading-relaxed">
              Trong lúc chờ, bạn vẫn có thể kiểm tra ngưỡng đầu vào, xem mình đủ điều kiện được xét điểm cộng nhóm
              nào, tra điểm ưu tiên khu vực tham khảo, và xem điểm chuẩn/nguồn ở dưới.
            </p>
          </div>
        </section>

        <section id="dgnl" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Quy đổi điểm ĐGNL-HCM → thang 100 (điểm học lực)</h2>
          </div>
          <p className="mt-1 text-sm text-muted">Thang ĐGNL 0–1200. Áp dụng đúng công thức UEL công bố (×100/1200).</p>

          {usingProfileDgnlValue ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-accent/20 bg-accent/5 px-3 py-2 text-sm">
              <span className="text-ink">
                Đang dùng điểm ĐGNL từ hồ sơ của bạn: <strong>{profileDgnlTotal}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setDgnlInput(String(profileDgnlTotal));
                  setDgnlManualOverride(true);
                }}
                className="rounded-md px-2 py-1 text-xs font-medium text-accent underline-offset-2 hover:underline"
              >
                Thay đổi
              </button>
            </div>
          ) : (
            <div className="mt-3 max-w-xs">
              <input
                id="uel-dgnl-input"
                name="uel-dgnl-input"
                type="number"
                inputMode="decimal"
                min={0}
                max={1200}
                value={dgnlInput}
                onChange={(e) => handleManualDgnlChange(e.target.value)}
                placeholder="0 - 1200"
                aria-label="Điểm ĐGNL ĐHQG-HCM (thang 0-1200)"
                className="w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              />
              <SharedProfileNotice className="mt-1.5" />
              {dgnlComponentsClearedNotice && (
                <p className="mt-1.5 rounded-md bg-warning/10 px-2 py-1.5 text-xs text-warning">
                  Tổng điểm mới không khớp với điểm thành phần ĐGNL đã lưu trước đó. Các điểm thành
                  phần cũ đã được xóa khỏi hồ sơ dùng chung.
                </p>
              )}
              {profileDgnlTotal !== undefined && (
                <button
                  type="button"
                  onClick={() => {
                    setDgnlManualOverride(false);
                    setDgnlInput('');
                    setDgnlComponentsClearedNotice(false);
                  }}
                  className="mt-1 text-xs font-medium text-accent underline-offset-2 hover:underline"
                >
                  Dùng lại điểm từ hồ sơ ({profileDgnlTotal})
                </button>
              )}
            </div>
          )}

          {dgnlScale100 !== undefined && (
            <p className="mt-2 text-sm text-ink">
              {dgnlScale100 === null ? (
                <span className="text-muted">Ngoài khoảng hợp lệ (0–1200).</span>
              ) : (
                <>
                  Điểm ĐGNL quy đổi thang 100: <strong className="text-primary">{dgnlScale100.toFixed(2)}</strong> / 100
                </>
              )}
            </p>
          )}
        </section>

        <section id="subject-combination" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Kiểm tra ngưỡng đầu vào</h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Chọn tổ hợp để UEL dùng lại điểm thi THPT thật đã lưu trong hồ sơ. Nếu chưa chọn tổ hợp, bạn vẫn có thể nhập
            tổng 3 môn để kiểm tra nhanh.
          </p>
          <div className="mt-3 max-w-xs">
            <label htmlFor="uel-combination-select" className="text-xs font-medium text-ink">
              Tổ hợp xét tuyển
            </label>
            <select
              id="uel-combination-select"
              value={selectedCombinationId}
              onChange={(event) => {
                const nextCombinationId = event.target.value;
                setSelectedCombinationId(nextCombinationId);
                saveStoredUelCombinationId(nextCombinationId);
                setThptSubjectDrafts({});
              }}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="">Chưa chọn tổ hợp</option>
              {COMMON_SUBJECT_COMBINATIONS.map((combination) => (
                <option key={combination.id} value={combination.id}>
                  {combination.id} — {combination.subjects.map((subjectId) => SUBJECT_LABELS[subjectId]).join(', ')}
                </option>
              ))}
            </select>
          </div>

          {selectedCombination ? (
            <div className="mt-4">
              <div id="thpt" className="grid scroll-mt-5 gap-3 sm:grid-cols-3">
                {selectedCombination.subjects.map((subjectId) => {
                  const sourceLabel = getThptSubjectSourceLabel(subjectId);
                  const hasValue = getEffectiveThptSubjectScore(subjectId) !== undefined;
                  return (
                    <label key={subjectId} className="block rounded-lg border border-ink/10 bg-surface p-3">
                      <span className="text-xs font-medium text-ink">{SUBJECT_LABELS[subjectId]}</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={10}
                        value={getEffectiveThptSubjectInput(subjectId)}
                        onChange={(event) => handleThptSubjectChange(subjectId, event.target.value)}
                        placeholder="0 - 10"
                        aria-label={`Điểm thi THPT môn ${SUBJECT_LABELS[subjectId]}`}
                        className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                      />
                      <span className={`mt-1 block text-xs ${hasValue ? 'text-success' : 'text-muted'}`}>{sourceLabel}</span>
                    </label>
                  );
                })}
              </div>
              <SharedProfileNotice className="mt-2" />
              {missingThptSubjects.length > 0 ? (
                <p className="mt-2 text-xs text-muted">
                  Còn thiếu {missingThptSubjects.map((subjectId) => SUBJECT_LABELS[subjectId]).join(', ')} để tính tổng
                  THPT theo tổ hợp {selectedCombination.id}.
                </p>
              ) : (
                <p className="mt-2 text-sm text-ink">
                  Tổng 3 môn THPT theo {selectedCombination.id}:{' '}
                  <strong className="text-primary">{thptRawTotalFromSubjects?.toFixed(2)}</strong> / 30
                </p>
              )}
            </div>
          ) : (
            <div className="mt-3 max-w-xs">
              <label htmlFor="uel-thpt-raw-input" className="text-xs font-medium text-ink">
                Tổng 3 môn THPT
              </label>
              <input
                id="uel-thpt-raw-input"
                name="uel-thpt-raw-input"
                type="number"
                inputMode="decimal"
                min={0}
                max={30}
                value={manualThptRaw}
                onChange={(e) => setManualThptRaw(e.target.value)}
                placeholder="0 - 30"
                aria-label="Tổng điểm 3 môn thi tốt nghiệp THPT theo tổ hợp xét tuyển (thang 30)"
                className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              />
            </div>
          )}

          {thptResult && thptRawForThreshold !== undefined && missingThptSubjects.length === 0 && (
            <div>
              <p className="mt-2 text-xs text-muted">Quy đổi thang 100: {((thptRawForThreshold * 100) / 30).toFixed(2)}</p>
              <p className={`mt-2 flex items-start gap-1.5 text-sm ${thptResult.pass ? 'text-success' : 'text-muted'}`}>
                {thptResult.pass ? (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                ) : (
                  <XCircle size={16} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
                )}
                <span>
                  {thptResult.requiredText}
                  {thptResult.pass ? ' — đạt' : ' — chưa đạt'}
                </span>
              </p>
            </div>
          )}
        </section>

        <section id="programs" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Điều kiện được xét điểm cộng</h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Tổng điểm cộng theo quy định không vượt quá {UEL_BONUS_OVERALL_CAP}/100. Chứng chỉ ngoại ngữ quốc tế cũng
            có điểm cộng nhưng bảng chi tiết chưa đọc được — chưa đưa vào đây.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {UEL_BONUS_CATEGORIES.map((category) => {
              const checked = selectedBonus.includes(category.id);
              return (
                <label
                  key={category.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                    checked ? 'border-accent/40 bg-accent/10' : 'border-ink/10 bg-surface hover:bg-ink/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBonus(category.id)}
                    className="mt-0.5 size-4 shrink-0 accent-accent"
                  />
                  <span>
                    <span className="flex items-center gap-2">
                      <span className={`font-medium ${checked ? 'text-primary' : 'text-ink'}`}>{category.label}</span>
                      <span className="text-xs text-muted">tối đa {category.maxPoints}</span>
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">{category.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {bonusEligibility.eligibleCategories.length > 0 && (
            <p className="mt-3 text-xs text-muted">
              Bạn thuộc {bonusEligibility.eligibleCategories.length} nhóm có thể được xét — UniscoreVN chưa xác định số
              điểm thực nhận.
            </p>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Điểm ưu tiên khu vực</h2>
          <p className="mt-1 text-xs text-muted">
            Thang 100. Khi tổng điểm học lực + điểm cộng ≥ 75/100, điểm ưu tiên giảm dần theo công thức chính thức
            UEL — dùng công cụ bên dưới nếu bạn đã biết 2 con số đó.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div className="rounded-lg bg-surface p-3">
              <div className="text-xs text-muted">KV1</div>
              <div className="font-medium text-ink">{UEL_PRIORITY_BY_ZONE_SCALE_100.kv1}</div>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <div className="text-xs text-muted">KV2-NT</div>
              <div className="font-medium text-ink">{UEL_PRIORITY_BY_ZONE_SCALE_100.kv2Nt}</div>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <div className="text-xs text-muted">KV2</div>
              <div className="font-medium text-ink">{UEL_PRIORITY_BY_ZONE_SCALE_100.kv2}</div>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <div className="text-xs text-muted">KV3</div>
              <div className="font-medium text-ink">{UEL_PRIORITY_BY_ZONE_SCALE_100.kv3}</div>
            </div>
          </div>

          <details className="mt-4 rounded-md border border-ink/10 bg-surface p-3">
            <summary className="cursor-pointer text-sm font-medium text-ink">
              Đã biết điểm học lực + điểm cộng? Tính điểm ưu tiên thực nhận (nâng cao)
            </summary>
            <p className="mt-2 text-xs text-muted">
              Công thức chính thức UEL: (100 − Điểm học lực − Điểm cộng) / 25 × Điểm ưu tiên chuẩn, áp dụng khi tổng
              điểm học lực + điểm cộng ≥ 75/100. UniscoreVN không tự tính điểm học lực/điểm cộng cho bạn — nhập tay 2
              số bạn đã biết.
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div className="max-w-[180px]">
                <label htmlFor="uel-academic-plus-bonus-input" className="text-xs font-medium text-ink">
                  Điểm học lực + điểm cộng
                </label>
                <input
                  id="uel-academic-plus-bonus-input"
                  name="uel-academic-plus-bonus-input"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  value={academicPlusBonusInput}
                  onChange={(e) => setAcademicPlusBonusInput(e.target.value)}
                  placeholder="0 - 100"
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                />
              </div>
              <div className="max-w-[180px]">
                <label htmlFor="uel-standard-priority-input" className="text-xs font-medium text-ink">
                  Điểm ưu tiên chuẩn (chưa giảm)
                </label>
                <input
                  id="uel-standard-priority-input"
                  name="uel-standard-priority-input"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={standardPriorityInput}
                  onChange={(e) => setStandardPriorityInput(e.target.value)}
                  placeholder="vd 0.75"
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                />
              </div>
            </div>
            {priorityReductionResult && (
              <p className="mt-3 text-sm text-ink">
                Điểm ưu tiên thực nhận: <strong className="text-primary">{priorityReductionResult.effectivePriority}</strong>
                {priorityReductionResult.reduced ? ' (đã giảm theo quy tắc trên)' : ' (chưa tới ngưỡng giảm)'}
              </p>
            )}
          </details>
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Điểm chuẩn trúng tuyển {YEAR} (38 ngành/chuyên ngành)</h2>
          </div>
          <p className="mt-1 text-xs text-muted">Thang 100, đã bao gồm điểm cộng và điểm ưu tiên — theo đúng công bố gốc.</p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <caption className="sr-only">Điểm chuẩn trúng tuyển UEL {YEAR}</caption>
              <thead>
                <tr className="text-left text-xs font-medium text-muted">
                  <th scope="col" className="py-2 pr-3">
                    Ngành/chuyên ngành
                  </th>
                  <th scope="col" className="py-2 pr-3">
                    Mã
                  </th>
                  <th scope="col" className="py-2">
                    Điểm chuẩn
                  </th>
                </tr>
              </thead>
              <tbody>
                {uelPrograms.map((program) => {
                  const cutoff = cutoffsByProgram.get(program.id);
                  return (
                    <tr key={program.id} className="border-t border-ink/5">
                      <td className="py-2.5 pr-3 text-ink">{program.name}</td>
                      <td className="py-2.5 pr-3 text-muted">{program.code}</td>
                      <td className="py-2.5 font-medium text-ink">
                        {cutoff ? cutoff.score.toFixed(2) : <span className="font-normal text-muted">Chưa công bố</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {uelSources.map((source) => (
              <li key={source.id}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline-offset-2 hover:underline"
                >
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
