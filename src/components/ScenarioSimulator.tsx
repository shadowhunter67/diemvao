import { useId, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { calculateAdmissionScoreFromWeightedDgnlRaw } from '../lib/targetCalculator';
import type { AdmissionConfig, AdmissionInput } from '../types/admission';

interface ScenarioSimulatorProps {
  config: AdmissionConfig;
  /** ĐGNL sau hệ số hiện tại (từ form thật), dùng làm mốc mặc định + cho các preset. */
  currentWeightedRaw: number;
  otherInputs: Omit<AdmissionInput, 'dgnl'>;
  currentFinalScore: number | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function ScenarioSimulator({
  config,
  currentWeightedRaw,
  otherInputs,
  currentFinalScore,
}: ScenarioSimulatorProps) {
  const maxWeightedRaw = config.dgnl.maxWeightedTotal;
  const [simWeightedRaw, setSimWeightedRaw] = useState(() => clamp(currentWeightedRaw, 0, maxWeightedRaw));
  const sliderId = useId();

  const simResult = calculateAdmissionScoreFromWeightedDgnlRaw(simWeightedRaw, otherInputs, config);
  const delta = currentFinalScore !== null ? simResult.finalScore - currentFinalScore : null;

  function applyPreset(delta: number | 'max') {
    setSimWeightedRaw(delta === 'max' ? maxWeightedRaw : clamp(currentWeightedRaw + delta, 0, maxWeightedRaw));
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-blue-600" aria-hidden="true" />
        <h2 className="text-base font-semibold text-slate-900">Mô phỏng điểm ĐGNL</h2>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Kéo thử một mức ĐGNL giả định, các thành phần khác giữ nguyên như form chính. Không ảnh hưởng tới dữ liệu bạn
        đã nhập.
      </p>

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={sliderId} className="text-sm font-medium text-slate-700">
            ĐGNL sau hệ số giả định
          </label>
          <span className="text-xs text-slate-400">
            0 - {maxWeightedRaw}
          </span>
        </div>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={maxWeightedRaw}
          step={1}
          value={simWeightedRaw}
          onChange={(e) => setSimWeightedRaw(Number(e.target.value))}
          className="mt-2 w-full accent-blue-600"
        />
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applyPreset(50)}
          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          +50 ĐGNL
        </button>
        <button
          type="button"
          onClick={() => applyPreset(100)}
          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          +100 ĐGNL
        </button>
        <button
          type="button"
          onClick={() => applyPreset('max')}
          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          Max
        </button>
        <button
          type="button"
          onClick={() => setSimWeightedRaw(clamp(currentWeightedRaw, 0, maxWeightedRaw))}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          Dùng điểm hiện tại
        </button>
      </div>

      <dl className="mt-4 flex flex-col gap-1.5 rounded-lg bg-slate-50 p-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">ĐGNL sau hệ số</dt>
          <dd className="font-medium text-slate-800">
            {simWeightedRaw.toFixed(0)} / {maxWeightedRaw}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Chuẩn hóa</dt>
          <dd className="font-medium text-slate-800">{simResult.dgnlNormalizedScore.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
          <dt className="font-semibold text-slate-900">Điểm xét tuyển tương ứng</dt>
          <dd className="font-semibold text-slate-900">{simResult.finalScore.toFixed(2)}</dd>
        </div>
        {delta !== null && (
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">So với hiện tại</dt>
            <dd className={`font-medium ${delta >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              {delta >= 0 ? '+' : ''}
              {delta.toFixed(2)}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
