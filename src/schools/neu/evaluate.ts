import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import { findNeuVactEquivalenceBand } from './equivalence';
import { neuEquivalenceBandEvidence } from './evidence';
import { neuKnowledgeGaps } from './knowledgeGaps';
import { neuAdmissionMethods } from './methods';

export interface NeuEquivalenceEvaluationContext {
  vactScore?: number;
}

export function evaluateNeuEquivalence(profile: ApplicantProfile, context: NeuEquivalenceEvaluationContext = {}): AdmissionEvaluation {
  const method = neuAdmissionMethods[0];
  const vactScore = context.vactScore ?? profile.exams?.vact?.total;
  const explanation: CalculationStep[] = [];
  const officialGaps = neuKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }));
  const missingRequirements: MissingRequirement[] = [];

  if (vactScore === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'neu-vact', label: 'V-ACT score for NEU equivalence band lookup.' });
    return {
      schoolId: 'neu',
      year: method.year,
      methodId: method.id,
      confidence: 'unavailable',
      eligibility: { status: 'unknown', reasons: ['V-ACT score is required to look up NEU equivalence band.'] },
      missingInputs: ['Missing V-ACT score.'],
      missingRules: neuKnowledgeGaps.map((gap) => gap.label),
      missingRequirements: [...missingRequirements, ...officialGaps],
      explanation,
      evidence: [],
    };
  }

  const band = findNeuVactEquivalenceBand(vactScore);
  const status = band ? 'eligible' : 'ineligible';
  const reason = band
    ? `V-ACT ${vactScore} is in NEU equivalent band THPT ${band.thpt[0]}-${band.thpt[1]}/30.`
    : 'V-ACT score is below the lowest NEU published equivalence band (700-752 -> THPT 22-24).';

  explanation.push({
    id: 'neu-vact-equivalence-band',
    label: 'NEU V-ACT equivalent score band',
    output: vactScore,
    formula: band ? `V-ACT ${band.vact[0]}-${band.vact[1]} -> THPT ${band.thpt[0]}-${band.thpt[1]}` : 'No published band matched',
    evidence: neuEquivalenceBandEvidence.evidence,
  });

  return {
    schoolId: 'neu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: [reason] },
    missingInputs: [],
    missingRules: neuKnowledgeGaps.map((gap) => gap.label),
    missingRequirements: officialGaps,
    explanation,
    evidence: neuEquivalenceBandEvidence.evidence,
  };
}

