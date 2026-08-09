import type { AdmissionConfig, AdmissionResult } from '../types/admission';

interface ScoreBreakdownListProps {
  result: AdmissionResult;
  config: AdmissionConfig;
}

function toPercent(weight: number): string {
  return `${Math.round(weight * 100)}%`;
}

export function ScoreBreakdownList({ result, config }: ScoreBreakdownListProps) {
  return (
    <div className="flex flex-col gap-5 text-sm">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Điểm học lực</h3>
        <dl className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">ĐGNL chuẩn hóa</dt>
            <dd className="font-medium text-slate-800">{result.dgnl.normalizedScore.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between pl-3">
            <dt className="text-slate-400">Đóng góp {toPercent(config.weights.dgnl)}</dt>
            <dd className="font-medium text-slate-700">+{result.academic.dgnlContribution.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">THPT chuẩn hóa</dt>
            <dd className="font-medium text-slate-800">{result.thpt.normalizedScore.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between pl-3">
            <dt className="text-slate-400">Đóng góp {toPercent(config.weights.thpt)}</dt>
            <dd className="font-medium text-slate-700">+{result.academic.thptContribution.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Học bạ chuẩn hóa</dt>
            <dd className="font-medium text-slate-800">{result.transcript.normalizedScore.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between pl-3">
            <dt className="text-slate-400">Đóng góp {toPercent(config.weights.transcript)}</dt>
            <dd className="font-medium text-slate-700">+{result.academic.transcriptContribution.toFixed(2)}</dd>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-slate-200 pt-1.5">
            <dt className="font-semibold text-slate-900">Điểm học lực</dt>
            <dd className="font-semibold text-slate-900">{result.academic.score.toFixed(2)}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Ưu tiên &amp; điểm cộng</h3>
        <dl className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Điểm cộng gốc</dt>
            <dd className="font-medium text-slate-800">{result.bonus.raw.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Điểm cộng nhận</dt>
            <dd className="font-medium text-slate-800">{result.bonus.received.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Ưu tiên quy đổi</dt>
            <dd className="font-medium text-slate-800">{result.priority.converted.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Ưu tiên thực nhận</dt>
            <dd className="font-medium text-slate-800">{result.priority.received.toFixed(2)}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-2">
        <span className="font-semibold text-slate-900">Tổng</span>
        <span className="font-semibold text-slate-900">{result.finalScore.toFixed(2)}</span>
      </div>
    </div>
  );
}
