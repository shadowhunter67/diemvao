import { useMemo, useState } from 'react';
import { useApplicantProfile } from '../core/applicantProfileContextCore';
import { summarizeApplicantProfile } from '../core/applicantProfileSummary';
import { COMMON_SUBJECT_COMBINATIONS } from '../core/subjects';
import { evaluateApplicantAcrossSchools } from '../compare/evaluateApplicantAcrossSchools';
import { evaluationSortWeight, getEvaluationDisplayStatus } from '../compare/evaluationDisplay';
import { loadStoredProgramSelections, saveStoredProgramId } from '../compare/programSelectionStorage';
import { hcmutPrograms } from '../schools/hcmut/data/programs';
import { loadStoredHcmutMethodContext } from '../schools/hcmut/comparisonContextStorage';
import { uelPrograms } from '../schools/uel/data/programs';
import { loadStoredUelCombinationId, saveStoredUelCombinationId } from '../schools/uel/comparisonContextStorage';
import { uehPrograms } from '../schools/ueh/data/programs';
import { uitPrograms } from '../schools/uit/data/programs';
import { usshPrograms } from '../schools/ussh/data/programs';
import { hcmusProgramThresholds } from '../schools/hcmus/data/programThresholds';
import { UHS_PROGRAMS } from '../schools/uhs/programs';
import { ComparisonOverview } from './compare/ComparisonOverview';
import { SchoolComparisonCard } from './compare/SchoolComparisonCard';
import type { ProgramOption } from './compare/types';

interface MultiSchoolComparisonPageProps {
  onBackHome: () => void;
  onOpenSchool: (schoolId: string) => void;
}

// USSH: re-audit 2026-08-13/14 đã có program registry thật (54 chương trình, 3 track) — map sang
// ProgramOption. Chọn ngành ở đây CHỈ để hiển thị ngữ cảnh + (tương lai) cutoff — evaluation vẫn
// confidence='partial' nên card không tự tính "gap" (đúng Phần R: partial thì không so cutoff).
const usshProgramOptions: ProgramOption[] = usshPrograms.map((p) => ({ id: p.id, code: p.code, name: p.name }));
const hcmusProgramOptions: ProgramOption[] = hcmusProgramThresholds.map((program) => ({
  id: program.id,
  code: program.code,
  name: program.name,
}));
const uhsProgramOptions: ProgramOption[] = UHS_PROGRAMS.map((program) => ({
  id: program.id,
  code: program.code,
  name: program.name,
}));

const programOptions: Record<string, readonly ProgramOption[]> = {
  hcmut: hcmutPrograms,
  ueh: uehPrograms,
  uel: uelPrograms,
  uit: uitPrograms,
  ussh: usshProgramOptions,
  hcmus: hcmusProgramOptions,
  uhs: uhsProgramOptions,
  iu: [],
};

function parseNumber(value: string): number | undefined {
  if (value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function MultiSchoolComparisonPage({ onBackHome, onOpenSchool }: MultiSchoolComparisonPageProps) {
  const { profile } = useApplicantProfile();
  const profileSummary = summarizeApplicantProfile(profile);
  const storedHcmutContext = useMemo(loadStoredHcmutMethodContext, []);
  const [hcmutCombinationId, setHcmutCombinationId] = useState(storedHcmutContext?.combination.id ?? '');
  const [uelCombinationId, setUelCombinationId] = useState(loadStoredUelCombinationId);
  // HCMUS/USSH/UHS/IU đều chỉ cần "tổ hợp THPT" (không có UI riêng từng trường trong /compare) —
  // dùng chung 1 selector, không lưu localStorage riêng (khác HCMUT/UEL đã có contextStorage).
  const [sharedCombinationId, setSharedCombinationId] = useState('');
  const [hcmutReward, setHcmutReward] = useState(storedHcmutContext ? String(storedHcmutContext.bonus.reward) : '');
  const [hcmutConsiderationReward, setHcmutConsiderationReward] = useState(
    storedHcmutContext ? String(storedHcmutContext.bonus.considerationReward) : ''
  );
  const [hcmutEncouragement, setHcmutEncouragement] = useState(storedHcmutContext ? String(storedHcmutContext.bonus.encouragement) : '');
  const [hcmutPriority, setHcmutPriority] = useState(storedHcmutContext ? String(storedHcmutContext.priorityRaw30Scale) : '');
  const [selectedPrograms, setSelectedPrograms] = useState<Partial<Record<string, string>>>(loadStoredProgramSelections);

  const hcmutCombination = COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === hcmutCombinationId);
  const uelCombination = COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === uelCombinationId);
  const sharedCombination = COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === sharedCombinationId);
  const selectedUhsProgram = UHS_PROGRAMS.find((program) => program.id === selectedPrograms.uhs);
  const hcmutContext = useMemo(() => {
    const reward = parseNumber(hcmutReward);
    const considerationReward = parseNumber(hcmutConsiderationReward);
    const encouragement = parseNumber(hcmutEncouragement);
    const priorityRaw30Scale = parseNumber(hcmutPriority);
    if (!hcmutCombination || reward === undefined || considerationReward === undefined || encouragement === undefined || priorityRaw30Scale === undefined) {
      return undefined;
    }
    return {
      combination: hcmutCombination,
      bonus: { reward, considerationReward, encouragement },
      priorityRaw30Scale,
    };
  }, [hcmutCombination, hcmutConsiderationReward, hcmutEncouragement, hcmutPriority, hcmutReward]);

  const summaries = useMemo(() => {
    return evaluateApplicantAcrossSchools(profile, {
      hcmut: { methodContext: hcmutContext, selectedProgramId: selectedPrograms.hcmut },
      uel: {
        subjectContext: uelCombination ? { combinationId: uelCombination.id, subjects: uelCombination.subjects } : undefined,
        selectedProgramId: selectedPrograms.uel,
      },
      ueh: { selectedProgramId: selectedPrograms.ueh },
      uit: { selectedProgramId: selectedPrograms.uit, programId: selectedPrograms.uit },
      hcmus: {
        subjectContext: sharedCombination ? { combinationId: sharedCombination.id, subjects: sharedCombination.subjects } : undefined,
        selectedProgramId: selectedPrograms.hcmus,
      },
      ussh: { subjectContext: sharedCombination ? { combinationId: sharedCombination.id, subjects: sharedCombination.subjects } : undefined },
      uhs: {
        selectedProgramId: selectedPrograms.uhs,
        subjectContext:
          sharedCombination && (!selectedUhsProgram || selectedUhsProgram.combinations.includes(sharedCombination.id))
            ? { combinationId: sharedCombination.id, subjects: sharedCombination.subjects }
            : undefined,
      },
      iu: { subjectContext: sharedCombination ? { combinationId: sharedCombination.id, subjects: sharedCombination.subjects } : undefined },
    }).sort((a, b) => {
      const statusA = getEvaluationDisplayStatus(a.evaluation.confidence);
      const statusB = getEvaluationDisplayStatus(b.evaluation.confidence);
      return evaluationSortWeight(statusA) - evaluationSortWeight(statusB) || a.shortName.localeCompare(b.shortName, 'vi');
    });
  }, [hcmutContext, profile, selectedPrograms, selectedUhsProgram, sharedCombination, uelCombination]);

  const statusCounts = useMemo(
    () =>
      summaries.reduce(
        (counts, summary) => {
          counts[getEvaluationDisplayStatus(summary.evaluation.confidence)] += 1;
          return counts;
        },
        { exact: 0, partial: 0, unavailable: 0 }
      ),
    [summaries]
  );

  function setSelectedProgram(schoolId: string, programId: string) {
    setSelectedPrograms((current) => ({ ...current, [schoolId]: programId || undefined }));
    saveStoredProgramId(schoolId, programId);
  }

  if (!profileSummary.hasData) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <button type="button" onClick={onBackHome} className="text-xs font-medium text-accent underline-offset-2 hover:underline">
          Về trang chủ
        </button>
        <section className="mt-6 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h1 className="text-2xl font-bold text-ink">Chưa có dữ liệu điểm trong hồ sơ</h1>
          <p className="mt-2 text-sm text-muted">
            Hãy nhập điểm ở HCMUT, UEH hoặc UEL trước. UniscoreVN sẽ không hiển thị giá trị 0 giả.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['hcmut', 'ueh', 'uel'].map((schoolId) => (
              <button
                key={schoolId}
                type="button"
                onClick={() => onOpenSchool(schoolId)}
                className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
              >
                Mở {schoolId.toUpperCase()}
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <button type="button" onClick={onBackHome} className="text-xs font-medium text-accent underline-offset-2 hover:underline">
        Về trang chủ
      </button>

      <ComparisonOverview statusCounts={statusCounts} profileSummary={profileSummary} />

      <section className="mt-5 grid gap-3 rounded-card bg-surface-soft p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-medium text-ink">
          HCMUT tổ hợp
          <select value={hcmutCombinationId} onChange={(event) => setHcmutCombinationId(event.target.value)} className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2">
            <option value="">Chưa chọn</option>
            {COMMON_SUBJECT_COMBINATIONS.map((combination) => (
              <option key={combination.id} value={combination.id}>
                {combination.id}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-ink">
          UEL tổ hợp
          <select
            value={uelCombinationId}
            onChange={(event) => {
              setUelCombinationId(event.target.value);
              saveStoredUelCombinationId(event.target.value);
            }}
            className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2"
          >
            <option value="">Chưa chọn</option>
            {COMMON_SUBJECT_COMBINATIONS.map((combination) => (
              <option key={combination.id} value={combination.id}>
                {combination.id}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-ink">
          Tổ hợp (HCMUS/USSH/UHS/IU)
          <select
            value={sharedCombinationId}
            onChange={(event) => setSharedCombinationId(event.target.value)}
            className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2"
          >
            <option value="">Chưa chọn</option>
            {COMMON_SUBJECT_COMBINATIONS.map((combination) => (
              <option key={combination.id} value={combination.id}>
                {combination.id}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-ink">
          HCMUT điểm ưu tiên thang 30
          <input value={hcmutPriority} onChange={(event) => setHcmutPriority(event.target.value)} type="number" inputMode="decimal" placeholder="vd 0" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2" />
        </label>
        <div className="grid grid-cols-3 gap-2">
          <label className="text-xs font-medium text-ink">
            Thưởng
            <input value={hcmutReward} onChange={(event) => setHcmutReward(event.target.value)} type="number" inputMode="decimal" placeholder="0" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-2 py-2" />
          </label>
          <label className="text-xs font-medium text-ink">
            Xét thưởng
            <input value={hcmutConsiderationReward} onChange={(event) => setHcmutConsiderationReward(event.target.value)} type="number" inputMode="decimal" placeholder="0" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-2 py-2" />
          </label>
          <label className="text-xs font-medium text-ink">
            Khuyến khích
            <input value={hcmutEncouragement} onChange={(event) => setHcmutEncouragement(event.target.value)} type="number" inputMode="decimal" placeholder="0" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-2 py-2" />
          </label>
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-2">
        {summaries.map((summary) => (
          <SchoolComparisonCard
            key={summary.schoolId}
            summary={summary}
            selectedProgramId={selectedPrograms[summary.schoolId]}
            options={programOptions[summary.schoolId]}
            combinationId={
              summary.schoolId === 'hcmut'
                ? hcmutCombinationId || undefined
                : summary.schoolId === 'uel'
                  ? uelCombinationId || undefined
                  : ['hcmus', 'ussh', 'uhs', 'iu'].includes(summary.schoolId)
                    ? sharedCombinationId || undefined
                    : undefined
            }
            onSelectProgram={setSelectedProgram}
            onOpenSchool={onOpenSchool}
          />
        ))}
      </section>
    </div>
  );
}
