import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { AdmissionConfig, AdmissionResult } from '../schools/hcmut/types/admission';
import { ScoreBreakdownDetails } from './ScoreBreakdownDetails';

interface CurrentScoreCardProps {
  result: AdmissionResult | null;
  config: AdmissionConfig;
}

function signed(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
}

export function CurrentScoreCard({ result, config }: CurrentScoreCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <section className="rounded-card bg-surface p-6 shadow-card sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">Điểm xét tuyển hiện tại</span>

      {result === null ? (
        <div className="mt-3 flex min-h-[140px] flex-col justify-center gap-1">
          <span className="text-5xl font-extrabold text-ink/15 sm:text-6xl">—</span>
          <p className="text-sm text-muted">Nhập điểm để xem kết quả</p>
        </div>
      ) : (
        <>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-6xl font-extrabold tracking-tight text-primary sm:text-7xl">
              {result.finalScore.toFixed(2)}
            </span>
            <span className="text-lg font-medium text-muted">/ {config.scoreScale}</span>
          </div>

          <dl className="mt-6 flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Điểm năng lực</dt>
              <dd className="font-medium text-ink">{signed(result.academic.dgnlContribution)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">THPT</dt>
              <dd className="font-medium text-ink">{signed(result.academic.thptContribution)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Học bạ</dt>
              <dd className="font-medium text-ink">{signed(result.academic.transcriptContribution)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Điểm cộng</dt>
              <dd className="font-medium text-ink">{signed(result.bonus.received)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Ưu tiên</dt>
              <dd className="font-medium text-ink">{signed(result.priority.received)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => setDetailsOpen((open) => !open)}
            aria-expanded={detailsOpen}
            className="mt-4 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-accent transition hover:bg-surface-soft focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <ChevronDown
              size={14}
              aria-hidden="true"
              className={`transition-transform ${detailsOpen ? 'rotate-180' : ''}`}
            />
            {detailsOpen ? 'Ẩn chi tiết' : 'Xem chi tiết'}
          </button>

          {detailsOpen && (
            <div className="mt-4 border-t border-ink/10 pt-4">
              <ScoreBreakdownDetails result={result} config={config} />
            </div>
          )}
        </>
      )}
    </section>
  );
}
