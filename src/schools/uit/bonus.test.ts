import { describe, expect, it } from 'vitest';
import { calculateUitBonus } from './bonus';
import { getAcademicCompetitionSubjects } from './data/bonus';

describe('calculateUitBonus', () => {
  it('không chọn nhóm nào -> 0', () => {
    expect(calculateUitBonus([])).toBe(0);
  });

  it('chọn 1 nhóm -> đúng mức trần nhóm đó', () => {
    expect(calculateUitBonus(['olp-voai'])).toBe(5);
    expect(calculateUitBonus(['academic-competition'])).toBe(10);
  });

  it('chọn nhiều nhóm cộng lại nhưng cap tổng ở 10', () => {
    expect(calculateUitBonus(['olp-voai', 'language-certificate'])).toBe(10);
    expect(calculateUitBonus(['olp-voai', 'language-certificate', 'priority-school'])).toBe(10);
  });

  it('chọn academic-competition (10) cùng nhóm khác vẫn cap ở 10', () => {
    expect(calculateUitBonus(['academic-competition', 'olp-voai'])).toBe(10);
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
