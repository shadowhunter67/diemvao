import type { ApplicantProfile } from '../../core/applicantProfile';
import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import type { ThresholdOnlyEvaluationContext } from '../thptThresholdOnly';
import { vnuaAdmissionMethods } from './methods';
import { getVnuaProgramGroupThreshold, type VnuaProgramGroupId } from './thresholds';

export interface VnuaThptExamEvaluationContext extends ThresholdOnlyEvaluationContext {
  programGroupId?: VnuaProgramGroupId;
}

const COMMON_THPT_MIN30 = 15;
const thresholdLocation = 'Official VNUA 2026 threshold notice, image table tb1.jpg';

function sumThptTotal(profile: ApplicantProfile, subjects: readonly SubjectId[]): { total30?: number; missingSubjects: SubjectId[] } {
  let total = 0;
  const missingSubjects: SubjectId[] = [];
  for (const subjectId of subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) missingSubjects.push(subjectId);
    else total += score;
  }
  if (missingSubjects.length > 0) return { missingSubjects };
  return { total30: Math.round(total * 100) / 100, missingSubjects };
}

export function evaluateVnuaThptExamAdmission(profile: ApplicantProfile, context: VnuaThptExamEvaluationContext = {}): AdmissionEvaluation {
  const method = vnuaAdmissionMethods[0];
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const missingRules = (method.knowledgeGaps ?? []).map((gap) => gap.label);
  const gapRequirements = (method.knowledgeGaps ?? []).map((gap) => ({
    kind: 'official-rule' as const,
    code: gap.id,
    label: gap.label,
  }));
  const reasons: string[] = [];
  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';

  if (!context.subjectContext) {
    missingRequirements.push({
      kind: 'school-context',
      code: 'vnua-subject-combination',
      label: 'Select a VNUA subject combination for THPT threshold checking.',
    });
    reasons.push('VNUA needs a selected subject combination before the THPT threshold can be checked.');
  } else {
    const { total30, missingSubjects } = sumThptTotal(profile, context.subjectContext.subjects);

    if (missingSubjects.length > 0) {
      missingInputs.push('Missing THPT scores for the selected VNUA subject combination.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `vnua-thpt-${subjectId}`,
          label: `THPT score for ${SUBJECT_LABELS[subjectId]} in the selected VNUA combination.`,
        }))
      );
      reasons.push('VNUA needs all three THPT subject scores in the selected combination.');
    }

    if (total30 !== undefined) {
      explanation.push({
        id: 'vnua-thpt-group-threshold',
        label: 'VNUA 2026 THPT threshold',
        output: total30,
        scale: 30,
        formula:
          'Total of three THPT subjects must be at least 15/30 and must also meet the published group-specific THPT threshold.',
        evidence: [{ sourceId: 'vnua-threshold-notice-2026', location: thresholdLocation, verification: 'verified', effectiveYear: 2026 }],
      });

      if (total30 < COMMON_THPT_MIN30) {
        status = 'ineligible';
        reasons.push(`Total ${total30}/30 is below VNUA's common THPT baseline of ${COMMON_THPT_MIN30}/30.`);
      } else if (!context.programGroupId) {
        missingRequirements.push({
          kind: 'school-context',
          code: 'vnua-program-group',
          label: 'Select the VNUA program group (HVN01-HVN23) to apply the group-specific threshold.',
        });
        reasons.push(`Total ${total30}/30 meets the common baseline, but VNUA also requires a group-specific threshold.`);
      } else {
        const threshold = getVnuaProgramGroupThreshold(context.programGroupId);
        if (!threshold) {
          missingRequirements.push({
            kind: 'school-context',
            code: 'vnua-program-group',
            label: 'Select a valid VNUA program group (HVN01-HVN23).',
          });
          reasons.push(`Program group ${context.programGroupId} is not in the imported VNUA threshold table.`);
        } else if (threshold.governedByMinistry || threshold.thptMin30 === undefined) {
          missingRequirements.push({
            kind: 'official-rule',
            code: 'vnua-ministry-governed-group-threshold',
            label: `${threshold.groupId} ${threshold.groupName} follows Ministry of Education and Training threshold rules that are not modeled yet.`,
          });
          reasons.push(`${threshold.groupId} ${threshold.groupName} is governed by MOET threshold rules, so the runtime cannot conclude eligibility yet.`);
        } else if (total30 < threshold.thptMin30) {
          status = 'ineligible';
          reasons.push(`Total ${total30}/30 is below ${threshold.groupId} ${threshold.groupName}'s published THPT threshold of ${threshold.thptMin30}/30.`);
        } else {
          status = 'eligible';
          reasons.push(`Total ${total30}/30 meets ${threshold.groupId} ${threshold.groupName}'s published THPT threshold of ${threshold.thptMin30}/30.`);
        }
      }
    }
  }

  return {
    schoolId: 'vnua',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons },
    missingInputs,
    missingRules,
    missingRequirements: [...missingRequirements, ...gapRequirements],
    explanation,
    evidence: [{ sourceId: 'vnua-threshold-notice-2026', location: thresholdLocation, verification: 'verified', effectiveYear: 2026 }],
  } satisfies AdmissionEvaluation;
}

