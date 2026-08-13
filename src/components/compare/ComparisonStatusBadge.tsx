import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { evaluationDisplayLabel, getEvaluationDisplayStatus } from '../../compare/evaluationDisplay';
import type { ResultConfidence } from '../../core/admissionEvaluation';

function StatusIcon({ status }: { status: ReturnType<typeof getEvaluationDisplayStatus> }) {
  if (status === 'exact') return <CheckCircle2 size={16} className="text-success" aria-hidden="true" />;
  if (status === 'partial') return <AlertCircle size={16} className="text-warning" aria-hidden="true" />;
  return <Circle size={14} className="text-muted" aria-hidden="true" />;
}

export function ComparisonStatusBadge({ confidence }: { confidence: ResultConfidence }) {
  const status = getEvaluationDisplayStatus(confidence);
  return (
    <span className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-ink">
      <StatusIcon status={status} />
      {evaluationDisplayLabel(status)}
    </span>
  );
}
