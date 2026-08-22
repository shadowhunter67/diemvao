import { describe, expect, it } from 'vitest';
import { buildSelectionFromDraft, EMPTY_DRAFT } from './pickerDraft';
import { activeAdmissionConfig } from '../../schools/hcmut/config/admission-2026';

const BASE_DRAFT = {
  ...EMPTY_DRAFT,
  schoolId: 'hcmut',
  programId: 'p1',
  combinationId: 'a00',
};

describe('buildSelectionFromDraft — ràng buộc HCMUT (P2.3, tái dùng validateBonusComponent/validatePriorityRaw)', () => {
  it('điền hợp lệ trong ngưỡng thật thì build được context.hcmutBonus đúng giá trị', () => {
    const result = buildSelectionFromDraft({ ...BASE_DRAFT, hcmutReward: '1.5', hcmutPriority: '2' });
    expect(result?.context?.hcmutBonus).toEqual({
      reward: 1.5,
      considerationReward: 0,
      encouragement: 0,
      priorityRaw30Scale: 2,
    });
  });

  it('điểm ưu tiên âm (dưới min business rule = 0) bị chặn submit, không âm thầm cho qua', () => {
    expect(buildSelectionFromDraft({ ...BASE_DRAFT, hcmutPriority: '-1' })).toBeUndefined();
  });

  it('điểm ưu tiên vượt maxRaw30Scale thật của config bị chặn submit', () => {
    const overMax = String(activeAdmissionConfig.priority.maxRaw30Scale + 1);
    expect(buildSelectionFromDraft({ ...BASE_DRAFT, hcmutPriority: overMax })).toBeUndefined();
  });

  it('thưởng âm bị chặn submit (business rule min 0, không có max)', () => {
    expect(buildSelectionFromDraft({ ...BASE_DRAFT, hcmutReward: '-5' })).toBeUndefined();
  });

  it('chuỗi không phải số bị chặn submit', () => {
    expect(buildSelectionFromDraft({ ...BASE_DRAFT, hcmutEncouragement: 'abc' })).toBeUndefined();
  });

  it('trường không phải hcmut không bị áp ràng buộc này', () => {
    const result = buildSelectionFromDraft({ ...BASE_DRAFT, schoolId: 'uel', combinationId: 'a01' });
    expect(result?.context?.hcmutBonus).toBeUndefined();
  });
});
