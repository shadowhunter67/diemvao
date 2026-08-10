import { AlertTriangle, CheckCircle2, Target, TrendingUp } from 'lucide-react';
import type { AdmissionConfig, AdmissionResult, RequiredDgnlResult } from '../schools/hcmut/types/admission';
import { ScoreInput } from './ScoreInput';

interface TargetSectionProps {
  config: AdmissionConfig;
  targetValue: string;
  targetError: string | null;
  result: AdmissionResult | null;
  requiredResult: RequiredDgnlResult | null;
  onTargetChange: (value: string) => void;
  onUseRequiredInSimulator: (weightedRaw: number) => void;
  /** Tên ngành nếu điểm mục tiêu hiện tại đang khớp đúng mục tiêu mô phỏng từ ngành đó. */
  activeTargetSourceLabel?: string | null;
}

export function TargetSection({
  config,
  targetValue,
  targetError,
  result,
  requiredResult,
  onTargetChange,
  onUseRequiredInSimulator,
  activeTargetSourceLabel,
}: TargetSectionProps) {
  const currentFinalScore = result?.finalScore ?? null;
  const hasValidTarget = targetValue.trim() !== '' && targetError === null;

  return (
    <section className="rounded-2xl bg-surface-soft p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <Target size={20} className="text-accent" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-ink">Mục tiêu của bạn</h2>
      </div>

      {activeTargetSourceLabel && (
        <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
          Đang dùng mục tiêu từ ngành "{activeTargetSourceLabel}"
        </p>
      )}

      <div className="mt-6 flex flex-col gap-6">
        <ScoreInput
          id="target-score"
          label="Điểm mục tiêu"
          hint={`0 - ${config.scoreScale}`}
          value={targetValue}
          error={targetError}
          onChange={onTargetChange}
        />

        {currentFinalScore === null ? (
          <p className="text-sm text-muted">Nhập điểm để so sánh với mục tiêu.</p>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Hiện tại</span>
              <p className="text-lg font-semibold text-ink">{currentFinalScore.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Mục tiêu</span>
              <p className="text-lg font-semibold text-ink">
                {hasValidTarget ? Number(targetValue).toFixed(2) : '—'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Còn thiếu</span>
              <p className="text-lg font-semibold text-ink">
                {hasValidTarget ? Math.max(0, Number(targetValue) - currentFinalScore).toFixed(2) : '—'}
              </p>
            </div>
          </div>
        )}
      </div>

      {requiredResult && (
        <TargetStatus
          requiredResult={requiredResult}
          targetValue={targetValue}
          onUseRequiredInSimulator={onUseRequiredInSimulator}
        />
      )}
    </section>
  );
}

interface TargetStatusProps {
  requiredResult: RequiredDgnlResult;
  targetValue: string;
  onUseRequiredInSimulator: (weightedRaw: number) => void;
}

function TargetStatus({ requiredResult, targetValue, onUseRequiredInSimulator }: TargetStatusProps) {
  if (requiredResult.alreadyReached) {
    return (
      <p className="mt-6 flex items-start gap-2 rounded-lg bg-success/10 p-4 text-sm text-success">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>Bạn đã đạt mức điểm mục tiêu.</span>
      </p>
    );
  }

  if (requiredResult.possible) {
    return (
      <div className="mt-6 flex items-start gap-2 rounded-lg bg-accent/10 p-4 text-sm text-primary">
        <TrendingUp size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p>
            Để đạt {Number(targetValue).toFixed(2)} điểm, với các thành phần khác giữ nguyên, bạn cần khoảng{' '}
            <strong>{requiredResult.requiredNormalizedScore!.toFixed(2)}</strong> điểm ĐGNL chuẩn hóa
            {' '}(≈ {requiredResult.requiredWeightedRawScore!.toFixed(0)} sau hệ số).
          </p>
          <button
            type="button"
            onClick={() => onUseRequiredInSimulator(requiredResult.requiredWeightedRawScore!)}
            className="mt-3 inline-flex items-center rounded-md border border-accent/30 bg-surface px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            Dùng trong mô phỏng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex items-start gap-2 rounded-lg bg-warning/10 p-4 text-sm text-warning">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div>
        <p>Không thể đạt mục tiêu này chỉ bằng việc tăng điểm ĐGNL.</p>
        <p className="mt-1">
          Điểm tối đa có thể đạt với các dữ liệu khác giữ nguyên: {requiredResult.maxAchievableFinalScore.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
