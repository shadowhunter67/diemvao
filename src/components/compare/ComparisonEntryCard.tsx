import { ArrowDown, ArrowUp, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import type { MissingRequirement } from '../../core/admissionEvaluation';
import type { SchoolEvaluationSummary } from '../../compare/evaluateApplicantAcrossSchools';
import { withMissingRequirementActions } from '../../compare/missingRequirementActions';
import { ComparisonStatusBadge } from './ComparisonStatusBadge';
import type { ProgramOption } from './types';

function formatDifference(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
}

function getRequirements(summary: SchoolEvaluationSummary): MissingRequirement[] {
  if ((summary.evaluation.missingRequirements ?? []).length > 0) {
    return withMissingRequirementActions(summary.schoolId, summary.evaluation.missingRequirements ?? []);
  }
  return [
    ...summary.evaluation.missingInputs.map((label, index) => ({ kind: 'profile-input' as const, code: `${summary.schoolId}-input-${index}`, label })),
    ...summary.evaluation.missingRules.map((label, index) => ({ kind: 'official-rule' as const, code: `${summary.schoolId}-rule-${index}`, label })),
  ];
}

export function ComparisonEntryCard({
  summary,
  program,
  combinationId,
  canMoveUp,
  canMoveDown,
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
  onOpenSchool,
}: {
  summary: SchoolEvaluationSummary;
  program?: ProgramOption;
  combinationId?: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpenSchool: (schoolId: string) => void;
}) {
  const score = summary.evaluation.score;
  const requirements = getRequirements(summary);

  return (
    <article className="rounded-card border border-ink/10 bg-surface p-5 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">{summary.shortName}</h2>
          <p className="text-xs text-muted">{summary.schoolName}</p>
          {program && (
            <p className="mt-1 text-sm font-medium text-ink">
              {program.code ? `${program.code} - ` : ''}
              {program.name}
            </p>
          )}
          <p className="mt-1 text-xs text-muted">
            {summary.methodName}
            {combinationId ? ` · ${combinationId}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <ComparisonStatusBadge confidence={summary.evaluation.confidence} />
          <button type="button" onClick={onEdit} title="Đổi ngành/trường" className="rounded-md border border-ink/10 p-1.5 text-muted hover:text-ink">
            <Pencil size={14} aria-hidden="true" />
          </button>
          <button type="button" onClick={onMoveUp} disabled={!canMoveUp} title="Lên trên" className="rounded-md border border-ink/10 p-1.5 text-muted hover:text-ink disabled:opacity-40">
            <ArrowUp size={14} aria-hidden="true" />
          </button>
          <button type="button" onClick={onMoveDown} disabled={!canMoveDown} title="Xuống dưới" className="rounded-md border border-ink/10 p-1.5 text-muted hover:text-ink disabled:opacity-40">
            <ArrowDown size={14} aria-hidden="true" />
          </button>
          <button type="button" onClick={onRemove} title="Xóa khỏi so sánh" className="rounded-md border border-ink/10 p-1.5 text-muted hover:text-danger">
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        {score ? (
          <p className="text-ink">
            Điểm xét tuyển: <strong className="text-primary">{score.value.toFixed(2)}</strong>
            <span className="text-muted"> / {score.scale}</span>
          </p>
        ) : (
          <p className="text-muted">Chưa có điểm xét tuyển cuối cùng để so sánh.</p>
        )}

        {summary.cutoffComparisons && summary.cutoffComparisons.length > 0 && (
          <div className="rounded-md bg-surface-soft p-3 text-xs">
            {summary.cutoffComparisons[0].referenceType === 'none' ? (
              <p className="text-muted">{summary.cutoffComparisons[0].reasonNotComparable}</p>
            ) : (
              <div className="space-y-2">
                {summary.cutoffComparisons.map((cutoffComparison) => (
                  <div key={cutoffComparison.year} className={cutoffComparison !== summary.cutoffComparisons![0] ? 'border-t border-ink/10 pt-2' : undefined}>
                    <p className="font-medium text-ink">
                      {cutoffComparison.referenceType === 'historical' ? 'Mốc tham khảo' : 'Điểm chuẩn'} {cutoffComparison.year}: {cutoffComparison.cutoff.toFixed(2)}
                      {cutoffComparison.cutoffScale ? ` / ${cutoffComparison.cutoffScale}` : ''}
                    </p>
                    {cutoffComparison.comparable && cutoffComparison.difference !== undefined ? (
                      <p className="mt-1 text-muted">
                        Chênh lệch: <span className="font-medium text-ink">{formatDifference(cutoffComparison.difference)}</span>
                      </p>
                    ) : (
                      <p className="mt-1 text-muted">{cutoffComparison.reasonNotComparable}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {summary.evaluation.explanation.length > 0 && (
          <div>
            <p className="text-xs font-medium text-ink">Đã tính được</p>
            <ul className="mt-1 space-y-1 text-xs text-muted">
              {summary.evaluation.explanation.slice(0, 4).map((step) => (
                <li key={step.id}>
                  {step.label}
                  {step.output !== undefined && (
                    <span className="text-ink">
                      : {step.output.toFixed(2)}
                      {step.scale !== undefined ? ` / ${step.scale}` : ''}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {requirements.length > 0 && (
          <div className="rounded-md bg-surface-soft p-3 text-xs">
            <p className="font-medium text-ink">Còn thiếu</p>
            <ul className="mt-1 space-y-1 text-muted">
              {requirements.slice(0, 5).map((requirement) => (
                <li key={requirement.code}>
                  {requirement.label}
                  {requirement.action && (
                    <a href={requirement.action.href} className="ml-2 inline-flex items-center gap-1 font-medium text-accent">
                      {requirement.action.label}
                      <ExternalLink size={11} aria-hidden="true" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <details className="rounded-md border border-ink/10 bg-surface-soft px-3 py-2">
          <summary className="cursor-pointer text-xs font-medium text-ink">Xem cách tính và nguồn</summary>
          <ol className="mt-2 space-y-2 text-xs text-muted">
            {summary.evaluation.explanation.map((step, index) => (
              <li key={step.id}>
                <span className="font-medium text-ink">
                  {index + 1}. {step.label}
                </span>
                {step.formula && <p className="mt-0.5 break-words font-mono">{step.formula}</p>}
                {step.description && <p className="mt-0.5">{step.description}</p>}
              </li>
            ))}
          </ol>
        </details>
      </div>

      <button
        type="button"
        onClick={() => onOpenSchool(summary.schoolId)}
        className="mt-4 inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
      >
        Xem {summary.shortName}
        <ExternalLink size={12} aria-hidden="true" />
      </button>
    </article>
  );
}

