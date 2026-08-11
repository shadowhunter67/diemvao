import type { UehCutoff, UehProgram } from '../types/programs';
import { uehCutoffs } from './cutoffs';
import { uehPrograms } from './programs';

export type DatasetIssueType =
  | 'duplicate-program-id'
  | 'cutoff-unknown-program'
  | 'multiple-final-year-program'
  | 'score-out-of-range';

export interface DatasetIssue {
  type: DatasetIssueType;
  message: string;
}

export function validateUehDataset(
  programs: UehProgram[] = uehPrograms,
  cutoffs: UehCutoff[] = uehCutoffs
): DatasetIssue[] {
  const issues: DatasetIssue[] = [];

  const seenProgramIds = new Set<string>();
  for (const program of programs) {
    if (seenProgramIds.has(program.id)) {
      issues.push({ type: 'duplicate-program-id', message: `Trùng id ngành: "${program.id}"` });
    }
    seenProgramIds.add(program.id);
  }

  const programIds = new Set(programs.map((program) => program.id));
  const finalCountByYearProgram = new Map<string, number>();

  for (const cutoff of cutoffs) {
    if (!programIds.has(cutoff.programId)) {
      issues.push({
        type: 'cutoff-unknown-program',
        message: `Cutoff năm ${cutoff.year} trỏ tới programId không tồn tại: "${cutoff.programId}"`,
      });
    }

    if ((cutoff.status ?? 'final') === 'final') {
      const key = `${cutoff.year}::${cutoff.programId}`;
      finalCountByYearProgram.set(key, (finalCountByYearProgram.get(key) ?? 0) + 1);
    }

    if (!Number.isFinite(cutoff.score) || cutoff.score < 0 || cutoff.score > 100) {
      issues.push({
        type: 'score-out-of-range',
        message: `Điểm chuẩn ngoài khoảng 0..100: ${cutoff.score} (${cutoff.programId}, ${cutoff.year})`,
      });
    }
  }

  for (const [key, count] of finalCountByYearProgram) {
    if (count > 1) {
      issues.push({
        type: 'multiple-final-year-program',
        message: `Có ${count} bản 'final' cho cùng (năm, ngành): ${key}`,
      });
    }
  }

  return issues;
}
