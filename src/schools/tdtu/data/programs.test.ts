import { describe, expect, it } from 'vitest';
import {
  TDTU_EXPECTED_PROGRAM_COUNT,
  getTdtuProgramById,
  tdtuPrograms,
  validateTdtuProgramCatalog,
} from './programs';

describe('tdtuPrograms', () => {
  it('case 1: có đủ 119 ngành theo con số TDTU tự công bố ở Phụ lục 2', () => {
    expect(tdtuPrograms.length).toBe(119);
    expect(tdtuPrograms.length).toBe(TDTU_EXPECTED_PROGRAM_COUNT);
  });

  it('case 2: không có id trùng lặp', () => {
    const ids = tdtuPrograms.map((program) => program.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('case 3: không có mã ngành trùng lặp', () => {
    const codes = tdtuPrograms.map((program) => program.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('case 4: không có tên ngành trống', () => {
    for (const program of tdtuPrograms) {
      expect(program.name.trim()).not.toBe('');
    }
  });

  it('case 5: mọi ngành đều có group hợp lệ (1 trong 6 nhóm cấu trúc của Phụ lục 2)', () => {
    const validGroups = new Set([
      'Chương trình tiêu chuẩn',
      'Chương trình tiên tiến',
      'Chương trình đại học bằng tiếng Anh',
      'Chương trình dự bị đại học bằng tiếng Anh',
      'Chương trình liên kết quốc tế',
      'Chương trình dự bị liên kết quốc tế',
    ]);
    for (const program of tdtuPrograms) {
      expect(validGroups.has(program.group)).toBe(true);
    }
  });
});

describe('getTdtuProgramById', () => {
  it('case 6: trả về đúng ngành khi id hợp lệ', () => {
    const program = getTdtuProgramById('7480101');
    expect(program).toBeDefined();
    expect(program?.name).toBe('Khoa học máy tính');
  });

  it('case 7: trả về undefined khi id không tồn tại', () => {
    expect(getTdtuProgramById('nganh-khong-ton-tai')).toBeUndefined();
  });
});

describe('validateTdtuProgramCatalog', () => {
  it('case 8: dataset thật không có lỗi', () => {
    expect(validateTdtuProgramCatalog()).toEqual([]);
  });

  it('case 9: phát hiện id trùng lặp', () => {
    const issues = validateTdtuProgramCatalog([
      { id: 'a', code: '7000001', name: 'Ngành A', group: 'Chương trình tiêu chuẩn' },
      { id: 'a', code: '7000002', name: 'Ngành B', group: 'Chương trình tiêu chuẩn' },
    ]);
    expect(issues.some((issue) => issue.type === 'duplicate-id')).toBe(true);
  });

  it('case 10: phát hiện mã ngành trùng lặp', () => {
    const issues = validateTdtuProgramCatalog([
      { id: 'a', code: '7000001', name: 'Ngành A', group: 'Chương trình tiêu chuẩn' },
      { id: 'b', code: '7000001', name: 'Ngành B', group: 'Chương trình tiêu chuẩn' },
    ]);
    expect(issues.some((issue) => issue.type === 'duplicate-code')).toBe(true);
  });

  it('case 11: phát hiện tên ngành trống', () => {
    const issues = validateTdtuProgramCatalog([
      { id: 'a', code: '7000001', name: '  ', group: 'Chương trình tiêu chuẩn' },
    ]);
    expect(issues.some((issue) => issue.type === 'empty-name')).toBe(true);
  });

  it('case 12: phát hiện row count khác 119', () => {
    const issues = validateTdtuProgramCatalog([
      { id: 'a', code: '7000001', name: 'Ngành A', group: 'Chương trình tiêu chuẩn' },
    ]);
    expect(issues.some((issue) => issue.type === 'unexpected-row-count')).toBe(true);
  });
});
