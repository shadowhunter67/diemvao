import { describe, expect, it } from 'vitest';
import { calculateUitBonusEligibility } from './bonus';
import { getAcademicCompetitionSubjects } from './data/bonus';

describe('calculateUitBonusEligibility', () => {
  it('không chọn nhóm nào -> eligibleCategories rỗng, không có cap', () => {
    const result = calculateUitBonusEligibility([]);
    expect(result.eligibleCategories).toEqual([]);
    expect(result.categoryCaps).toEqual({});
    expect(result.overallCap).toBe(10);
    expect(result.exactPointsKnown).toBe(false);
  });

  it('chọn 1 nhóm -> đúng mức trần nhóm đó, không phải awarded score', () => {
    expect(calculateUitBonusEligibility(['olp-voai']).categoryCaps).toEqual({ 'olp-voai': 5 });
    expect(calculateUitBonusEligibility(['academic-competition']).categoryCaps).toEqual({
      'academic-competition': 10,
    });
  });

  it('chọn nhiều nhóm -> categoryCaps liệt kê từng nhóm riêng, overallCap luôn cố định 10, không cộng dồn', () => {
    const result = calculateUitBonusEligibility(['olp-voai', 'language-certificate', 'priority-school']);
    expect(result.eligibleCategories).toEqual(['olp-voai', 'language-certificate', 'priority-school']);
    expect(result.categoryCaps).toEqual({ 'olp-voai': 5, 'language-certificate': 5, 'priority-school': 5 });
    expect(result.overallCap).toBe(10);
  });

  it('exactPointsKnown luôn false — không suy đoán điểm thực nhận', () => {
    expect(calculateUitBonusEligibility(['academic-competition']).exactPointsKnown).toBe(false);
    expect(calculateUitBonusEligibility([]).exactPointsKnown).toBe(false);
  });
});

describe('getAcademicCompetitionSubjects', () => {
  it('ngành mặc định có đủ 6 môn cơ bản', () => {
    const subjects = getAcademicCompetitionSubjects('cong-nghe-thong-tin');
    expect(subjects).toEqual(['Tin học', 'Toán', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh']);
  });

  it('Kỹ thuật máy tính và Thiết kế vi mạch không xét Ngữ văn', () => {
    expect(getAcademicCompetitionSubjects('ky-thuat-may-tinh')).not.toContain('Ngữ văn');
    expect(getAcademicCompetitionSubjects('thiet-ke-vi-mach')).not.toContain('Ngữ văn');
    expect(getAcademicCompetitionSubjects('thiet-ke-vi-mach-ta')).not.toContain('Ngữ văn');
  });

  it('Truyền thông Đa phương tiện không xét Hóa học, có thêm Lịch sử/Địa lý', () => {
    const subjects = getAcademicCompetitionSubjects('truyen-thong-da-phuong-tien');
    expect(subjects).not.toContain('Hóa học');
    expect(subjects).toContain('Lịch sử');
    expect(subjects).toContain('Địa lý');
  });

  it('Khoa học dữ liệu / Hệ thống thông tin có thêm Sinh học', () => {
    expect(getAcademicCompetitionSubjects('khoa-hoc-du-lieu')).toContain('Sinh học');
    expect(getAcademicCompetitionSubjects('he-thong-thong-tin-tt')).toContain('Sinh học');
  });

  it('Công nghệ thông tin Việt Nhật có thêm Tiếng Nhật', () => {
    expect(getAcademicCompetitionSubjects('cong-nghe-thong-tin-viet-nhat')).toContain('Tiếng Nhật');
  });

  it('ngành không có ngoại lệ (vd khoa-hoc-du-lieu-ta) không tự suy rộng thêm Sinh học', () => {
    expect(getAcademicCompetitionSubjects('khoa-hoc-du-lieu-ta')).not.toContain('Sinh học');
  });
});
