import { describe, expect, it } from 'vitest';
import { activeSchool, activeSchoolId, schoolRegistry } from './index';
import { hcmutModule } from './hcmut';

describe('schoolRegistry', () => {
  it('có hcmut đăng ký với id đúng', () => {
    expect(schoolRegistry.hcmut).toBe(hcmutModule);
    expect(schoolRegistry.hcmut.id).toBe('hcmut');
  });

  it('activeSchoolId trỏ đúng vào một entry tồn tại trong registry', () => {
    expect(schoolRegistry[activeSchoolId]).toBe(activeSchool);
  });

  it('hcmutModule có đủ thông tin định danh và status supported', () => {
    expect(hcmutModule.shortName).toBe('HCMUT');
    expect(hcmutModule.year).toBe(2026);
    expect(hcmutModule.name).toContain('Bách khoa');
    expect(hcmutModule.status).toBe('supported');
  });

  it('chỉ hcmut có status supported — các trường khác đang researching/formula-incomplete', () => {
    const supported = Object.values(schoolRegistry).filter((school) => school.status === 'supported');
    expect(supported).toEqual([hcmutModule]);
  });

  it('có đủ 7 trường ĐHQG-HCM đã research (ngoài HCMUT)', () => {
    const ids = Object.keys(schoolRegistry).sort();
    expect(ids).toEqual(['agu', 'hcmus', 'hcmut', 'iu', 'uel', 'uhs', 'uit', 'ussh']);
  });
});
