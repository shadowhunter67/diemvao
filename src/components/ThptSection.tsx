import type { AdmissionConfig, ThptResult } from '../types/admission';
import type { ThptFormState } from '../types/form';
import type { FieldValidationResult } from '../lib/validation';
import { ScoreInput } from './ScoreInput';

interface ThptSectionProps {
  config: AdmissionConfig;
  values: ThptFormState;
  errors: Record<keyof ThptFormState, FieldValidationResult>;
  result: ThptResult;
  onChange: (key: keyof ThptFormState, value: string) => void;
}

export function ThptSection({ config, values, errors, result, onChange }: ThptSectionProps) {
  const maxHint = `0 - ${config.thpt.maxPerSubject}`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Điểm thi tốt nghiệp THPT</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ScoreInput
          id="thpt-math"
          label={`Toán (×${config.thpt.mathMultiplier})`}
          hint={maxHint}
          value={values.math}
          error={errors.math.error}
          onChange={(v) => onChange('math', v)}
        />
        <ScoreInput
          id="thpt-subject2"
          label="Môn 2"
          hint={maxHint}
          value={values.subject2}
          error={errors.subject2.error}
          onChange={(v) => onChange('subject2', v)}
        />
        <ScoreInput
          id="thpt-subject3"
          label="Môn 3"
          hint={maxHint}
          value={values.subject3}
          error={errors.subject3.error}
          onChange={(v) => onChange('subject3', v)}
        />
      </div>

      <dl className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
        <dt className="text-slate-500">Chuẩn hóa</dt>
        <dd className="font-medium text-slate-800">{result.normalizedScore.toFixed(2)} / {config.scoreScale}</dd>
      </dl>
    </section>
  );
}
