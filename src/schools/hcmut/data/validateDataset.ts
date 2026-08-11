import type { AdmissionCutoff, HcmutProgram } from '../types/programs';
import { hcmutCutoffs } from './cutoffs';
import { hcmutPrograms } from './programs';

export type DatasetIssueType =
  | 'duplicate-program-id'
  | 'cutoff-unknown-program'
  | 'multiple-final-year-program'
  | 'score-out-of-range'
  | 'invalid-year';

export interface DatasetIssue {
  type: DatasetIssueType;
  message: string;
}

/**
 * Kiểm tra tính toàn vẹn của dataset ngành/điểm chuẩn: id trùng, cutoff trỏ ngành không tồn
 * tại, >1 bản 'final' cho cùng (năm, ngành), điểm ngoài 0..100, năm không hợp lệ. Trùng (năm,
 * ngành) giữa 1 bản 'final' + N bản 'superseded' là HỢP LỆ (lịch sử điều chỉnh trong mùa tuyển
 * sinh, xem core/admissionHistory.ts) — không bị coi là lỗi. Dùng trong dev/tests, không chạy
 * trong production bundle.
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
  const finalCountByYearProgram = new Map<string, number>();
  const maxValidYear = new Date().getFullYear() + 1;

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

    if (!Number.isInteger(cutoff.year) || cutoff.year < 2000 || cutoff.year > maxValidYear) {
      issues.push({ type: 'invalid-year', message: `Năm không hợp lệ: ${cutoff.year} (${cutoff.programId})` });
    }
  }

  for (const [key, count] of finalCountByYearProgram) {
    if (count > 1) {
      issues.push({
        type: 'multiple-final-year-program',
        message: `Có ${count} bản 'final' cho cùng (năm, ngành): ${key} — chỉ được 1 bản final, các bản cũ phải đánh dấu 'superseded'`,
      });
    }
  }

  return issues;
}
