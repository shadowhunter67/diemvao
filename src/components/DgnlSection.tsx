import type { AdmissionConfig, DgnlResult } from '../types/admission';
import type { DgnlFormState } from '../types/form';
import type { FieldValidationResult } from '../lib/validation';
import { ScoreInput } from './ScoreInput';

interface DgnlSectionProps {
  config: AdmissionConfig;
  values: DgnlFormState;
  errors: Record<keyof DgnlFormState, FieldValidationResult>;
  result: DgnlResult;
  onChange: (key: keyof DgnlFormState, value: string) => void;
}

export function DgnlSection({ config, values, errors, result, onChange }: DgnlSectionProps) {
  const maxHint = `0 - ${config.dgnl.maxPerComponent}`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Điểm Đánh giá năng lực 2026</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ScoreInput
          id="dgnl-vietnamese"
          label="Tiếng Việt"
          hint={maxHint}
          value={values.vietnamese}
          error={errors.vietnamese.error}
          onChange={(v) => onChange('vietnamese', v)}
        />
        <ScoreInput
          id="dgnl-english"
          label="Tiếng Anh"
          hint={maxHint}
          value={values.english}
          error={errors.english.error}
          onChange={(v) => onChange('english', v)}
        />
        <ScoreInput
          id="dgnl-math"
          label={`Toán (×${config.dgnl.mathMultiplier})`}
          hint={maxHint}
          value={values.math}
          error={errors.math.error}
          onChange={(v) => onChange('math', v)}
        />
        <ScoreInput
          id="dgnl-scientific-thinking"
          label="Tư duy khoa học"
          hint={maxHint}
          value={values.scientificThinking}
          error={errors.scientificThinking.error}
          onChange={(v) => onChange('scientificThinking', v)}
        />
      </div>

      <dl className="mt-4 flex flex-col gap-1 rounded-lg bg-slate-50 p-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Điểm ĐGNL sau hệ số</dt>
          <dd className="font-medium text-slate-800">
            {result.weightedScore.toFixed(2)} / {config.dgnl.maxWeightedTotal}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Điểm chuẩn hóa</dt>
          <dd className="font-medium text-slate-800">{result.normalizedScore.toFixed(2)} / {config.scoreScale}</dd>
        </div>
      </dl>
    </section>
  );
}
