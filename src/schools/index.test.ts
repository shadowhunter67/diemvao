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

  it('hcmutModule có đủ thông tin định danh', () => {
    expect(hcmutModule.shortName).toBe('HCMUT');
    expect(hcmutModule.year).toBe(2026);
    expect(hcmutModule.name).toContain('Bách khoa');
  });
});
