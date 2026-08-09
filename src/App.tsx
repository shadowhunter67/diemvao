import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { ScoreForm } from './components/ScoreForm';
import { ScoreResult } from './components/ScoreResult';
import { FormulaExplanation } from './components/FormulaExplanation';
import { activeAdmissionConfig } from './config/admission-2026';
import { calculateAdmissionScore } from './lib/calculator';
import { validateAdmissionForm, type AdmissionFormErrors } from './lib/validation';
import type { AdmissionInput } from './types/admission';
import type { AdmissionFormState, BonusFormState, DgnlFormState, ThptFormState, TranscriptFormState } from './types/form';

const STORAGE_KEY = 'hcmut-score-input-v2';

const defaultFormState: AdmissionFormState = {
  dgnl: { vietnamese: '', english: '', math: '', scientificThinking: '' },
  thpt: { math: '', subject2: '', subject3: '' },
  transcript: {
    grade10: { math: '', subject2: '', subject3: '' },
    grade11: { math: '', subject2: '', subject3: '' },
    grade12: { math: '', subject2: '', subject3: '' },
  },
  bonus: { reward: '', considerationReward: '', encouragement: '' },
  priorityRaw30Scale: '',
};

function loadStoredFormState(): AdmissionFormState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultFormState;
    const parsed = JSON.parse(raw) as Partial<AdmissionFormState>;
    return {
      dgnl: { ...defaultFormState.dgnl, ...parsed.dgnl },
      thpt: { ...defaultFormState.thpt, ...parsed.thpt },
      transcript: {
        grade10: { ...defaultFormState.transcript.grade10, ...parsed.transcript?.grade10 },
        grade11: { ...defaultFormState.transcript.grade11, ...parsed.transcript?.grade11 },
        grade12: { ...defaultFormState.transcript.grade12, ...parsed.transcript?.grade12 },
      },
      bonus: { ...defaultFormState.bonus, ...parsed.bonus },
      priorityRaw30Scale: parsed.priorityRaw30Scale ?? defaultFormState.priorityRaw30Scale,
    };
  } catch {
    return defaultFormState;
  }
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
  const [formState, setFormState] = useState<AdmissionFormState>(loadStoredFormState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formState));
  }, [formState]);

  const errors = useMemo(() => validateAdmissionForm(formState, activeAdmissionConfig), [formState]);

  const hasCoreInput = useMemo(() => {
    const dgnlTouched = Object.values(errors.dgnl).some((field) => !field.isEmpty);
    const thptTouched = Object.values(errors.thpt).some((field) => !field.isEmpty);
    const transcriptTouched = Object.values(errors.transcript).some((year) =>
      Object.values(year).some((field) => !field.isEmpty)
    );
    return dgnlTouched || thptTouched || transcriptTouched;
  }, [errors]);

  // liveResult luôn được tính để các section con hiển thị số liệu chuẩn hóa realtime;
  // result chỉ hiện khi có ít nhất một điểm học lực đã được nhập (tránh cảm giác "0.00" là kết quả thật).
  const liveResult = useMemo(
    () => calculateAdmissionScore(buildAdmissionInput(errors), activeAdmissionConfig),
    [errors]
  );
  const result = hasCoreInput ? liveResult : null;

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

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY);
    setFormState(defaultFormState);
  }

  return (
    <div className="min-h-svh bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <Header />
        <main className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
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
          <div className="lg:sticky lg:top-5 lg:flex lg:flex-col lg:gap-5">
            <ScoreResult result={result} config={activeAdmissionConfig} />
            <FormulaExplanation config={activeAdmissionConfig} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
