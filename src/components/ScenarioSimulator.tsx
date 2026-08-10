import { useId, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { calculateAdmissionScoreFromWeightedDgnlRaw } from '../schools/hcmut/calculator/targetCalculator';
import type { AdmissionConfig, AdmissionInput } from '../schools/hcmut/types/admission';

interface ScenarioSimulatorProps {
  config: AdmissionConfig;
  /** ĐGNL sau hệ số hiện tại (từ form thật), dùng làm mốc mặc định + cho các preset. */
  currentWeightedRaw: number;
  otherInputs: Omit<AdmissionInput, 'dgnl'>;
  currentFinalScore: number | null;
  /** Giá trị khởi tạo tùy chọn (vd: seed từ TargetSection "Dùng trong mô phỏng"). */
  initialWeightedRaw?: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function ScenarioSimulator({
  config,
  currentWeightedRaw,
  otherInputs,
  currentFinalScore,
  initialWeightedRaw,
}: ScenarioSimulatorProps) {
  const maxWeightedRaw = config.dgnl.maxWeightedTotal;
  const [simWeightedRaw, setSimWeightedRaw] = useState(() =>
    clamp(initialWeightedRaw ?? currentWeightedRaw, 0, maxWeightedRaw)
  );
  const sliderId = useId();

  const simResult = calculateAdmissionScoreFromWeightedDgnlRaw(simWeightedRaw, otherInputs, config);
  const delta = currentFinalScore !== null ? simResult.finalScore - currentFinalScore : null;

  function applyPreset(delta: number | 'max') {
    setSimWeightedRaw(delta === 'max' ? maxWeightedRaw : clamp(currentWeightedRaw + delta, 0, maxWeightedRaw));
  }

  return (
    <section id="simulator" className="rounded-2xl bg-surface-soft p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={20} className="text-accent" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-ink">Mô phỏng điểm ĐGNL</h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        Xem điểm xét tuyển thay đổi thế nào nếu ĐGNL tăng hoặc giảm. Các thành phần khác giữ nguyên như bạn đã
        nhập, không ảnh hưởng tới dữ liệu thật.
      </p>

      <div className="mt-6">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={sliderId} className="text-sm font-medium text-ink">
            ĐGNL sau hệ số giả định
          </label>
          <span className="text-xs text-muted">0 - {maxWeightedRaw}</span>
        </div>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={maxWeightedRaw}
          step={1}
          value={simWeightedRaw}
          onChange={(e) => setSimWeightedRaw(Number(e.target.value))}
          className="mt-3 h-2 w-full accent-accent"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applyPreset(50)}
          className="rounded-md border border-ink/10 bg-surface px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          +50
        </button>
        <button
          type="button"
          onClick={() => applyPreset(100)}
          className="rounded-md border border-ink/10 bg-surface px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          +100
        </button>
        <button
          type="button"
          onClick={() => applyPreset('max')}
          className="rounded-md border border-ink/10 bg-surface px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          Tối đa
        </button>
        <button
          type="button"
          onClick={() => setSimWeightedRaw(clamp(currentWeightedRaw, 0, maxWeightedRaw))}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          Hiện tại
        </button>
      </div>

      <dl className="mt-5 flex flex-col gap-1.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">ĐGNL giả định</dt>
          <dd className="font-medium text-ink">
            {simWeightedRaw.toFixed(0)} / {maxWeightedRaw}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Chuẩn hóa</dt>
          <dd className="font-medium text-ink">{simResult.dgnlNormalizedScore.toFixed(2)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-lg bg-surface p-4">
        <div>
          <span className="text-xs text-muted">Điểm xét tuyển</span>
          <p className="text-2xl font-bold text-primary">{simResult.finalScore.toFixed(2)}</p>
        </div>
        {delta !== null && (
          <div className="text-right">
            <span className="text-xs text-muted">Chênh lệch</span>
            <p className={`text-lg font-semibold ${delta >= 0 ? 'text-success' : 'text-warning'}`}>
              {delta >= 0 ? '+' : ''}
              {delta.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
