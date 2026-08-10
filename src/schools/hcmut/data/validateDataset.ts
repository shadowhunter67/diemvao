import type { AdmissionCutoff, HcmutProgram } from '../types/programs';
import { hcmutCutoffs } from './cutoffs';
import { hcmutPrograms } from './programs';

export type DatasetIssueType =
  | 'duplicate-program-id'
  | 'cutoff-unknown-program'
  | 'duplicate-year-program'
  | 'score-out-of-range'
  | 'invalid-year';

export interface DatasetIssue {
  type: DatasetIssueType;
  message: string;
}

/**
 * Kiểm tra tính toàn vẹn của dataset ngành/điểm chuẩn: id trùng, cutoff trỏ ngành không tồn
 * tại, trùng (năm, ngành), điểm ngoài 0..100, năm không hợp lệ. Dùng trong dev/tests, không
 * chạy trong production bundle.
 */
export function validateAdmissionDataset(
  programs: HcmutProgram[] = hcmutPrograms,
  cutoffs: AdmissionCutoff[] = hcmutCutoffs
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
  const maxValidYear = new Date().getFullYear() + 1;

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

    if (!Number.isInteger(cutoff.year) || cutoff.year < 2000 || cutoff.year > maxValidYear) {
      issues.push({ type: 'invalid-year', message: `Năm không hợp lệ: ${cutoff.year} (${cutoff.programId})` });
    }
  }

  return issues;
}
