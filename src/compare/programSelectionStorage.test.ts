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

  it('parses HCMUS selected program ids from the official 39-program registry', () => {
    expect(parseStoredProgramId('hcmus', JSON.stringify({ selectedProgramId: 'hcmus-75202a1' }))).toBe('hcmus-75202a1');
    expect(parseStoredProgramId('hcmus', JSON.stringify({ selectedProgramId: '75202a1' }))).toBeUndefined();
  });

  it('parses UHS selected program ids from the official 6-program registry', () => {
    expect(parseStoredProgramId('uhs', JSON.stringify({ selectedProgramId: 'uhs-7720101DH' }))).toBe('uhs-7720101DH');
    expect(parseStoredProgramId('uhs', JSON.stringify({ selectedProgramId: '7720101DH' }))).toBeUndefined();
  });
});
