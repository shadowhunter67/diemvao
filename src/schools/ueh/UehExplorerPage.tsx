import { useMemo, useState } from 'react';
import { ArrowRightLeft, Calculator, GraduationCap, ShieldCheck } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { uehPrograms } from './data/programs';
import { uehCutoffs } from './data/cutoffs';
import { uehSources } from './sources';
import { convertDgnlToThpt } from './dgnlConversion';
import { checkUehThreshold, UEH_THRESHOLD_HCMC, UEH_THRESHOLD_MEKONG } from './eligibility';
import { buildUehEvaluationInput } from './applicantProfileAdapter';
import { uehAdmissionMethods } from './methods';
import { evaluateUehExactAdmission } from './evaluate';
import { UEH_BONUS_DOMESTIC } from './bonus';
import {
  UEH_PRIORITY_OBJECT_LABELS,
  UEH_PRIORITY_ZONE_LABELS,
  type UehPriorityObjectGroup,
  type UehPriorityZone,
} from './priority';
import { UEH_EXACT_CALCULATOR_SCOPE_NOTE } from './scopeNotes';

interface UehExplorerPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/**
 * UEH Admission Explorer — research 2026-08-11 (xem docs/admission-research-2026.md). Khác UIT/
 * UEL: có bảng quy đổi ĐGNL→THPT ĐẦY ĐỦ (12 khoảng, verified, không phải ảnh) nên implement luôn
 * `convertDgnlToThpt` như một tool thật (scoreConversion capability). Vẫn KHÔNG có exact
 * calculator: bước quy đổi cuối cùng từ (điểm thi thang 30 + học bạ) sang điểm xét thang 100
 * không đủ rõ trong nguồn đã đọc, và bảng điểm cộng/ưu tiên chưa xác nhận — sai 1 trong 2 vẫn ra
 * điểm cuối sai.
 */
export function UehExplorerPage({ onChangeSchool }: UehExplorerPageProps) {
  const ksaPrograms = uehPrograms.filter((p) => p.campus === 'hcmc');
  const ksvPrograms = uehPrograms.filter((p) => p.campus === 'mekong');
  const cutoffsByProgram = new Map(uehCutoffs.map((c) => [c.programId, c]));

  const { profile, updateVactTotal } = useApplicantProfile();
  const profileDgnlTotal = buildUehEvaluationInput(profile).dgnlScore;

  // Calculator chính xác — Đối tượng 1. Điểm thi thang 30 có thể lấy từ quy đổi ĐGNL (dùng lại
  // profileDgnlTotal/dgnlInput bên dưới) hoặc nhập trực tiếp.
  const [examSource, setExamSource] = useState<'dgnl' | 'direct'>('dgnl');
  const [directExamInput, setDirectExamInput] = useState('');
  const [gpa10Input, setGpa10Input] = useState('');
  const [gpa11Input, setGpa11Input] = useState('');
  const [gpa12Input, setGpa12Input] = useState('');
  const [selectedBonusIds, setSelectedBonusIds] = useState<string[]>([]);
  const [priorityZone, setPriorityZone] = useState<UehPriorityZone>('kv3');
  const [priorityObjectGroup, setPriorityObjectGroup] = useState<UehPriorityObjectGroup>('none');
  const [calcCampus, setCalcCampus] = useState<'hcmc' | 'mekong'>('hcmc');

  function toggleBonus(id: string) {
    setSelectedBonusIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  // Batch 4 workstream K: nếu hồ sơ dùng chung đã có điểm ĐGNL thô (vd nhập ở HCMUT trước đó),
  // ưu tiên dùng luôn — không bắt nhập lại. `manualOverride` cho phép người dùng chủ động thay
  // bằng số khác (vd hồ sơ chưa cập nhật, hoặc user chỉ muốn thử một con số khác).
  const [manualOverride, setManualOverride] = useState(false);
  const [dgnlInput, setDgnlInput] = useState('');
  const usingProfileValue = !manualOverride && profileDgnlTotal !== undefined;
  const effectiveDgnlRaw = usingProfileValue ? String(profileDgnlTotal) : dgnlInput;
  const dgnlResult = effectiveDgnlRaw.trim() !== '' ? convertDgnlToThpt(Number(effectiveDgnlRaw)) : undefined;
  // Batch 5, workstream G/J: hiện rõ khi ghi ngược làm mất điểm thành phần ĐGNL đã lưu (thay vì âm
  // thầm xóa) — chỉ đọng lại 1 lượt gần nhất để không gây noise (không phải toast/modal riêng).
  const [componentsClearedNotice, setComponentsClearedNotice] = useState(false);

  // Workstream L (batch 4) + C (batch 5): user tự sửa điểm ĐGNL ở đây (không phải giá trị hồ sơ có
  // sẵn) → coi là fact mới về CÙNG kỳ thi ĐGNL, ghi ngược vào profile dùng chung qua
  // `updateVactTotal` (đi qua `reconcileVactFromTotal`, KHÔNG tự gán field rời rạc — batch 5,
  // workstream D). Nếu số mới không khớp components cũ (vd HCMUT từng nhập chi tiết), components
  // bị xóa khỏi hồ sơ dùng chung thay vì giữ 2 fact mâu thuẫn âm thầm — hiện rõ cho user.
  // TUYỆT ĐỐI không ghi `dgnlResult` (điểm đã quy đổi ra thang THPT) — chỉ ghi lại đúng con số thô
  // người dùng nhập.
  function handleManualDgnlChange(value: string) {
    setDgnlInput(value);
    const parsed = value.trim() !== '' ? Number(value) : NaN;
    if (!Number.isNaN(parsed)) {
      const { componentsCleared } = updateVactTotal(parsed, 'user-total-input');
      // "Sticky" trong cả phiên sửa: gõ "1050" từng ký tự có thể clear components ở ký tự ĐẦU
      // TIÊN rồi các ký tự sau không còn gì để clear nữa (trả về false) — không được để thông báo
      // biến mất giữa chừng chỉ vì vậy, user cần thấy rõ đã xảy ra xóa dữ liệu trong lượt sửa này.
      setComponentsClearedNotice((prev) => prev || componentsCleared);
    } else {
      setComponentsClearedNotice(false);
    }
  }

  const [thresholdInput, setThresholdInput] = useState('');
  const [campus, setCampus] = useState<'hcmc' | 'mekong'>('hcmc');
  const thresholdResult = thresholdInput.trim() !== '' ? checkUehThreshold(Number(thresholdInput), campus) : null;

  const examScore30 = useMemo(() => {
    if (examSource === 'dgnl') {
      return dgnlResult !== undefined && dgnlResult !== null ? dgnlResult : undefined;
    }
    return directExamInput.trim() !== '' ? Number(directExamInput) : undefined;
  }, [examSource, dgnlResult, directExamInput]);

  const gpaGrade10 = gpa10Input.trim() !== '' ? Number(gpa10Input) : undefined;
  const gpaGrade11 = gpa11Input.trim() !== '' ? Number(gpa11Input) : undefined;
  const gpaGrade12 = gpa12Input.trim() !== '' ? Number(gpa12Input) : undefined;

  const calculatorEvaluation = useMemo(
    () =>
      evaluateUehExactAdmission({
        examScore30,
        gpaGrade10,
        gpaGrade11,
        gpaGrade12,
        bonusIds: selectedBonusIds,
        priorityZone,
        priorityObjectGroup,
        campus: calcCampus,
      }),
    [examScore30, gpaGrade10, gpaGrade11, gpaGrade12, selectedBonusIds, priorityZone, priorityObjectGroup, calcCampus]
  );

  function renderCutoffTable(programs: typeof ksaPrograms, caption: string) {
    return (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="text-left text-xs font-medium text-muted">
              <th scope="col" className="py-2 pr-3">
                Ngành/chương trình
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
            {programs.map((program) => {
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
    );
  }

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'UEH', name: 'Trường Đại học Kinh tế TP.HCM', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/ueh`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ: {uehAdmissionMethods[0].name}</h2>
          <MethodCapabilitySummary method={uehAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            Thang điểm 100:{' '}
            <span className="font-mono text-ink">Điểm xét = 60%×Điểm thi (quy đổi) + 40%×Điểm học bạ (quy đổi)</span>.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            <li>
              Điểm thi: nếu dùng ĐGNL-HCM hoặc V-SAT thì quy đổi sang thang điểm thi tốt nghiệp THPT (thang 30) theo
              bảng 12 khoảng chính thức — xem công cụ quy đổi bên dưới.
            </li>
            <li>
              Điểm học bạ ={' '}
              <span className="font-mono text-ink">(ĐTB lớp 10×1 + ĐTB lớp 11×2 + ĐTB lớp 12×3) / 6</span>.
            </li>
          </ul>
        </section>

        <section id="calculator" className="mt-5 scroll-mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Tính điểm xét tuyển</h2>
          </div>
          <p className="mt-1 text-sm text-muted">{UEH_EXACT_CALCULATOR_SCOPE_NOTE}</p>

          <fieldset className="mt-4">
            <legend className="text-xs font-medium text-ink">Nguồn điểm thi (thang 30)</legend>
            <div className="mt-1.5 flex flex-wrap gap-3 text-sm">
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={examSource === 'dgnl'} onChange={() => setExamSource('dgnl')} />
                Quy đổi từ ĐGNL-HCM (xem bên dưới)
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={examSource === 'direct'} onChange={() => setExamSource('direct')} />
                Nhập trực tiếp điểm thi tổ hợp (thang 30)
              </label>
            </div>
            {examSource === 'direct' && (
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={30}
                value={directExamInput}
                onChange={(e) => setDirectExamInput(e.target.value)}
                placeholder="0 - 30"
                aria-label="Điểm thi tốt nghiệp THPT tổ hợp (thang 30)"
                className="mt-2 w-full max-w-xs rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              />
            )}
            {examSource === 'dgnl' && (
              <p className="mt-1.5 text-xs text-muted">
                Dùng kết quả quy đổi ở mục "Quy đổi điểm ĐGNL-HCM → thang THPT" bên dưới.
              </p>
            )}
          </fieldset>

          <fieldset className="mt-4">
            <legend className="text-xs font-medium text-ink">Điểm trung bình các năm học THPT (thang 10)</legend>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {[
                { label: 'Lớp 10', value: gpa10Input, set: setGpa10Input },
                { label: 'Lớp 11', value: gpa11Input, set: setGpa11Input },
                { label: 'Lớp 12', value: gpa12Input, set: setGpa12Input },
              ].map(({ label, value, set }) => (
                <label key={label} className="text-xs text-muted">
                  {label}
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={10}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder="0 - 10"
                    aria-label={`Điểm trung bình ${label}`}
                    className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend className="text-xs font-medium text-ink">Điểm cộng (Đối tượng 1 — THPT Việt Nam)</legend>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {UEH_BONUS_DOMESTIC.map((option) => (
                <label key={option.id} className="flex items-start gap-2 text-xs text-ink">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={selectedBonusIds.includes(option.id)}
                    onChange={() => toggleBonus(option.id)}
                  />
                  <span>
                    {option.label} <span className="text-muted">(+{option.points})</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend className="text-xs font-medium text-ink">Điểm ưu tiên khu vực/đối tượng</legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <select
                value={priorityZone}
                onChange={(e) => setPriorityZone(e.target.value as UehPriorityZone)}
                aria-label="Khu vực ưu tiên"
                className="rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                {Object.entries(UEH_PRIORITY_ZONE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={priorityObjectGroup}
                onChange={(e) => setPriorityObjectGroup(e.target.value as UehPriorityObjectGroup)}
                aria-label="Đối tượng ưu tiên chính sách"
                className="rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                {Object.entries(UEH_PRIORITY_OBJECT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend className="text-xs font-medium text-ink">Cơ sở xét tuyển</legend>
            <select
              value={calcCampus}
              onChange={(e) => setCalcCampus(e.target.value as 'hcmc' | 'mekong')}
              aria-label="Cơ sở UEH"
              className="mt-1.5 rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="hcmc">TP.HCM (KSA)</option>
              <option value="mekong">UEH Mekong – Vĩnh Long (KSV)</option>
            </select>
          </fieldset>

          <div className="mt-5 rounded-2xl bg-surface-soft p-4">
            {calculatorEvaluation.confidence === 'exact-verified' && calculatorEvaluation.score ? (
              <>
                <p className="text-sm text-ink">
                  Điểm xét tuyển: <strong className="text-primary text-lg">{calculatorEvaluation.score.value.toFixed(2)}</strong>{' '}
                  / {calculatorEvaluation.score.scale}
                </p>
                <p className={`mt-1 text-sm ${calculatorEvaluation.eligibility?.status === 'eligible' ? 'text-success' : 'text-danger'}`}>
                  {calculatorEvaluation.eligibility?.reasons[0]} —{' '}
                  {calculatorEvaluation.eligibility?.status === 'eligible' ? 'đạt ngưỡng đầu vào' : 'chưa đạt ngưỡng đầu vào'}
                </p>
                <details className="mt-3 rounded-md border border-ink/10 bg-surface p-3">
                  <summary className="cursor-pointer text-xs font-medium text-ink">Xem cách tính chi tiết</summary>
                  <ol className="mt-2 space-y-1.5 text-xs text-muted">
                    {calculatorEvaluation.explanation.map((step, index) => (
                      <li key={step.id}>
                        <span className="font-medium text-ink">
                          {index + 1}. {step.label}
                        </span>
                        {step.output !== undefined && (
                          <span className="text-ink">
                            : {step.output.toFixed(2)}
                            {step.scale !== undefined ? ` / ${step.scale}` : ''}
                          </span>
                        )}
                        {step.formula && <p className="font-mono">{step.formula}</p>}
                      </li>
                    ))}
                  </ol>
                </details>
              </>
            ) : (
              <p className="text-sm text-muted">
                Nhập đủ điểm thi và điểm trung bình 3 năm học để xem điểm xét tuyển.
                {calculatorEvaluation.missingInputs.length > 0 && (
                  <>
                    {' '}
                    Còn thiếu: {calculatorEvaluation.missingInputs.join('; ')}
                  </>
                )}
              </p>
            )}
          </div>
        </section>

        <section id="dgnl" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Quy đổi điểm ĐGNL-HCM → thang THPT</h2>
          </div>
          <p className="mt-1 text-sm text-muted">Thang ĐGNL 450–1200. Áp dụng đúng bảng 12 khoảng UEH công bố.</p>

          {usingProfileValue ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-accent/20 bg-accent/5 px-3 py-2 text-sm">
              <span className="text-ink">
                Đã dùng điểm ĐGNL từ hồ sơ của bạn: <strong>{profileDgnlTotal}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setDgnlInput(String(profileDgnlTotal));
                  setManualOverride(true);
                }}
                className="rounded-md px-2 py-1 text-xs font-medium text-accent underline-offset-2 hover:underline"
              >
                Thay đổi
              </button>
            </div>
          ) : (
            <div className="mt-3 max-w-xs">
              <input
                id="ueh-dgnl-input"
                name="ueh-dgnl-input"
                type="number"
                inputMode="decimal"
                min={450}
                max={1200}
                value={dgnlInput}
                onChange={(e) => handleManualDgnlChange(e.target.value)}
                placeholder="450 - 1200"
                aria-label="Điểm ĐGNL ĐHQG-HCM (thang 450-1200)"
                className="w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              />
              <SharedProfileNotice className="mt-1.5" />
              {componentsClearedNotice && (
                <p className="mt-1.5 rounded-md bg-warning/10 px-2 py-1.5 text-xs text-warning">
                  Tổng điểm mới không khớp với điểm thành phần ĐGNL đã lưu trước đó. Các điểm thành
                  phần cũ đã được xóa khỏi hồ sơ dùng chung.
                </p>
              )}
              {profileDgnlTotal !== undefined && (
                <button
                  type="button"
                  onClick={() => {
                    setManualOverride(false);
                    setDgnlInput('');
                    setComponentsClearedNotice(false);
                  }}
                  className="mt-1 text-xs font-medium text-accent underline-offset-2 hover:underline"
                >
                  Dùng lại điểm từ hồ sơ ({profileDgnlTotal})
                </button>
              )}
            </div>
          )}

          {dgnlResult !== undefined && (
            <p className="mt-2 text-sm text-ink">
              {dgnlResult === null ? (
                <span className="text-muted">Ngoài khoảng bảng công bố (450–1200).</span>
              ) : (
                <>
                  Điểm THPT tương đương:{' '}
                  <strong className="text-primary">{dgnlResult.toFixed(2)}</strong> / 30
                </>
              )}
            </p>
          )}
        </section>

        <section id="programs" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Ngưỡng đầu vào chính thức</h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Dùng công cụ "Tính điểm xét tuyển" phía trên để UniscoreVN tự so ngưỡng cho bạn. Ngưỡng chính thức
            (thang 100, chưa gồm ưu tiên/điểm cộng) là:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
            <li>TP.HCM (mã KSA): điểm xét tuyển thang 100 (chưa gồm ưu tiên/điểm cộng) ≥ <strong>{UEH_THRESHOLD_HCMC}</strong></li>
            <li>UEH Mekong – Vĩnh Long (mã KSV): ≥ <strong>{UEH_THRESHOLD_MEKONG}</strong></li>
          </ul>

          <details className="mt-4 rounded-md border border-ink/10 bg-surface p-3">
            <summary className="cursor-pointer text-sm font-medium text-ink">
              Đã tự có điểm xét tuyển từ nguồn khác? So sánh nhanh tại đây (nâng cao)
            </summary>
            <p className="mt-2 text-xs text-muted">
              Chỉ dùng khi bạn đã biết điểm xét tuyển thang 100 của mình (vd UEH đã công bố cho bạn) — UniscoreVN không
              tính giúp số này.
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div className="max-w-xs">
                <input
                  id="ueh-threshold-input"
                  name="ueh-threshold-input"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(e.target.value)}
                  placeholder="0 - 100"
                  aria-label="Điểm xét tuyển thang 100 của bạn"
                  className="w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                />
              </div>
              <select
                id="ueh-campus-select"
                name="ueh-campus-select"
                value={campus}
                onChange={(e) => setCampus(e.target.value as 'hcmc' | 'mekong')}
                aria-label="Cơ sở UEH"
                className="rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                <option value="hcmc">TP.HCM (KSA)</option>
                <option value="mekong">UEH Mekong – Vĩnh Long (KSV)</option>
              </select>
            </div>
            {thresholdResult && (
              <p className={`mt-2 text-sm ${thresholdResult.pass ? 'text-success' : 'text-muted'}`}>
                {thresholdResult.requiredText} — {thresholdResult.pass ? 'đạt' : 'chưa đạt'}
              </p>
            )}
          </details>
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Điểm chuẩn trúng tuyển {YEAR} — TP.HCM (KSA, {ksaPrograms.length} chương trình)</h2>
          </div>
          {renderCutoffTable(ksaPrograms, `Điểm chuẩn UEH KSA ${YEAR}`)}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Điểm chuẩn trúng tuyển {YEAR} — UEH Mekong (KSV, {ksvPrograms.length} chương trình)</h2>
          {renderCutoffTable(ksvPrograms, `Điểm chuẩn UEH KSV ${YEAR}`)}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {uehSources.map((source) => (
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
