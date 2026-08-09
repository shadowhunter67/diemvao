import type { ScoreBreakdown } from '../types/admission';
import { ScoreBreakdownList } from './ScoreBreakdown';

interface ScoreResultProps {
  breakdown: ScoreBreakdown | null;
}

export function ScoreResult({ breakdown }: ScoreResultProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Kết quả</h2>

      {breakdown === null ? (
        <div className="flex min-h-[160px] flex-col items-center justify-center gap-1 text-center">
          <p className="text-sm text-slate-400">Nhập điểm để xem kết quả</p>
        </div>
      ) : (
        <>
          <div className="mt-2 flex flex-col items-center rounded-xl bg-indigo-50 py-6 text-center">
            <span className="text-xs font-medium uppercase tracking-wide text-indigo-500">
              Điểm xét tuyển dự kiến
            </span>
            <span className="mt-1 text-4xl font-bold text-indigo-700 sm:text-5xl">
              {breakdown.finalScore.toFixed(2)}
              <span className="text-lg font-medium text-indigo-400"> / 100</span>
            </span>
          </div>

          <div className="mt-5">
            <ScoreBreakdownList breakdown={breakdown} />
          </div>
        </>
      )}
    </section>
  );
}
