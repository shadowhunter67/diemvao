import { describe, expect, it } from 'vitest';
import { calculateTdtuBonusThuong, calculateTdtuBonusXetThuong, calculateTdtuDiemCong } from './bonus';

describe('calculateTdtuBonusThuong — Phụ lục 6', () => {
  it('giải nhất HSG QG/QT = 10', () => {
    expect(calculateTdtuBonusThuong([{ category: 'hsg-quocgia-quocte', rank: 'nhat' }])).toBe(10);
  });

  it('giải ba KHKT QG/QT = 6', () => {
    expect(calculateTdtuBonusThuong([{ category: 'khkt-quocgia-quocte', rank: 'ba' }])).toBe(6);
  });

  it('mục flat (thể thao đội tuyển QG / mỹ thuật QT) luôn = 6', () => {
    expect(calculateTdtuBonusThuong([{ category: 'the-thao-doi-tuyen-quocgia' }])).toBe(6);
    expect(calculateTdtuBonusThuong([{ category: 'my-thuat-quocte' }])).toBe(6);
  });

  it('cộng dồn nhiều thành tích nhưng kẹp trần 10', () => {
    expect(
      calculateTdtuBonusThuong([
        { category: 'hsg-quocgia-quocte', rank: 'nhat' },
        { category: 'my-thuat-quocte' },
      ])
    ).toBe(10);
  });

  it('không có thành tích => 0', () => {
    expect(calculateTdtuBonusThuong([])).toBe(0);
    expect(calculateTdtuBonusThuong()).toBe(0);
  });
});

describe('calculateTdtuBonusXetThuong — Phụ lục 7', () => {
  it('giải nhất HSG tỉnh/thành = 5', () => {
    expect(calculateTdtuBonusXetThuong([{ category: 'hsg-tinh-thanh', rank: 'nhat' }])).toBe(5);
  });

  it('hạnh kiểm tốt 3 năm = 1', () => {
    expect(calculateTdtuBonusXetThuong([{ category: 'hanh-kiem-tot-3-nam' }])).toBe(1);
  });

  it('huy chương thể thao quốc gia: vàng/bạc/đồng = 5/4/3', () => {
    expect(calculateTdtuBonusXetThuong([{ category: 'the-thao-quocgia', medal: 'vang' }])).toBe(5);
    expect(calculateTdtuBonusXetThuong([{ category: 'the-thao-quocgia', medal: 'bac' }])).toBe(4);
    expect(calculateTdtuBonusXetThuong([{ category: 'the-thao-quocgia', medal: 'dong' }])).toBe(3);
  });

  it('mục 1 (HSG tỉnh) và mục 3 (khuyến khích HSG QG) đồng thời chỉ cộng cao nhất — không cộng dồn', () => {
    // giải nhì tỉnh (4) + khuyến khích HSG QG (5) => chỉ lấy 5 (cao nhất), KHÔNG phải 9
    const result = calculateTdtuBonusXetThuong([
      { category: 'hsg-tinh-thanh', rank: 'nhi' },
      { category: 'hsg-quocgia-khuyenkhich' },
    ]);
    expect(result).toBe(5);
  });

  it('mục highest-only vẫn cộng dồn được với mục khác (hạnh kiểm) miễn không vượt trần 5', () => {
    // giải ba tỉnh (3) + hạnh kiểm tốt (1) = 4, dưới trần 5
    const result = calculateTdtuBonusXetThuong([
      { category: 'hsg-tinh-thanh', rank: 'ba' },
      { category: 'hanh-kiem-tot-3-nam' },
    ]);
    expect(result).toBe(4);
  });

  it('kẹp trần 5 kể cả khi tổng vượt quá', () => {
    const result = calculateTdtuBonusXetThuong([
      { category: 'hsg-tinh-thanh', rank: 'nhat' }, // 5
      { category: 'hanh-kiem-tot-3-nam' }, // 1
      { category: 'my-thuat-toanquoc' }, // 3
    ]);
    expect(result).toBe(5);
  });
});

describe('calculateTdtuDiemCong — Điểm cộng = Điểm thưởng + Điểm xét thưởng, kẹp 10', () => {
  it('cộng cả 2 phụ lục khi thí sinh đủ điều kiện cả hai', () => {
    const result = calculateTdtuDiemCong({
      thuong: [{ category: 'khkt-quocgia-quocte', rank: 'ba' }], // 6
      xetThuong: [{ category: 'hanh-kiem-tot-3-nam' }], // 1
    });
    expect(result).toBe(7);
  });

  it('kẹp tổng ở 10 dù thưởng(10) + xét thưởng(5) = 15', () => {
    const result = calculateTdtuDiemCong({
      thuong: [{ category: 'hsg-quocgia-quocte', rank: 'nhat' }], // 10
      xetThuong: [{ category: 'hsg-tinh-thanh', rank: 'nhat' }], // 5
    });
    expect(result).toBe(10);
  });

  it('không có thành tích nào => 0', () => {
    expect(calculateTdtuDiemCong({})).toBe(0);
  });
});
