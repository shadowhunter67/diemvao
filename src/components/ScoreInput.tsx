import type { ScoreFieldKey } from '../types/admission';

interface ScoreInputProps {
  id: string;
  fieldKey: ScoreFieldKey;
  label: string;
  hint: string;
  value: string;
  error: string | null;
  onChange: (key: ScoreFieldKey, value: string) => void;
}

export function ScoreInput({ id, fieldKey, label, hint, value, error, onChange }: ScoreInputProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <span className="text-xs text-slate-400">{hint}</span>
      </div>
      <input
        id={id}
        name={fieldKey}
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        aria-invalid={error !== null}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
        }`}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
