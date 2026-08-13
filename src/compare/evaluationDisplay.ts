import type { ResultConfidence } from '../core/admissionEvaluation';

export type EvaluationDisplayStatus = 'exact' | 'partial' | 'unavailable';

export function getEvaluationDisplayStatus(confidence: ResultConfidence): EvaluationDisplayStatus {
  if (confidence === 'exact-verified' || confidence === 'exact-cross-checked') return 'exact';
  if (confidence === 'partial') return 'partial';
  return 'unavailable';
}

export function evaluationDisplayLabel(status: EvaluationDisplayStatus): string {
  switch (status) {
    case 'exact':
      return 'Tính được chính xác';
    case 'partial':
      return 'Tính được một phần';
    case 'unavailable':
      return 'Chưa đủ dữ liệu để tính';
  }
}

export function evaluationSortWeight(status: EvaluationDisplayStatus): number {
  switch (status) {
    case 'exact':
      return 0;
    case 'partial':
      return 1;
    case 'unavailable':
      return 2;
  }
}
