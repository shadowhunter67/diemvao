interface ScoreInputProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  compact?: boolean;
  hideLabel?: boolean;
}

export function ScoreInput({
  id,
  label,
  hint,
  value,
  error,
  onChange,
  compact = false,
  hideLabel = false,
}: ScoreInputProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className={hideLabel ? 'sr-only' : 'text-sm font-medium text-slate-700'}>
          {label}
        </label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error !== null}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1 w-full rounded-lg border bg-white text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${
          compact ? 'px-2 py-1.5 text-sm' : 'px-3 py-2'
        } ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
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
