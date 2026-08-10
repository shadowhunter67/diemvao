import type { AdmissionConfig, AdmissionResult } from '../schools/hcmut/types/admission';

interface ScoreBreakdownDetailsProps {
  result: AdmissionResult;
  config: AdmissionConfig;
}

function toPercent(weight: number): string {
  return `${Math.round(weight * 100)}%`;
}

export function ScoreBreakdownDetails({ result, config }: ScoreBreakdownDetailsProps) {
  return (
    <div className="flex flex-col gap-5 text-sm">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Điểm học lực</h3>
        <dl className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <dt className="text-muted">ĐGNL chuẩn hóa</dt>
            <dd className="font-medium text-ink">{result.dgnl.normalizedScore.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between pl-3">
            <dt className="text-muted/70">Đóng góp {toPercent(config.weights.dgnl)}</dt>
            <dd className="font-medium text-ink/80">+{result.academic.dgnlContribution.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">THPT chuẩn hóa</dt>
            <dd className="font-medium text-ink">{result.thpt.normalizedScore.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between pl-3">
            <dt className="text-muted/70">Đóng góp {toPercent(config.weights.thpt)}</dt>
            <dd className="font-medium text-ink/80">+{result.academic.thptContribution.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Học bạ chuẩn hóa</dt>
            <dd className="font-medium text-ink">{result.transcript.normalizedScore.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between pl-3">
            <dt className="text-muted/70">Đóng góp {toPercent(config.weights.transcript)}</dt>
            <dd className="font-medium text-ink/80">+{result.academic.transcriptContribution.toFixed(2)}</dd>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-ink/10 pt-1.5">
            <dt className="font-semibold text-ink">Điểm học lực</dt>
            <dd className="font-semibold text-ink">{result.academic.score.toFixed(2)}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Ưu tiên &amp; điểm cộng</h3>
        <dl className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <dt className="text-muted">Điểm cộng gốc</dt>
            <dd className="font-medium text-ink">{result.bonus.raw.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Điểm cộng nhận</dt>
            <dd className="font-medium text-ink">{result.bonus.received.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Ưu tiên quy đổi</dt>
            <dd className="font-medium text-ink">{result.priority.converted.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Ưu tiên thực nhận</dt>
            <dd className="font-medium text-ink">{result.priority.received.toFixed(2)}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center justify-between border-t border-ink/10 pt-2">
        <span className="font-semibold text-ink">Tổng</span>
        <span className="font-semibold text-ink">{result.finalScore.toFixed(2)}</span>
      </div>
    </div>
  );
}
