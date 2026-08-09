import { RotateCcw } from 'lucide-react';
import type { AdmissionConfig, ScoreFieldKey } from '../types/admission';
import type { FieldValidationResult } from '../lib/validation';
import { ScoreInput } from './ScoreInput';

interface FieldMeta {
  key: ScoreFieldKey;
  label: string;
  hint: string;
}

function buildFieldMeta(config: AdmissionConfig): FieldMeta[] {
  return [
    { key: 'dgnl', label: 'ĐGNL (quy đổi)', hint: '0 - 100' },
    { key: 'thpt', label: 'THPT (quy đổi)', hint: '0 - 100' },
    { key: 'transcript', label: 'Học bạ (quy đổi)', hint: '0 - 100' },
    { key: 'bonus', label: 'Điểm cộng', hint: `0 - ${config.maxBonus}` },
    { key: 'priority', label: 'Điểm ưu tiên', hint: `0 - ${config.maxPriority}` },
  ];
}

interface ScoreFormProps {
  config: AdmissionConfig;
  values: Record<ScoreFieldKey, string>;
  validations: Record<ScoreFieldKey, FieldValidationResult>;
  onChange: (key: ScoreFieldKey, value: string) => void;
  onReset: () => void;
}

export function ScoreForm({ config, values, validations, onChange, onReset }: ScoreFormProps) {
  const fields = buildFieldMeta(config);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Nhập điểm</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Đặt lại
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {fields.map((field) => (
          <ScoreInput
            key={field.key}
            id={`field-${field.key}`}
            fieldKey={field.key}
            label={field.label}
            hint={field.hint}
            value={values[field.key]}
            error={validations[field.key].error}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  );
}
