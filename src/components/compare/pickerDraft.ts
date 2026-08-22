import { activeAdmissionConfig } from '../../schools/hcmut/config/admission-2026';
import { validateBonusComponent, validatePriorityRaw } from '../../schools/hcmut/validation';
import type { ComparisonSelection } from '../../compare/comparisonSelection';

export interface PickerDraft {
  schoolId: string;
  programId: string;
  combinationId: string;
  hcmutReward: string;
  hcmutConsiderationReward: string;
  hcmutEncouragement: string;
  hcmutPriority: string;
  hasUsshBonusAchievement: boolean;
}

export const EMPTY_DRAFT: PickerDraft = {
  schoolId: '',
  programId: '',
  combinationId: '',
  hcmutReward: '0',
  hcmutConsiderationReward: '0',
  hcmutEncouragement: '0',
  hcmutPriority: '0',
  hasUsshBonusAchievement: false,
};

export const SCHOOLS_REQUIRING_COMBINATION = new Set(['hcmut', 'uel', 'hcmus', 'ussh', 'uhs', 'iu', 'agu', 'hcmue']);

export function selectionToDraft(selection: ComparisonSelection): PickerDraft {
  return {
    ...EMPTY_DRAFT,
    schoolId: selection.schoolId,
    programId: selection.programId ?? '',
    combinationId: selection.context?.combinationId ?? '',
    hcmutReward: String(selection.context?.hcmutBonus?.reward ?? 0),
    hcmutConsiderationReward: String(selection.context?.hcmutBonus?.considerationReward ?? 0),
    hcmutEncouragement: String(selection.context?.hcmutBonus?.encouragement ?? 0),
    hcmutPriority: String(selection.context?.hcmutBonus?.priorityRaw30Scale ?? 0),
    hasUsshBonusAchievement: selection.context?.hasUsshBonusAchievement === true,
  };
}

/**
 * Ràng buộc min/max của các field HCMUT tái dùng nguyên `validateBonusComponent`/
 * `validatePriorityRaw` (P2.3) — cùng business rule thật đang dùng ở HcmutCalculatorPage, không
 * bịa ngưỡng riêng cho form so sánh. Field có lỗi (ngoài range/không phải số) chặn submit thay vì
 * âm thầm clamp rồi cho qua.
 */
export function buildSelectionFromDraft(draft: PickerDraft): Omit<ComparisonSelection, 'id'> | undefined {
  if (!draft.schoolId || !draft.programId) return undefined;
  if (SCHOOLS_REQUIRING_COMBINATION.has(draft.schoolId) && !draft.combinationId) return undefined;

  const context: ComparisonSelection['context'] = {};
  if (draft.combinationId) context.combinationId = draft.combinationId;
  if (draft.schoolId === 'ussh') context.hasUsshBonusAchievement = draft.hasUsshBonusAchievement;
  if (draft.schoolId === 'hcmut') {
    const reward = validateBonusComponent(draft.hcmutReward);
    const considerationReward = validateBonusComponent(draft.hcmutConsiderationReward);
    const encouragement = validateBonusComponent(draft.hcmutEncouragement);
    const priorityRaw30Scale = validatePriorityRaw(draft.hcmutPriority, activeAdmissionConfig);
    if ([reward, considerationReward, encouragement, priorityRaw30Scale].some((field) => field.error !== null)) return undefined;
    context.hcmutBonus = {
      reward: reward.value,
      considerationReward: considerationReward.value,
      encouragement: encouragement.value,
      priorityRaw30Scale: priorityRaw30Scale.value,
    };
  }

  return {
    schoolId: draft.schoolId,
    programId: draft.programId,
    context: Object.keys(context).length > 0 ? context : undefined,
  };
}
