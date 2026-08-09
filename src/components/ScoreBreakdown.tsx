import type { ScoreBreakdown } from '../types/admission';

interface ScoreBreakdownListProps {
  breakdown: ScoreBreakdown;
}

interface Row {
  label: string;
  value: number;
}

export function ScoreBreakdownList({ breakdown }: ScoreBreakdownListProps) {
  const rows: Row[] = [
    { label: 'ĐGNL', value: breakdown.dgnlContribution },
    { label: 'THPT', value: breakdown.thptContribution },
    { label: 'Học bạ', value: breakdown.transcriptContribution },
    { label: 'Điểm cộng', value: breakdown.bonus },
    { label: 'Điểm ưu tiên', value: breakdown.priority },
  ];

  return (
    <dl className="flex flex-col gap-2 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <dt className="text-slate-500">{row.label}</dt>
          <dd className="font-medium text-slate-800">
            {row.value >= 0 ? '+' : ''}
            {row.value.toFixed(2)}
          </dd>
        </div>
      ))}
      <div className="mt-1 flex items-center justify-between border-t border-slate-200 pt-2">
        <dt className="font-semibold text-slate-900">Tổng</dt>
        <dd className="font-semibold text-slate-900">{breakdown.finalScore.toFixed(2)}</dd>
      </div>
    </dl>
  );
}
