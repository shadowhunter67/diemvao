import type { CutoffContext } from '../../core/cutoffContext';
import type { UehCutoff, UehProgram } from './types/programs';
import { uehAdmissionMethods } from './methods';

/**
 * UEH là dataset đầu tiên chứng minh `CutoffContext` hoạt động thật: 2 campus (hcmc/mekong,
 * `UehProgram.campus`) + 1 phương thức duy nhất hiện có. Join ở runtime từ cutoff + program đã
 * có sẵn thay vì thêm field vào 97 record — tránh phải migrate toàn bộ dataset chỉ để chứng
 * minh schema.
 */
export function getUehCutoffContext(cutoff: UehCutoff, program: UehProgram): CutoffContext {
  return {
    methodId: uehAdmissionMethods[0]?.id,
    campusId: program.campus,
    scoreScale: cutoff.scoreScale,
  };
}
