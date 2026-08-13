import { describe, expect, it } from 'vitest';
import { validateThptScores, isValidThptScore } from './thptProfile';

describe('validateThptScores', () => {
  it('điểm hợp lệ trong khoảng 0-10 → valid true', () => {
    expect(validateThptScores({ math: 9, physics: 8, chemistry: 10 })).toEqual({ valid: true, issues: [] });
  });

  it('điểm 0 là factual hợp lệ, KHÔNG bị coi là missing/invalid', () => {
    expect(isValidThptScore(0)).toBe(true);
    expect(validateThptScores({ math: 0 })).toEqual({ valid: true, issues: [] });
  });

  it('undefined (chưa có dữ liệu) không tạo issue', () => {
    expect(validateThptScores({ math: 9, physics: undefined })).toEqual({ valid: true, issues: [] });
  });

  it('điểm ngoài khoảng 0-10 → invalid, có issue đúng subjectId', () => {
    const result = validateThptScores({ math: 10.5 });
    expect(result.valid).toBe(false);
    expect(result.issues[0].subjectId).toBe('math');
  });

  it('undefined/rỗng → an toàn, không throw', () => {
    expect(() => validateThptScores(undefined)).not.toThrow();
    expect(validateThptScores(undefined)).toEqual({ valid: true, issues: [] });
    expect(validateThptScores({})).toEqual({ valid: true, issues: [] });
  });
});
