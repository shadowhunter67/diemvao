import { useEffect, useMemo, useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { DashboardHero } from '../../components/DashboardHero';
import { CurrentScoreCard } from '../../components/CurrentScoreCard';
import { SelectedProgramCard } from '../../components/SelectedProgramCard';
import { StickySummaryBar } from '../../components/StickySummaryBar';
import { ApplicantTypeSection } from '../../components/ApplicantTypeSection';
import { DgnlSection, type DgnlInputMode } from '../../components/DgnlSection';
import { TranscriptSection } from '../../components/TranscriptSection';
import { ThptSection } from '../../components/ThptSection';
import { BonusPrioritySection } from '../../components/BonusPrioritySection';
import { TargetSection } from '../../components/TargetSection';
import { ProgramBufferCard } from '../../components/ProgramBufferCard';
import { ScenarioSimulator } from '../../components/ScenarioSimulator';
import { ProgramSection } from '../../components/ProgramSection';
import { ProgramHistoryCompare } from '../../components/ProgramHistoryCompare';
import { FormulaExplanation } from '../../components/FormulaExplanation';
import { getSchoolStorageKey, readWithMigration } from '../../core/storage';
import { activeAdmissionConfig } from './config/admission-2026';
import { hcmutPrograms } from './data/programs';
import {
  calculateAdmissionScore,
  calculateAdmissionScoreNoDgnl,
  convertThptScore,
  convertTranscriptScore,
} from './calculator/calculator';
import {
  calculateAdmissionScoreFromWeightedDgnlRaw,
  calculateRequiredDgnl,
  calculateRequiredDgnlFromWeightedRaw,
} from './calculator/targetCalculator';
import {
  addProgramToComparison,
  calculateEffectiveTarget,
  calculateGap,
  getCutoffsForProgram,
  getLatestComparableCutoff,
  getProgramById,
  removeProgramFromComparison,
} from './programs';
import { validateAdmissionForm, validateRange, validateTargetScore, type AdmissionFormErrors } from './validation';
import {
  applySearchParamsToForm,
  parseApplicantTypeFromSearchParams,
  parseProgramStateFromSearchParams,
  parseTargetFromSearchParams,
  serializeApplicantTypeToSearchParams,
  serializeProgramStateToSearchParams,
  serializeStateToSearchParams,
} from './urlState';
import type { AdmissionInput } from './types/admission';
import { DEFAULT_APPLICANT_TYPE, SUPPORTED_APPLICANT_TYPES, type HcmutApplicantType } from './types/applicantType';
import {
  defaultAdmissionFormState,
  type AdmissionFormState,
  type BonusFormState,
  type DgnlFormState,
  type ThptFormState,
  type TranscriptFormState,
} from './types/form';

const SCHOOL_ID = 'hcmut';

const FORM_STORAGE_KEY = getSchoolStorageKey(SCHOOL_ID, 'input', 1);
const TARGET_STORAGE_KEY = getSchoolStorageKey(SCHOOL_ID, 'target', 1);
const PROGRAM_STORAGE_KEY = getSchoolStorageKey(SCHOOL_ID, 'program', 1);
const DGNL_MODE_STORAGE_KEY = getSchoolStorageKey(SCHOOL_ID, 'dgnl-mode', 1);
const APPLICANT_TYPE_STORAGE_KEY = getSchoolStorageKey(SCHOOL_ID, 'applicant-type', 1);

const FORM_LEGACY_KEYS = ['uniscore-input-v1', 'hcmut-score-input-v2'];
const TARGET_LEGACY_KEYS = ['uniscore-target-v1', 'hcmut-score-target-v1'];
const PROGRAM_LEGACY_KEYS = ['uniscore-program-v1', 'hcmut-score-program-v1'];
const DGNL_MODE_LEGACY_KEYS = ['uniscore-dgnl-mode-v1', 'hcmut-score-dgnl-mode-v1'];
const APPLICANT_TYPE_LEGACY_KEYS = ['uniscore-applicant-type-v1', 'hcmut-applicant-type-v1'];

interface DgnlModeState {
  mode: DgnlInputMode;
  totalRaw: string;
}

const defaultDgnlModeState: DgnlModeState = { mode: 'detail', totalRaw: '' };

interface ProgramState {
  selectedProgramId: string | null;
  buffer: number;
  comparisonProgramIds: string[];
}

const defaultProgramState: ProgramState = {
  selectedProgramId: null,
  buffer: 0,
  comparisonProgramIds: [],
};

function parseFormState(raw: string): AdmissionFormState | null {
  try {
    const parsed = JSON.parse(raw) as Partial<AdmissionFormState>;
    return {
      dgnl: { ...defaultAdmissionFormState.dgnl, ...parsed.dgnl },
      thpt: { ...defaultAdmissionFormState.thpt, ...parsed.thpt },
      transcript: {
        grade10: { ...defaultAdmissionFormState.transcript.grade10, ...parsed.transcript?.grade10 },
        grade11: { ...defaultAdmissionFormState.transcript.grade11, ...parsed.transcript?.grade11 },
        grade12: { ...defaultAdmissionFormState.transcript.grade12, ...parsed.transcript?.grade12 },
      },
      bonus: { ...defaultAdmissionFormState.bonus, ...parsed.bonus },
      priorityRaw30Scale: parsed.priorityRaw30Scale ?? defaultAdmissionFormState.priorityRaw30Scale,
    };
  } catch {
    return null;
  }
}

function loadStoredFormState(): AdmissionFormState {
  return readWithMigration(FORM_STORAGE_KEY, FORM_LEGACY_KEYS, parseFormState) ?? defaultAdmissionFormState;
}

function loadStoredTarget(): string {
  return readWithMigration(TARGET_STORAGE_KEY, TARGET_LEGACY_KEYS, (raw) => raw) ?? '';
}

function parseProgramState(raw: string): ProgramState | null {
  try {
    const parsed = JSON.parse(raw) as Partial<ProgramState>;
    return {
      selectedProgramId: typeof parsed.selectedProgramId === 'string' ? parsed.selectedProgramId : null,
      buffer: typeof parsed.buffer === 'number' ? parsed.buffer : 0,
      comparisonProgramIds: Array.isArray(parsed.comparisonProgramIds)
        ? parsed.comparisonProgramIds.filter((id): id is string => typeof id === 'string')
        : [],
    };
  } catch {
    return null;
  }
}

function loadStoredProgramState(): ProgramState {
  return readWithMigration(PROGRAM_STORAGE_KEY, PROGRAM_LEGACY_KEYS, parseProgramState) ?? defaultProgramState;
}

function parseDgnlModeState(raw: string): DgnlModeState | null {
  try {
    const parsed = JSON.parse(raw) as Partial<DgnlModeState>;
    return {
      mode: parsed.mode === 'total' ? 'total' : 'detail',
      totalRaw: typeof parsed.totalRaw === 'string' ? parsed.totalRaw : '',
    };
  } catch {
    return null;
  }
}

function loadStoredDgnlModeState(): DgnlModeState {
  return readWithMigration(DGNL_MODE_STORAGE_KEY, DGNL_MODE_LEGACY_KEYS, parseDgnlModeState) ?? defaultDgnlModeState;
}

function parseApplicantType(raw: string): HcmutApplicantType | null {
  try {
    return parseApplicantTypeFromSearchParams(new URLSearchParams({ at: raw }));
  } catch {
    return null;
  }
}

function loadStoredApplicantType(): HcmutApplicantType {
  return (
    readWithMigration(APPLICANT_TYPE_STORAGE_KEY, APPLICANT_TYPE_LEGACY_KEYS, parseApplicantType) ??
    DEFAULT_APPLICANT_TYPE
  );
}

/** URL query "at" có precedence cao hơn localStorage; thiếu/không hợp lệ fallback về dgnl (không break link cũ). */
function loadInitialApplicantType(): HcmutApplicantType {
  const base = loadStoredApplicantType();
  if (typeof window === 'undefined') return base;
  const params = new URLSearchParams(window.location.search);
  return params.has('at') ? parseApplicantTypeFromSearchParams(params) : base;
}

/** URL query params có precedence cao hơn localStorage: field nào URL cung cấp hợp lệ thì ghi đè lên. */
function loadInitialFormState(): AdmissionFormState {
  const base = loadStoredFormState();
  if (typeof window === 'undefined') return base;
  const params = new URLSearchParams(window.location.search);
  return applySearchParamsToForm(base, params, activeAdmissionConfig).formState;
}

function loadInitialTarget(): string {
  if (typeof window === 'undefined') return loadStoredTarget();
  const params = new URLSearchParams(window.location.search);
  const fromUrl = parseTargetFromSearchParams(params, activeAdmissionConfig);
  return fromUrl ?? loadStoredTarget();
}

/** program id không hợp lệ trong URL bị bỏ qua (giữ nguyên localStorage) thay vì reset về null. */
function loadInitialProgramState(): ProgramState {
  const base = loadStoredProgramState();
  if (typeof window === 'undefined') return base;
  const params = new URLSearchParams(window.location.search);
  const fromUrl = parseProgramStateFromSearchParams(params, hcmutPrograms);

  return {
    selectedProgramId: params.has('program') && fromUrl.programId !== null ? fromUrl.programId : base.selectedProgramId,
    buffer: params.has('buffer') ? fromUrl.buffer : base.buffer,
    comparisonProgramIds: params.has('compare') ? fromUrl.comparisonProgramIds : base.comparisonProgramIds,
  };
}

function buildAdmissionInput(errors: AdmissionFormErrors): AdmissionInput {
  return {
    dgnl: {
      vietnamese: errors.dgnl.vietnamese.value,
      english: errors.dgnl.english.value,
      math: errors.dgnl.math.value,
      scientificThinking: errors.dgnl.scientificThinking.value,
    },
    thpt: {
      math: errors.thpt.math.value,
      subject2: errors.thpt.subject2.value,
      subject3: errors.thpt.subject3.value,
    },
    transcript: {
      grade10: {
        math: errors.transcript.grade10.math.value,
        subject2: errors.transcript.grade10.subject2.value,
        subject3: errors.transcript.grade10.subject3.value,
      },
      grade11: {
        math: errors.transcript.grade11.math.value,
        subject2: errors.transcript.grade11.subject2.value,
        subject3: errors.transcript.grade11.subject3.value,
      },
      grade12: {
        math: errors.transcript.grade12.math.value,
        subject2: errors.transcript.grade12.subject2.value,
        subject3: errors.transcript.grade12.subject3.value,
      },
    },
    bonus: {
      reward: errors.bonus.reward.value,
      considerationReward: errors.bonus.considerationReward.value,
      encouragement: errors.bonus.encouragement.value,
    },
    priorityRaw30Scale: errors.priorityRaw30Scale.value,
  };
}

interface HcmutCalculatorPageProps {
  onChangeSchool: () => void;
}

export function HcmutCalculatorPage({ onChangeSchool }: HcmutCalculatorPageProps) {
  const [formState, setFormState] = useState<AdmissionFormState>(loadInitialFormState);
  const [targetScore, setTargetScore] = useState<string>(loadInitialTarget);
  const [programState, setProgramState] = useState<ProgramState>(loadInitialProgramState);
  const [dgnlModeState, setDgnlModeState] = useState<DgnlModeState>(loadStoredDgnlModeState);
  const [applicantType, setApplicantType] = useState<HcmutApplicantType>(loadInitialApplicantType);
  // Chỉ tăng khi bấm "Đặt lại": buộc ScenarioSimulator remount để đồng bộ lại slider
  // theo điểm hiện tại (state slider là state riêng, không tự nghe formState mỗi lần gõ phím).
  const [resetToken, setResetToken] = useState(0);
  // seed + key: cho phép TargetSection "Dùng trong mô phỏng" nạp một giá trị ĐGNL cụ thể
  // vào ScenarioSimulator bằng cách remount nó (cùng cơ chế với resetToken).
  const [simulatorSeed, setSimulatorSeed] = useState<number | null>(null);
  const [simulatorKey, setSimulatorKey] = useState(0);

  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formState));
  }, [formState]);

  useEffect(() => {
    if (targetScore.trim() === '') {
      localStorage.removeItem(TARGET_STORAGE_KEY);
    } else {
      localStorage.setItem(TARGET_STORAGE_KEY, targetScore);
    }
  }, [targetScore]);

  useEffect(() => {
    localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(programState));
  }, [programState]);

  useEffect(() => {
    localStorage.setItem(DGNL_MODE_STORAGE_KEY, JSON.stringify(dgnlModeState));
  }, [dgnlModeState]);

  useEffect(() => {
    localStorage.setItem(APPLICANT_TYPE_STORAGE_KEY, applicantType);
  }, [applicantType]);

  const isSupportedApplicantType = SUPPORTED_APPLICANT_TYPES.includes(applicantType);

  const errors = useMemo(() => validateAdmissionForm(formState, activeAdmissionConfig), [formState]);
  const targetError = useMemo(() => validateTargetScore(targetScore, activeAdmissionConfig).error, [targetScore]);
  const dgnlTotalValidation = useMemo(
    () => validateRange(dgnlModeState.totalRaw, 0, activeAdmissionConfig.dgnl.maxWeightedTotal),
    [dgnlModeState.totalRaw]
  );

  const hasCoreInput = useMemo(() => {
    if (!isSupportedApplicantType) return false;
    const thptTouched = Object.values(errors.thpt).some((field) => !field.isEmpty);
    const transcriptTouched = Object.values(errors.transcript).some((year) =>
      Object.values(year).some((field) => !field.isEmpty)
    );
    if (applicantType === 'no-dgnl') {
      // Nhóm không ĐGNL: điểm năng lực tự tính từ THPT, không có field dgnl riêng để "touch".
      return thptTouched || transcriptTouched;
    }
    const dgnlTouched =
      dgnlModeState.mode === 'total'
        ? !dgnlTotalValidation.isEmpty
        : Object.values(errors.dgnl).some((field) => !field.isEmpty);
    return dgnlTouched || thptTouched || transcriptTouched;
  }, [errors, dgnlModeState.mode, dgnlTotalValidation.isEmpty, applicantType, isSupportedApplicantType]);

  const currentInput = useMemo(() => buildAdmissionInput(errors), [errors]);

  const simulatorOtherInputs = useMemo(
    () => ({
      thpt: currentInput.thpt,
      transcript: currentInput.transcript,
      bonus: currentInput.bonus,
      priorityRaw30Scale: currentInput.priorityRaw30Scale,
    }),
    [currentInput]
  );

  // liveResult luôn được tính để các section con hiển thị số liệu chuẩn hóa realtime;
  // result chỉ hiện khi có ít nhất một điểm học lực đã được nhập (tránh cảm giác "0.00" là kết quả thật).
  // Chế độ "Nhập tổng điểm ĐGNL" không có 4 điểm thành phần thật nên không gọi calculateAdmissionScore
  // (sẽ phải dựng DgnlInput giả) — tái sử dụng calculateAdmissionScoreFromWeightedDgnlRaw +
  // convertThptScore/convertTranscriptScore (đều là hàm thuần đã có sẵn) để lắp lại đúng shape AdmissionResult.
  const liveResult = useMemo(() => {
    if (applicantType === 'no-dgnl') {
      return calculateAdmissionScoreNoDgnl(simulatorOtherInputs, activeAdmissionConfig);
    }
    if (dgnlModeState.mode === 'total') {
      const simulated = calculateAdmissionScoreFromWeightedDgnlRaw(
        dgnlTotalValidation.value,
        simulatorOtherInputs,
        activeAdmissionConfig
      );
      return {
        dgnl: {
          rawScore: 0,
          weightedMath: 0,
          weightedScore: simulated.dgnlWeightedRawScore,
          normalizedScore: simulated.dgnlNormalizedScore,
        },
        thpt: convertThptScore(currentInput.thpt, activeAdmissionConfig),
        transcript: convertTranscriptScore(currentInput.transcript, activeAdmissionConfig),
        academic: simulated.academic,
        bonus: simulated.bonus,
        priority: simulated.priority,
        baseScore: simulated.baseScore,
        finalScore: simulated.finalScore,
      };
    }
    return calculateAdmissionScore(currentInput, activeAdmissionConfig);
  }, [applicantType, dgnlModeState.mode, dgnlTotalValidation.value, currentInput, simulatorOtherInputs]);
  const result = hasCoreInput ? liveResult : null;

  const requiredResult = useMemo(() => {
    // Tính "ĐGNL cần đạt" chỉ có ý nghĩa cho nhóm dgnl — nhóm no-dgnl có điểm năng lực tự
    // tính từ THPT (không phải giá trị tự do người dùng tăng được), nên không binary-search.
    if (applicantType !== 'dgnl' || !hasCoreInput || targetScore.trim() === '' || targetError !== null) return null;
    if (dgnlModeState.mode === 'total') {
      return calculateRequiredDgnlFromWeightedRaw(
        Number(targetScore),
        dgnlTotalValidation.value,
        simulatorOtherInputs,
        activeAdmissionConfig
      );
    }
    return calculateRequiredDgnl(Number(targetScore), currentInput, activeAdmissionConfig);
  }, [
    applicantType,
    hasCoreInput,
    targetScore,
    targetError,
    dgnlModeState.mode,
    dgnlTotalValidation.value,
    simulatorOtherInputs,
    currentInput,
  ]);

  const selectedProgram = programState.selectedProgramId ? getProgramById(programState.selectedProgramId) ?? null : null;
  const latestCutoff = programState.selectedProgramId
    ? getLatestComparableCutoff(programState.selectedProgramId)
    : undefined;
  const currentFinalScore = result?.finalScore ?? null;
  const programGap =
    latestCutoff && currentFinalScore !== null ? calculateGap(currentFinalScore, latestCutoff.score) : null;
  const effectiveTarget = latestCutoff
    ? calculateEffectiveTarget(latestCutoff.score, programState.buffer, activeAdmissionConfig.scoreScale)
    : null;
  const historicalCutoffs = programState.selectedProgramId ? getCutoffsForProgram(programState.selectedProgramId) : [];
  // Chỉ hiện badge "đang dùng mục tiêu từ ngành X" khi điểm mục tiêu hiện tại khớp đúng
  // effectiveTarget (điểm chuẩn + biên) — tránh nhận nhầm nếu user tự gõ tay trùng số.
  const activeTargetSourceLabel =
    selectedProgram && effectiveTarget !== null && targetScore.trim() !== '' && targetError === null && Number(targetScore) === effectiveTarget
      ? selectedProgram.name
      : null;

  function buildShareUrl(): string {
    const params = serializeStateToSearchParams(formState, targetScore, activeAdmissionConfig);
    serializeProgramStateToSearchParams(
      params,
      {
        programId: programState.selectedProgramId,
        buffer: programState.buffer,
        comparisonProgramIds: programState.comparisonProgramIds,
      },
      hcmutPrograms
    );
    serializeApplicantTypeToSearchParams(params, applicantType);
    const query = params.toString();
    return `${window.location.origin}/hcmut${query ? `?${query}` : ''}`;
  }

  function handleDgnlChange(key: keyof DgnlFormState, value: string) {
    setFormState((prev) => ({ ...prev, dgnl: { ...prev.dgnl, [key]: value } }));
  }

  function handleThptChange(key: keyof ThptFormState, value: string) {
    setFormState((prev) => ({ ...prev, thpt: { ...prev.thpt, [key]: value } }));
  }

  function handleTranscriptChange(
    grade: keyof TranscriptFormState,
    subject: keyof TranscriptFormState['grade10'],
    value: string
  ) {
    setFormState((prev) => ({
      ...prev,
      transcript: {
        ...prev.transcript,
        [grade]: { ...prev.transcript[grade], [subject]: value },
      },
    }));
  }

  function handleBonusChange(key: keyof BonusFormState, value: string) {
    setFormState((prev) => ({ ...prev, bonus: { ...prev.bonus, [key]: value } }));
  }

  function handlePriorityChange(value: string) {
    setFormState((prev) => ({ ...prev, priorityRaw30Scale: value }));
  }

  function handleTargetChange(value: string) {
    setTargetScore(value);
  }

  function handleApplicantTypeChange(type: HcmutApplicantType) {
    setApplicantType(type);
  }

  function handleDgnlModeChange(mode: DgnlInputMode) {
    setDgnlModeState((prev) => ({ ...prev, mode }));
  }

  function handleDgnlTotalChange(value: string) {
    setDgnlModeState((prev) => ({ ...prev, totalRaw: value }));
  }

  function handleUseRequiredInSimulator(weightedRaw: number) {
    setSimulatorSeed(weightedRaw);
    setSimulatorKey((key) => key + 1);
    if (typeof window !== 'undefined') {
      document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleSelectProgram(id: string | null) {
    setProgramState((prev) => ({ ...prev, selectedProgramId: id }));
  }

  function handleBufferChange(buffer: number) {
    setProgramState((prev) => ({ ...prev, buffer }));
  }

  function handleToggleComparison(programId: string) {
    setProgramState((prev) => {
      const isPinned = prev.comparisonProgramIds.includes(programId);
      return {
        ...prev,
        comparisonProgramIds: isPinned
          ? removeProgramFromComparison(prev.comparisonProgramIds, programId)
          : addProgramToComparison(prev.comparisonProgramIds, programId),
      };
    });
  }

  function handleRemoveComparison(programId: string) {
    setProgramState((prev) => ({
      ...prev,
      comparisonProgramIds: removeProgramFromComparison(prev.comparisonProgramIds, programId),
    }));
  }

  function handleReset() {
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(TARGET_STORAGE_KEY);
    localStorage.removeItem(PROGRAM_STORAGE_KEY);
    localStorage.removeItem(DGNL_MODE_STORAGE_KEY);
    localStorage.removeItem(APPLICANT_TYPE_STORAGE_KEY);
    setFormState(defaultAdmissionFormState);
    setTargetScore('');
    setProgramState(defaultProgramState);
    setDgnlModeState(defaultDgnlModeState);
    setApplicantType(DEFAULT_APPLICANT_TYPE);
    setResetToken((token) => token + 1);
    setSimulatorSeed(null);
    setSimulatorKey(0);
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }

  const heroElement = (
    <DashboardHero
      scoreCard={<CurrentScoreCard result={result} config={activeAdmissionConfig} applicantType={applicantType} />}
      programCard={
        <SelectedProgramCard
          selectedProgram={selectedProgram}
          latestCutoff={latestCutoff}
          gap={programGap}
          currentFinalScore={currentFinalScore}
          onUseAsTarget={(score) => handleTargetChange(String(score))}
        />
      }
    />
  );

  return (
    <div className="min-h-svh bg-bg">
      <StickySummaryBar result={result} selectedProgram={selectedProgram} gap={programGap} />

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <Header
          school={{
            shortName: 'HCMUT',
            name: 'Trường Đại học Bách khoa – ĐHQG TP.HCM',
            year: activeAdmissionConfig.year,
          }}
          onReset={handleReset}
          buildShareUrl={buildShareUrl}
          onChangeSchool={onChangeSchool}
        />

        <ApplicantTypeSection value={applicantType} onChange={handleApplicantTypeChange} />

        {!isSupportedApplicantType ? (
          <p className="mt-5 rounded-card bg-surface p-6 text-sm text-muted shadow-card sm:p-8">
            Chọn nhóm "Có kết quả ĐGNL" hoặc "Không dự thi ĐGNL" ở trên để bắt đầu tính điểm — 2 nhóm này đã có công
            thức xác minh từ HCMUT 2026.
          </p>
        ) : (
        <main className="mt-5 flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_340px] lg:items-stretch lg:gap-6">
          <div className="flex flex-col gap-5 lg:order-2 lg:sticky lg:top-5 lg:h-fit">{heroElement}</div>

          <div className="flex flex-col gap-5 lg:order-1">
            <ProgramSection
              programs={hcmutPrograms}
              selectedProgramId={programState.selectedProgramId}
              onSelectProgram={handleSelectProgram}
              scoreScale={activeAdmissionConfig.scoreScale}
              comparisonProgramIds={programState.comparisonProgramIds}
              onToggleComparison={handleToggleComparison}
            />

            <TargetSection
              config={activeAdmissionConfig}
              targetValue={targetScore}
              targetError={targetError}
              result={result}
              requiredResult={requiredResult}
              onTargetChange={handleTargetChange}
              onUseRequiredInSimulator={handleUseRequiredInSimulator}
              activeTargetSourceLabel={activeTargetSourceLabel}
            />

            <ProgramBufferCard
              selectedProgram={selectedProgram}
              latestCutoff={latestCutoff}
              buffer={programState.buffer}
              onBufferChange={handleBufferChange}
              effectiveTarget={effectiveTarget}
              onUseAsTarget={(score) => handleTargetChange(String(score))}
            />

            <DgnlSection
              config={activeAdmissionConfig}
              values={formState.dgnl}
              errors={errors.dgnl}
              result={liveResult.dgnl}
              onChange={handleDgnlChange}
              mode={dgnlModeState.mode}
              onModeChange={handleDgnlModeChange}
              totalValue={dgnlModeState.totalRaw}
              totalError={dgnlTotalValidation.error}
              onTotalChange={handleDgnlTotalChange}
              applicantType={applicantType}
            />

            <TranscriptSection
              config={activeAdmissionConfig}
              values={formState.transcript}
              errors={errors.transcript}
              result={liveResult.transcript}
              onChange={handleTranscriptChange}
            />
            <ThptSection
              config={activeAdmissionConfig}
              values={formState.thpt}
              errors={errors.thpt}
              result={liveResult.thpt}
              onChange={handleThptChange}
            />

            <BonusPrioritySection
              config={activeAdmissionConfig}
              bonusValues={formState.bonus}
              bonusErrors={errors.bonus}
              priorityValue={formState.priorityRaw30Scale}
              priorityError={errors.priorityRaw30Scale.error}
              bonusResult={liveResult.bonus}
              priorityResult={liveResult.priority}
              onBonusChange={handleBonusChange}
              onPriorityChange={handlePriorityChange}
            />

            {applicantType === 'dgnl' && (
              <ScenarioSimulator
                key={`${resetToken}-${simulatorKey}`}
                config={activeAdmissionConfig}
                currentWeightedRaw={liveResult.dgnl.weightedScore}
                otherInputs={simulatorOtherInputs}
                currentFinalScore={result?.finalScore ?? null}
                initialWeightedRaw={simulatorSeed ?? undefined}
              />
            )}

            <ProgramHistoryCompare
              selectedProgram={selectedProgram}
              historicalCutoffs={historicalCutoffs}
              currentFinalScore={currentFinalScore}
              comparisonProgramIds={programState.comparisonProgramIds}
              onRemoveComparison={handleRemoveComparison}
            />

            <FormulaExplanation config={activeAdmissionConfig} />
          </div>
        </main>
        )}

        <Footer />
      </div>
    </div>
  );
}
