import { describe, expect, it } from 'vitest';
import {
  reconcileVactFromComponents,
  reconcileVactFromTotal,
  validateVactProfile,
  sumVactComponents,
  hasCompleteVactComponents,
  VACT_TOTAL_RANGE,
} from './vactProfile';
import type { VactProfile } from './vactProfile';

describe('reconcileVactFromComponents', () => {
  it('1. đủ 4 components → total = sum, totalSource = derived-from-components', () => {
    const result = reconcileVactFromComponents(undefined, { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 });
    expect(result.total).toBe(980);
    expect(result.totalSource).toBe('derived-from-components');
    expect(result.componentsSource).toBe('user-components-input');
  });

  it('2. sửa 1 component → total tự đổi theo', () => {
    const first = reconcileVactFromComponents(undefined, { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 });
    const second = reconcileVactFromComponents(first, { ...first.components, math: 270 });
    expect(second.total).toBe(990);
  });

  it('components chưa đủ 4 phần → không suy đoán total, giữ total/totalSource cũ', () => {
    const withTotal: VactProfile = { total: 1050, totalSource: 'user-total-input' };
    const result = reconcileVactFromComponents(withTotal, { vietnamese: 100 });
    expect(result.total).toBe(1050);
    expect(result.totalSource).toBe('user-total-input');
    expect(result.components).toEqual({ vietnamese: 100 });
  });

  it('không mutate object truyền vào (pure)', () => {
    const current = Object.freeze({ total: 100, totalSource: 'user-total-input' as const });
    expect(() => reconcileVactFromComponents(current, { vietnamese: 1, english: 1, math: 1, scientificThinking: 1 })).not.toThrow();
    expect(current).toEqual({ total: 100, totalSource: 'user-total-input' });
  });
});

describe('reconcileVactFromTotal', () => {
  it('3. total nhập trực tiếp bằng đúng sum(components) → components giữ nguyên, không bị coi là conflict', () => {
    const current: VactProfile = {
      components: { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 },
      componentsSource: 'user-components-input',
      total: 980,
      totalSource: 'derived-from-components',
    };
    const { profile, componentsCleared } = reconcileVactFromTotal(current, 980, 'user-total-input');
    expect(componentsCleared).toBe(false);
    expect(profile.components).toEqual(current.components);
    expect(profile.total).toBe(980);
    expect(profile.totalSource).toBe('user-total-input');
  });

  it('4. total nhập trực tiếp KHÁC sum(components) → components bị clear/invalidate, total mới thắng', () => {
    const current: VactProfile = {
      components: { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 }, // sum 980
      componentsSource: 'user-components-input',
      total: 980,
      totalSource: 'derived-from-components',
    };
    const { profile, componentsCleared } = reconcileVactFromTotal(current, 1050, 'user-total-input');
    expect(componentsCleared).toBe(true);
    expect(profile.components).toBeUndefined();
    expect(profile.componentsSource).toBeUndefined();
    expect(profile.total).toBe(1050);
    expect(profile.totalSource).toBe('user-total-input');
  });

  it('không có components từ trước → chỉ set total bình thường, không có gì để clear', () => {
    const { profile, componentsCleared } = reconcileVactFromTotal(undefined, 900, 'user-total-input');
    expect(componentsCleared).toBe(false);
    expect(profile.total).toBe(900);
    expect(profile.components).toBeUndefined();
  });

  it('sequence đầy đủ batch 5: 980 (derived) → UEH sửa 1050 (clear) → HCMUT sửa lại còn 990 (derived lại)', () => {
    const step1 = reconcileVactFromComponents(undefined, { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 });
    expect(step1.total).toBe(980);

    const step2 = reconcileVactFromTotal(step1, 1050, 'user-total-input');
    expect(step2.componentsCleared).toBe(true);
    expect(step2.profile.total).toBe(1050);
    expect(step2.profile.components).toBeUndefined();

    // HCMUT sửa lại components (form riêng của nó vẫn giữ giá trị cũ + sửa math 260->270)
    const step3 = reconcileVactFromComponents(step2.profile, { vietnamese: 250, english: 230, math: 270, scientificThinking: 240 });
    expect(step3.total).toBe(990);
    expect(step3.totalSource).toBe('derived-from-components');
  });
});

describe('validateVactProfile', () => {
  it('5. total ngoài range → invalid với issue rõ field', () => {
    const result = validateVactProfile({ total: VACT_TOTAL_RANGE.max + 1, totalSource: 'user-total-input' });
    expect(result.valid).toBe(false);
    expect(result.issues[0].field).toBe('total');
  });

  it('6. malformed/rỗng → an toàn, valid true, không throw', () => {
    expect(() => validateVactProfile(undefined)).not.toThrow();
    expect(validateVactProfile(undefined)).toEqual({ valid: true, issues: [] });
    expect(validateVactProfile({})).toEqual({ valid: true, issues: [] });
  });

  it('7. profile hợp lệ (total khớp sum components) → valid true, không issue', () => {
    const result = validateVactProfile({
      total: 980,
      totalSource: 'derived-from-components',
      components: { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 },
      componentsSource: 'user-components-input',
    });
    expect(result).toEqual({ valid: true, issues: [] });
  });

  it('phát hiện conflict tồn đọng (dữ liệu cũ/hỏng không đi qua reconcile*)', () => {
    const result = validateVactProfile({
      total: 1050,
      components: { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 }, // sum 980 != 1050
    });
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.field === 'total')).toBe(true);
  });
});

describe('hàm phụ trợ', () => {
  it('8. weighted HCMUT score (nhân hệ số Toán×2) không bao giờ được coi là raw total hợp lệ theo cách tính sumVactComponents', () => {
    const components = { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 };
    const weightedHcmutStyle = components.vietnamese + components.english + components.math * 2 + components.scientificThinking;
    expect(hasCompleteVactComponents(components)).toBe(true);
    expect(sumVactComponents(components)).toBe(980);
    expect(sumVactComponents(components)).not.toBe(weightedHcmutStyle);
  });

  it('no mutation: reconcileVactFromTotal không sửa object current truyền vào', () => {
    const current = Object.freeze({
      components: Object.freeze({ vietnamese: 1, english: 1, math: 1, scientificThinking: 1 }),
      componentsSource: 'user-components-input' as const,
      total: 4,
      totalSource: 'derived-from-components' as const,
    });
    expect(() => reconcileVactFromTotal(current, 999, 'user-total-input')).not.toThrow();
    expect(current.total).toBe(4);
    expect(current.components).toEqual({ vietnamese: 1, english: 1, math: 1, scientificThinking: 1 });
  });
});
