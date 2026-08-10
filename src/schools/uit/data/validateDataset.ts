import type { UitCutoff, UitProgram } from '../types/programs';
import { uitCutoffs } from './cutoffs';
import { uitPrograms } from './programs';

export type DatasetIssueType = 'duplicate-program-id' | 'cutoff-unknown-program' | 'duplicate-year-program' | 'score-out-of-range';

export interface DatasetIssue {
  type: DatasetIssueType;
  message: string;
}

/** Kiểm tra tính toàn vẹn dataset ngành/điểm chuẩn UIT — cùng pattern với schools/hcmut/data/validateDataset.ts. */
export function validateUitDataset(
  programs: UitProgram[] = uitPrograms,
  cutoffs: UitCutoff[] = uitCutoffs
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
  const seenYearProgram = new Set<string>();

  for (const cutoff of cutoffs) {
    if (!programIds.has(cutoff.programId)) {
      issues.push({
        type: 'cutoff-unknown-program',
        message: `Cutoff năm ${cutoff.year} trỏ tới programId không tồn tại: "${cutoff.programId}"`,
      });
    }

    const key = `${cutoff.year}::${cutoff.programId}`;
    if (seenYearProgram.has(key)) {
      issues.push({ type: 'duplicate-year-program', message: `Trùng (năm, ngành): ${key}` });
    }
    seenYearProgram.add(key);

    if (!Number.isFinite(cutoff.score) || cutoff.score < 0 || cutoff.score > 100) {
      issues.push({
        type: 'score-out-of-range',
        message: `Điểm chuẩn ngoài khoảng 0..100: ${cutoff.score} (${cutoff.programId}, ${cutoff.year})`,
      });
    }
  }

  return issues;
}
