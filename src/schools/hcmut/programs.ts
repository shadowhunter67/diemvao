import { hcmutCutoffs } from './data/cutoffs';
import { hcmutPrograms } from './data/programs';
import type { AdmissionCutoff, HcmutProgram } from './types/programs';
import { round2 } from './calculator/calculator';
import { activeAdmissionConfig } from './config/admission-2026';
import { finalCutoffsSortedDesc, isYearPublished, nearestPreviousFinalCutoff } from '../../core/admissionHistory';

export const BUFFER_OPTIONS = [0, 0.5, 1, 2] as const;

/** Năm tuyển sinh hiện tại của HCMUT — lấy từ config đang active, không hard-code lặp lại. */
export const CURRENT_ADMISSION_YEAR = activeAdmissionConfig.year;

export function getProgramById(id: string, programs: HcmutProgram[] = hcmutPrograms): HcmutProgram | undefined {
  return programs.find((program) => program.id === id);
}

/** Cutoff 'final' của một ngành (bỏ 'superseded'), sắp xếp năm mới nhất trước. */
export function getCutoffsForProgram(
  programId: string,
  cutoffs: AdmissionCutoff[] = hcmutCutoffs
): AdmissionCutoff[] {
  return finalCutoffsSortedDesc(cutoffs.filter((cutoff) => cutoff.programId === programId));
}

/** Cutoff năm mới nhất của một ngành theo phương thức "combined" (khớp công thức app này đang dùng). */
export function getLatestComparableCutoff(
  programId: string,
  cutoffs: AdmissionCutoff[] = hcmutCutoffs
): AdmissionCutoff | undefined {
  const comparable = getCutoffsForProgram(programId, cutoffs).filter((cutoff) => cutoff.method === 'combined');
  return comparable[0];
}

/** true nếu ngành đã có cutoff 'final' cho CURRENT_ADMISSION_YEAR; false = "chưa công bố". */
export function isCurrentYearCutoffPublished(
  programId: string,
  cutoffs: AdmissionCutoff[] = hcmutCutoffs
): boolean {
  return isYearPublished(getCutoffsForProgram(programId, cutoffs), CURRENT_ADMISSION_YEAR);
}

/**
 * Mốc tham khảo gần nhất TRƯỚC năm hiện tại — dùng khi cutoff năm hiện tại chưa công bố. Không
 * mặc định là (CURRENT_ADMISSION_YEAR - 1): nếu năm đó chưa có dữ liệu, tự lùi tiếp về năm gần
 * nhất có dữ liệu.
 */
export function getNearestPreviousCutoff(
  programId: string,
  cutoffs: AdmissionCutoff[] = hcmutCutoffs
): AdmissionCutoff | undefined {
  return nearestPreviousFinalCutoff(getCutoffsForProgram(programId, cutoffs), CURRENT_ADMISSION_YEAR);
}

/** current - cutoffScore. Âm nghĩa là đang thấp hơn mức tham khảo, dương là đang cao hơn. */
export function calculateGap(currentScore: number, cutoffScore: number): number {
  return round2(currentScore - cutoffScore);
}

/** cutoffScore + buffer, clamp về [0, scoreScale]. */
export function calculateEffectiveTarget(cutoffScore: number, buffer: number, scoreScale: number): number {
  return round2(Math.min(scoreScale, Math.max(0, cutoffScore + buffer)));
}

export const MAX_COMPARISON_PINS = 5;

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
