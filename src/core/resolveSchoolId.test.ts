import { describe, expect, it } from 'vitest';
import { resolveSchoolId } from './resolveSchoolId';

describe('resolveSchoolId', () => {
  it('trả về null cho "/" không có query', () => {
    expect(resolveSchoolId('/', '')).toBeNull();
  });

  it('trả về id trực tiếp cho "/<id>"', () => {
    expect(resolveSchoolId('/ufm', '')).toBe('ufm');
    expect(resolveSchoolId('/hcmut', '')).toBe('hcmut');
  });

  it('canonicalize "/" + query của share link HCMUT cũ sang hcmut', () => {
    expect(resolveSchoolId('/', '?dg_v=8.5')).toBe('hcmut');
    expect(resolveSchoolId('/', '?pr=1')).toBe('hcmut');
  });

  it('KHÔNG redirect sang hcmut khi "/" chỉ có tracking param lạ (bug mobile in-app browser)', () => {
    expect(resolveSchoolId('/', '?fbclid=abc123')).toBeNull();
    expect(resolveSchoolId('/', '?utm_source=zalo&utm_medium=share')).toBeNull();
  });

  it('vẫn canonicalize đúng khi query có CẢ tracking param lẫn key legacy thật', () => {
    expect(resolveSchoolId('/', '?fbclid=abc123&dg_v=8.5')).toBe('hcmut');
  });
});
