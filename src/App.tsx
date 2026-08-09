import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { ScoreForm } from './components/ScoreForm';
import { ScoreResult } from './components/ScoreResult';
import { FormulaExplanation } from './components/FormulaExplanation';
import { activeAdmissionConfig } from './config/admission-2026';
import { calculateScore } from './lib/calculator';
import { validateScoreField } from './lib/validation';
import type { ScoreFieldKey } from './types/admission';

const STORAGE_KEY = 'hcmut-score-calculator:input:v1';

type FormValues = Record<ScoreFieldKey, string>;

const defaultValues: FormValues = {
  dgnl: '',
  thpt: '',
  transcript: '',
  bonus: '0',
  priority: '0',
};

function loadStoredValues(): FormValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultValues;
    const parsed = JSON.parse(raw) as Partial<FormValues>;
    return { ...defaultValues, ...parsed };
  } catch {
    return defaultValues;
  }
}

function App() {
  const [values, setValues] = useState<FormValues>(loadStoredValues);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [values]);

  const validations = useMemo(() => {
    const keys = Object.keys(values) as ScoreFieldKey[];
    return keys.reduce((acc, key) => {
      acc[key] = validateScoreField(values[key], key, activeAdmissionConfig);
      return acc;
    }, {} as Record<ScoreFieldKey, ReturnType<typeof validateScoreField>>);
  }, [values]);

  const hasCoreInput = !validations.dgnl.isEmpty || !validations.thpt.isEmpty || !validations.transcript.isEmpty;

  const breakdown = useMemo(() => {
    if (!hasCoreInput) return null;
    return calculateScore(
      {
        dgnl: validations.dgnl.value,
        thpt: validations.thpt.value,
        transcript: validations.transcript.value,
        bonus: validations.bonus.value,
        priority: validations.priority.value,
      },
      activeAdmissionConfig
    );
  }, [hasCoreInput, validations]);

  function handleChange(key: ScoreFieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY);
    setValues(defaultValues);
  }

  return (
    <div className="min-h-svh bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header />
        <main className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ScoreForm
            config={activeAdmissionConfig}
            values={values}
            validations={validations}
            onChange={handleChange}
            onReset={handleReset}
          />
          <ScoreResult breakdown={breakdown} />
          <div className="md:col-span-2">
            <FormulaExplanation config={activeAdmissionConfig} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
