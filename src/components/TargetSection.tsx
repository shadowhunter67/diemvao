import { AlertTriangle, CheckCircle2, Target, TrendingUp } from 'lucide-react';
import type { AdmissionConfig, AdmissionResult, RequiredDgnlResult } from '../types/admission';
import { ScoreInput } from './ScoreInput';

interface TargetSectionProps {
  config: AdmissionConfig;
  targetValue: string;
  targetError: string | null;
  result: AdmissionResult | null;
  requiredResult: RequiredDgnlResult | null;
  onTargetChange: (value: string) => void;
}

export function TargetSection({
  config,
  targetValue,
  targetError,
  result,
  requiredResult,
  onTargetChange,
}: TargetSectionProps) {
  const currentFinalScore = result?.finalScore ?? null;
  const hasValidTarget = targetValue.trim() !== '' && targetError === null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <Target size={18} className="text-blue-600" aria-hidden="true" />
        <h2 className="text-base font-semibold text-slate-900">Mục tiêu của bạn</h2>
      </div>

      <div className="mt-4">
        <ScoreInput
          id="target-score"
          label="Điểm mục tiêu"
          hint={`0 - ${config.scoreScale}`}
          value={targetValue}
          error={targetError}
          onChange={onTargetChange}
        />
      </div>

      {currentFinalScore === null ? (
        <p className="mt-4 text-sm text-slate-400">Nhập điểm để so sánh với mục tiêu.</p>
      ) : (
        <dl className="mt-4 flex flex-col gap-1.5 rounded-lg bg-slate-50 p-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Điểm hiện tại</dt>
            <dd className="font-medium text-slate-800">{currentFinalScore.toFixed(2)}</dd>
          </div>
          {hasValidTarget && (
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Còn thiếu</dt>
              <dd className="font-medium text-slate-800">
                {Math.max(0, Number(targetValue) - currentFinalScore).toFixed(2)}
              </dd>
            </div>
          )}
        </dl>
      )}

      {requiredResult && <TargetStatus requiredResult={requiredResult} targetValue={targetValue} />}
    </section>
  );
}

interface TargetStatusProps {
  requiredResult: RequiredDgnlResult;
  targetValue: string;
}

function TargetStatus({ requiredResult, targetValue }: TargetStatusProps) {
  if (requiredResult.alreadyReached) {
    return (
      <p className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>Bạn đã đạt mức điểm mục tiêu.</span>
      </p>
    );
  }

  if (requiredResult.possible) {
    return (
      <p className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
        <TrendingUp size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          Để đạt {Number(targetValue).toFixed(2)} điểm, với các thành phần khác giữ nguyên, bạn cần khoảng{' '}
          <strong>{requiredResult.requiredNormalizedScore!.toFixed(2)}</strong> điểm ĐGNL chuẩn hóa (tổng sau hệ số{' '}
          {requiredResult.requiredWeightedRawScore!.toFixed(2)}).
        </span>
      </p>
    );
  }

  return (
    <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div>
        <p>Không thể đạt mục tiêu này chỉ bằng việc tăng điểm ĐGNL.</p>
        <p className="mt-1 text-amber-700">
          Điểm tối đa có thể đạt với các dữ liệu khác giữ nguyên: {requiredResult.maxAchievableFinalScore.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
