import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { ScoreForm } from './components/ScoreForm';
import { ScoreResult } from './components/ScoreResult';
import { TargetSection } from './components/TargetSection';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { ProgramSection } from './components/ProgramSection';
import { ProgramHistoryCompare } from './components/ProgramHistoryCompare';
import { FormulaExplanation } from './components/FormulaExplanation';
import { activeAdmissionConfig } from './config/admission-2026';
import { hcmutPrograms } from './data/hcmut-programs';
import { calculateAdmissionScore } from './lib/calculator';
import { calculateRequiredDgnl } from './lib/targetCalculator';
import {
  addProgramToComparison,
  calculateEffectiveTarget,
  calculateGap,
  getCutoffsForProgram,
  getLatestComparableCutoff,
  getProgramById,
  removeProgramFromComparison,
} from './lib/programs';
import { validateAdmissionForm, validateTargetScore, type AdmissionFormErrors } from './lib/validation';
import {
  applySearchParamsToForm,
  parseProgramStateFromSearchParams,
  parseTargetFromSearchParams,
  serializeProgramStateToSearchParams,
  serializeStateToSearchParams,
} from './lib/urlState';
import type { AdmissionInput } from './types/admission';
import {
  defaultAdmissionFormState,
  type AdmissionFormState,
  type BonusFormState,
  type DgnlFormState,
  type ThptFormState,
  type TranscriptFormState,
} from './types/form';

const FORM_STORAGE_KEY = 'hcmut-score-input-v2';
const TARGET_STORAGE_KEY = 'hcmut-score-target-v1';
const PROGRAM_STORAGE_KEY = 'hcmut-score-program-v1';

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

function loadStoredFormState(): AdmissionFormState {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return defaultAdmissionFormState;
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
    return defaultAdmissionFormState;
  }
}

function loadStoredTarget(): string {
  try {
    return localStorage.getItem(TARGET_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function loadStoredProgramState(): ProgramState {
  try {
    const raw = localStorage.getItem(PROGRAM_STORAGE_KEY);
    if (!raw) return defaultProgramState;
    const parsed = JSON.parse(raw) as Partial<ProgramState>;
    return {
      selectedProgramId: typeof parsed.selectedProgramId === 'string' ? parsed.selectedProgramId : null,
      buffer: typeof parsed.buffer === 'number' ? parsed.buffer : 0,
      comparisonProgramIds: Array.isArray(parsed.comparisonProgramIds)
        ? parsed.comparisonProgramIds.filter((id): id is string => typeof id === 'string')
        : [],
    };
  } catch {
    return defaultProgramState;
  }
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

function App() {
  const [formState, setFormState] = useState<AdmissionFormState>(loadInitialFormState);
  const [targetScore, setTargetScore] = useState<string>(loadInitialTarget);
  const [programState, setProgramState] = useState<ProgramState>(loadInitialProgramState);
  // Chỉ tăng khi bấm "Đặt lại": buộc ScenarioSimulator remount để đồng bộ lại slider
  // theo điểm hiện tại (state slider là state riêng, không tự nghe formState mỗi lần gõ phím).
  const [resetToken, setResetToken] = useState(0);

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

  const errors = useMemo(() => validateAdmissionForm(formState, activeAdmissionConfig), [formState]);
  const targetError = useMemo(() => validateTargetScore(targetScore, activeAdmissionConfig).error, [targetScore]);

  const hasCoreInput = useMemo(() => {
    const dgnlTouched = Object.values(errors.dgnl).some((field) => !field.isEmpty);
    const thptTouched = Object.values(errors.thpt).some((field) => !field.isEmpty);
    const transcriptTouched = Object.values(errors.transcript).some((year) =>
      Object.values(year).some((field) => !field.isEmpty)
    );
    return dgnlTouched || thptTouched || transcriptTouched;
  }, [errors]);

  const currentInput = useMemo(() => buildAdmissionInput(errors), [errors]);

  // liveResult luôn được tính để các section con hiển thị số liệu chuẩn hóa realtime;
  // result chỉ hiện khi có ít nhất một điểm học lực đã được nhập (tránh cảm giác "0.00" là kết quả thật).
  const liveResult = useMemo(() => calculateAdmissionScore(currentInput, activeAdmissionConfig), [currentInput]);
  const result = hasCoreInput ? liveResult : null;

  const requiredResult = useMemo(() => {
    if (!hasCoreInput || targetScore.trim() === '' || targetError !== null) return null;
    return calculateRequiredDgnl(Number(targetScore), currentInput, activeAdmissionConfig);
  }, [hasCoreInput, targetScore, targetError, currentInput]);

  const simulatorOtherInputs = useMemo(
    () => ({
      thpt: currentInput.thpt,
      transcript: currentInput.transcript,
      bonus: currentInput.bonus,
      priorityRaw30Scale: currentInput.priorityRaw30Scale,
    }),
    [currentInput]
  );

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
    const query = params.toString();
    return `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ''}`;
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
    setFormState(defaultAdmissionFormState);
    setTargetScore('');
    setProgramState(defaultProgramState);
    setResetToken((token) => token + 1);
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }

  return (
    <div className="min-h-svh bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <Header />
        <main className="admission-layout">
          <div className="admission-layout-form">
            <ScoreForm
              config={activeAdmissionConfig}
              formState={formState}
              errors={errors}
              result={liveResult}
              onDgnlChange={handleDgnlChange}
              onThptChange={handleThptChange}
              onTranscriptChange={handleTranscriptChange}
              onBonusChange={handleBonusChange}
              onPriorityChange={handlePriorityChange}
              onReset={handleReset}
            />
          </div>

          <div className="admission-layout-side flex flex-col gap-5 lg:sticky lg:top-5">
            <div className="admission-layout-side-result">
              <ScoreResult result={result} config={activeAdmissionConfig} buildShareUrl={buildShareUrl} />
            </div>
            <div className="admission-layout-side-program">
              <ProgramSection
                programs={hcmutPrograms}
                selectedProgramId={programState.selectedProgramId}
                onSelectProgram={handleSelectProgram}
                currentFinalScore={currentFinalScore}
                latestCutoff={latestCutoff}
                gap={programGap}
                buffer={programState.buffer}
                onBufferChange={handleBufferChange}
                effectiveTarget={effectiveTarget}
                onUseAsTarget={(score) => handleTargetChange(String(score))}
                scoreScale={activeAdmissionConfig.scoreScale}
                isPinnedForComparison={
                  selectedProgram !== null && programState.comparisonProgramIds.includes(selectedProgram.id)
                }
                canAddMoreComparison={programState.comparisonProgramIds.length < 3}
                onToggleComparison={handleToggleComparison}
              />
            </div>
            <div className="admission-layout-side-target">
              <TargetSection
                config={activeAdmissionConfig}
                targetValue={targetScore}
                targetError={targetError}
                result={result}
                requiredResult={requiredResult}
                onTargetChange={handleTargetChange}
              />
            </div>
          </div>

          <div className="admission-layout-sim">
            <ScenarioSimulator
              key={resetToken}
              config={activeAdmissionConfig}
              currentWeightedRaw={liveResult.dgnl.weightedScore}
              otherInputs={simulatorOtherInputs}
              currentFinalScore={result?.finalScore ?? null}
            />
          </div>

          <div className="admission-layout-history">
            <ProgramHistoryCompare
              selectedProgram={selectedProgram}
              historicalCutoffs={historicalCutoffs}
              currentFinalScore={currentFinalScore}
              comparisonProgramIds={programState.comparisonProgramIds}
              onRemoveComparison={handleRemoveComparison}
            />
          </div>

          <div className="admission-layout-explain">
            <FormulaExplanation config={activeAdmissionConfig} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
