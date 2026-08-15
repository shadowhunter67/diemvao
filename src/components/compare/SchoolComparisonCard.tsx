import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import type { MissingRequirement, MissingRequirementKind } from '../../core/admissionEvaluation';
import type { SchoolEvaluationSummary } from '../../compare/evaluateApplicantAcrossSchools';
import { summarizeEvaluationCompleteness } from '../../compare/evaluationCompleteness';
import { withMissingRequirementActions } from '../../compare/missingRequirementActions';
import { ComparisonStatusBadge } from './ComparisonStatusBadge';
import type { ProgramOption } from './types';

const missingRequirementLabels: Record<MissingRequirementKind, string> = {
  'profile-input': 'Cần bạn bổ sung',
  'school-context': 'Thiếu lựa chọn/ngữ cảnh trường',
  'official-rule': 'Đang thiếu quy tắc chính thức',
  unsupported: 'UniScoreVN chưa hỗ trợ phần này',
};

const missingRequirementOrder: MissingRequirementKind[] = ['profile-input', 'school-context', 'official-rule', 'unsupported'];

function formatDifference(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
}

function campusLabel(campus?: string): string | undefined {
  if (campus === 'hcmc') return 'TP.HCM';
  if (campus === 'mekong') return 'UEH Mekong';
  return undefined;
}

function getRequirementsForDisplay(summary: SchoolEvaluationSummary): MissingRequirement[] {
  if (summary.evaluation.missingRequirements && summary.evaluation.missingRequirements.length > 0) {
    return withMissingRequirementActions(summary.schoolId, summary.evaluation.missingRequirements);
  }
  return [
    ...summary.evaluation.missingInputs.map((label, index) => ({
      kind: 'profile-input' as const,
      code: `${summary.schoolId}-missing-input-${index}`,
      label,
    })),
    ...summary.evaluation.missingRules.map((label, index) => ({
      kind: 'official-rule' as const,
      code: `${summary.schoolId}-missing-rule-${index}`,
      label,
    })),
  ];
}

function SchoolContextSummary({
  selectedProgram,
  methodName,
  combinationId,
}: {
  selectedProgram?: ProgramOption;
  methodName: string;
  combinationId?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 text-xs">
      {selectedProgram && (
        <span className="rounded-full bg-surface-soft px-2 py-1 text-muted">
          Ngành: <span className="text-ink">{selectedProgram.name}</span>
        </span>
      )}
      <span className="rounded-full bg-surface-soft px-2 py-1 text-muted">
        Phương thức: <span className="text-ink">{methodName}</span>
      </span>
      {combinationId && (
        <span className="rounded-full bg-surface-soft px-2 py-1 text-muted">
          Tổ hợp: <span className="text-ink">{combinationId}</span>
        </span>
      )}
      {selectedProgram?.campus && (
        <span className="rounded-full bg-surface-soft px-2 py-1 text-muted">
          Cơ sở: <span className="text-ink">{campusLabel(selectedProgram.campus)}</span>
        </span>
      )}
    </div>
  );
}

function ProgramSelector({
  schoolId,
  selectedProgramId,
  options,
  onSelectProgram,
}: {
  schoolId: string;
  selectedProgramId?: string;
  options: readonly ProgramOption[];
  onSelectProgram: (schoolId: string, programId: string) => void;
}) {
  return (
    <label className="block text-xs font-medium text-ink">
      Ngành đang so
      <select
        value={selectedProgramId ?? ''}
        onChange={(event) => onSelectProgram(schoolId, event.target.value)}
        className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-xs"
      >
        <option value="">Chưa chọn ngành</option>
        {options.map((program) => (
          <option key={program.id} value={program.id}>
            {program.code ? `${program.code} - ` : ''}
            {program.name}
            {program.campus ? ` (${campusLabel(program.campus)})` : ''}
          </option>
        ))}
      </select>
    </label>
  );
}

function MissingRequirementsList({ requirements }: { requirements: readonly MissingRequirement[] }) {
  return (
    <>
      {missingRequirementOrder.map((kind) => {
        const group = requirements.filter((requirement) => requirement.kind === kind);
        if (group.length === 0) return null;
        return (
          <div key={kind}>
            <p className="text-xs font-medium text-ink">{missingRequirementLabels[kind]}</p>
            <ul className="mt-1 space-y-1 text-xs text-muted">
              {group.map((requirement) => (
                <li key={requirement.code} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>{requirement.label}</span>
                  {requirement.action && (
                    <a
                      href={requirement.action.href}
                      className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-2 py-1 font-medium text-accent hover:bg-accent/20"
                    >
                      {requirement.action.label}
                      <ExternalLink size={11} aria-hidden="true" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}

function NextActions({ evaluationSummary, requirements }: { evaluationSummary: SchoolEvaluationSummary; requirements: readonly MissingRequirement[] }) {
  const completeness = summarizeEvaluationCompleteness(evaluationSummary.evaluation);
  const userActionRequirements = requirements.filter((requirement) => requirement.action);

  return (
    <div className="rounded-md bg-surface-soft p-3 text-xs">
      <p className="font-medium text-ink">Bạn có thể làm gì tiếp?</p>
      {userActionRequirements.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {userActionRequirements.map((requirement) => (
            <a
              key={requirement.code}
              href={requirement.action?.href}
              className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-2 py-1 font-medium text-accent hover:bg-accent/20"
            >
              {requirement.action?.label}
              <ExternalLink size={11} aria-hidden="true" />
            </a>
          ))}
        </div>
      ) : completeness.blockedByOfficialRules ? (
        <p className="mt-1 text-muted">Hiện chưa có thao tác nào từ phía bạn để tính thêm. UniScoreVN đang thiếu quy tắc chính thức.</p>
      ) : (
        <p className="mt-1 text-muted">Dữ liệu và ngữ cảnh người dùng cần cho phần đang hỗ trợ đã đủ.</p>
      )}
      {completeness.userCanImprove && (
        <p className="mt-2 text-muted">
          Còn {completeness.missingUserInputs + completeness.missingContext} thông tin bạn có thể bổ sung.
        </p>
      )}
    </div>
  );
}

function CutoffComparisonBlock({
  summary,
  hasSelectedProgram,
}: {
  summary: SchoolEvaluationSummary;
  hasSelectedProgram: boolean;
}) {
  const score = summary.evaluation.score;
  const comparison = summary.cutoffComparison;

  if (comparison) {
    return (
      <div className="rounded-md bg-surface-soft p-3 text-xs">
        {comparison.referenceType === 'none' ? (
          <p className="text-muted">{comparison.reasonNotComparable}</p>
        ) : (
          <>
            <p className="font-medium text-ink">
              {comparison.referenceType === 'historical' ? 'Mốc tham khảo' : 'Mốc điểm chuẩn'} {comparison.year}: {comparison.cutoff.toFixed(2)}
              {comparison.cutoffScale !== undefined ? ` / ${comparison.cutoffScale}` : ''}
            </p>
            {comparison.comparable && comparison.difference !== undefined ? (
              <>
                <p className="mt-1 text-muted">
                  Điểm xét tuyển đã tính được:{' '}
                  <span className="font-medium text-ink">
                    {comparison.applicantScore.toFixed(2)} / {comparison.applicantScale}
                  </span>
                </p>
                <p className="mt-1 text-muted">
                  {comparison.difference >= 0 ? 'Cao hơn mốc' : 'Thấp hơn mốc'}:{' '}
                  <span className="font-medium text-ink">{formatDifference(Math.abs(comparison.difference))}</span>
                </p>
                <p className="mt-1 text-muted">Không phải dự đoán trúng tuyển.</p>
              </>
            ) : (
              <p className="mt-1 text-muted">{comparison.reasonNotComparable}</p>
            )}
          </>
        )}
      </div>
    );
  }

  if (score) {
    return <div className="rounded-md bg-surface-soft p-3 text-xs text-muted">Chưa có mốc điểm chuẩn phù hợp để so.</div>;
  }

  if (hasSelectedProgram) {
    return (
      <div className="rounded-md bg-surface-soft p-3 text-xs text-muted">
        Chưa thể so với điểm chuẩn vì chưa tính được điểm xét tuyển cuối.
      </div>
    );
  }

  return null;
}

function CalculationDetails({ summary }: { summary: SchoolEvaluationSummary }) {
  if (summary.evaluation.explanation.length === 0) return null;

  return (
    <details className="w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2">
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
  );
}

export function SchoolComparisonCard({
  summary,
  selectedProgramId,
  options,
  combinationId,
  contextControls,
  onSelectProgram,
  onOpenSchool,
}: {
  summary: SchoolEvaluationSummary;
  selectedProgramId?: string;
  options: readonly ProgramOption[];
  combinationId?: string;
  contextControls?: ReactNode;
  onSelectProgram: (schoolId: string, programId: string) => void;
  onOpenSchool: (schoolId: string) => void;
}) {
  const score = summary.evaluation.score;
  const requirements = getRequirementsForDisplay(summary);
  const selectedProgram = options.find((program) => program.id === selectedProgramId);
  const officialRequirements = requirements.filter((requirement) => requirement.kind === 'official-rule');
  const userActionRequirements = requirements.filter((requirement) => requirement.action);

  return (
    <article className="rounded-card border border-ink/10 bg-surface p-5 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">{summary.shortName}</h2>
          <p className="text-xs text-muted">{summary.schoolName}</p>
        </div>
        <ComparisonStatusBadge confidence={summary.evaluation.confidence} />
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <SchoolContextSummary selectedProgram={selectedProgram} methodName={summary.methodName} combinationId={combinationId} />
        {contextControls && <div className="rounded-md bg-surface-soft p-3">{contextControls}</div>}
        <ProgramSelector schoolId={summary.schoolId} selectedProgramId={selectedProgramId} options={options} onSelectProgram={onSelectProgram} />

        {score ? (
          <p className="text-ink">
            Điểm xét tuyển: <strong className="text-primary">{score.value.toFixed(2)}</strong>
            <span className="text-muted"> / {score.scale}</span>
          </p>
        ) : (
          <p className="text-muted">Chưa có điểm xét tuyển cuối cùng để so sánh.</p>
        )}

        {summary.evaluation.explanation.length > 0 && (
          <div>
            <p className="text-xs font-medium text-ink">Đã xử lý được</p>
            <ul className="mt-1 space-y-1 text-xs text-muted">
              {summary.evaluation.explanation.map((step) => (
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

        <MissingRequirementsList requirements={requirements} />
        <NextActions evaluationSummary={summary} requirements={requirements} />
        <CutoffComparisonBlock summary={summary} hasSelectedProgram={selectedProgram !== undefined} />

        {officialRequirements.length > 0 && userActionRequirements.length === 0 && (
          <p className="text-xs text-muted">Đã dùng toàn bộ dữ liệu bạn có trong phần hỗ trợ được; phần còn lại phụ thuộc quy tắc chính thức.</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOpenSchool(summary.schoolId)}
          className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
        >
          Xem {summary.shortName}
          <ExternalLink size={12} aria-hidden="true" />
        </button>
        <CalculationDetails summary={summary} />
      </div>
    </article>
  );
}
