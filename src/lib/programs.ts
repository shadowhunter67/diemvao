import { hcmutCutoffs } from '../data/hcmut-cutoffs';
import { hcmutPrograms } from '../data/hcmut-programs';
import type { AdmissionCutoff, HcmutProgram } from '../types/programs';
import { round2 } from './calculator';

export const BUFFER_OPTIONS = [0, 0.5, 1, 2] as const;

export function getProgramById(id: string, programs: HcmutProgram[] = hcmutPrograms): HcmutProgram | undefined {
  return programs.find((program) => program.id === id);
}

/** Cutoff của một ngành, sắp xếp năm mới nhất trước. */
export function getCutoffsForProgram(
  programId: string,
  cutoffs: AdmissionCutoff[] = hcmutCutoffs
): AdmissionCutoff[] {
  return cutoffs.filter((cutoff) => cutoff.programId === programId).sort((a, b) => b.year - a.year);
}

/** Cutoff năm mới nhất của một ngành theo phương thức "combined" (khớp công thức app này đang dùng). */
export function getLatestComparableCutoff(
  programId: string,
  cutoffs: AdmissionCutoff[] = hcmutCutoffs
): AdmissionCutoff | undefined {
  const comparable = getCutoffsForProgram(programId, cutoffs).filter((cutoff) => cutoff.method === 'combined');
  return comparable[0];
}

/** current - cutoffScore. Âm nghĩa là đang thấp hơn mức tham khảo, dương là đang cao hơn. */
export function calculateGap(currentScore: number, cutoffScore: number): number {
  return round2(currentScore - cutoffScore);
}

/** cutoffScore + buffer, clamp về [0, scoreScale]. */
export function calculateEffectiveTarget(cutoffScore: number, buffer: number, scoreScale: number): number {
  return round2(Math.min(scoreScale, Math.max(0, cutoffScore + buffer)));
}

const MAX_COMPARISON_PINS = 3;

/** Thêm ngành vào danh sách so sánh: bỏ qua nếu đã có (không duplicate) hoặc đã đủ tối đa. */
export function addProgramToComparison(
  current: string[],
  programId: string,
  max: number = MAX_COMPARISON_PINS
): string[] {
  if (current.includes(programId)) return current;
  if (current.length >= max) return current;
  return [...current, programId];
}

export function removeProgramFromComparison(current: string[], programId: string): string[] {
  return current.filter((id) => id !== programId);
}
