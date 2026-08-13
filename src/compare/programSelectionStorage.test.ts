import { describe, expect, it } from 'vitest';
import { parseStoredProgramId } from './programSelectionStorage';

describe('programSelectionStorage', () => {
  it('parses HCMUT existing selectedProgramId shape safely', () => {
    expect(parseStoredProgramId('hcmut', JSON.stringify({ selectedProgramId: 'khoa-hoc-may-tinh' }))).toBe('khoa-hoc-may-tinh');
  });

  it('rejects malformed and unknown program ids', () => {
    expect(parseStoredProgramId('hcmut', '{bad json')).toBeUndefined();
    expect(parseStoredProgramId('hcmut', JSON.stringify({ selectedProgramId: 'unknown' }))).toBeUndefined();
  });
});
