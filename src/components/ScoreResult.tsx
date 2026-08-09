import type { AdmissionConfig, AdmissionResult } from '../types/admission';
import { ScoreBreakdownList } from './ScoreBreakdown';
import { ShareButton } from './ShareButton';

interface ScoreResultProps {
  result: AdmissionResult | null;
  config: AdmissionConfig;
  buildShareUrl: () => string;
}

export function ScoreResult({ result, config, buildShareUrl }: ScoreResultProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Kết quả</h2>

      {result === null ? (
        <div className="flex min-h-[160px] flex-col items-center justify-center gap-1 text-center">
          <p className="text-sm text-slate-400">Nhập điểm để xem kết quả</p>
        </div>
      ) : (
        <>
          <div className="mt-2 flex flex-col items-center rounded-xl bg-blue-50 py-6 text-center">
            <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
              Điểm xét tuyển
            </span>
            <span className="mt-1 text-4xl font-bold text-blue-800 sm:text-5xl">
              {result.finalScore.toFixed(2)}
              <span className="text-lg font-medium text-blue-500"> / {config.scoreScale}</span>
            </span>
          </div>

          <div className="mt-5">
            <ScoreBreakdownList result={result} config={config} />
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <ShareButton buildShareUrl={buildShareUrl} />
          </div>
        </>
      )}
    </section>
  );
}
