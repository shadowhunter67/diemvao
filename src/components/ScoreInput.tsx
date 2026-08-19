interface ScoreInputProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
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
  onBlur,
  compact = false,
  hideLabel = false,
}: ScoreInputProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className={hideLabel ? 'sr-only' : 'text-sm font-medium text-ink'}>
          {label}
        </label>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error !== null}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1 w-full rounded-lg border bg-surface text-ink shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${
          compact ? 'h-10 px-2.5 text-sm' : 'h-11 px-3.5 sm:h-12'
        } ${
          error
            ? 'border-danger/50 focus:border-danger focus:ring-danger/20'
            : 'border-ink/10 focus:border-accent focus:ring-accent/25'
        }`}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
