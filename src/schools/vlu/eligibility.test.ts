import { describe, expect, it } from 'vitest';
import { checkVluThptExamThreshold, checkVluTranscriptOrCombinedEligibility } from './eligibility';

describe('checkVluThptExamThreshold', () => {
  it('nhóm standard: 15 pass, 14.99 fail', () => {
    expect(checkVluThptExamThreshold(15, 'standard').pass).toBe(true);
    expect(checkVluThptExamThreshold(14.99, 'standard').pass).toBe(false);
  });

  it('nhóm law: 20 pass, 19.99 fail', () => {
    expect(checkVluThptExamThreshold(20, 'law').pass).toBe(true);
    expect(checkVluThptExamThreshold(19.99, 'law').pass).toBe(false);
  });

  it('nhóm medicine-dentistry: 22 pass, 21.99 fail', () => {
    expect(checkVluThptExamThreshold(22, 'medicine-dentistry').pass).toBe(true);
    expect(checkVluThptExamThreshold(21.99, 'medicine-dentistry').pass).toBe(false);
  });

  it('nhóm pharmacy: 20 pass, 19.99 fail', () => {
    expect(checkVluThptExamThreshold(20, 'pharmacy').pass).toBe(true);
    expect(checkVluThptExamThreshold(19.99, 'pharmacy').pass).toBe(false);
  });

  it('nhóm nursing-medlab: 18 pass, 17.99 fail', () => {
    expect(checkVluThptExamThreshold(18, 'nursing-medlab').pass).toBe(true);
    expect(checkVluThptExamThreshold(17.99, 'nursing-medlab').pass).toBe(false);
  });

  it('requiredText nêu đúng thang điểm và nhóm ngành', () => {
    expect(checkVluThptExamThreshold(15, 'standard').requiredText).toMatch(/thang 30/);
    expect(checkVluThptExamThreshold(15, 'standard').requiredText).toMatch(/tiêu chuẩn/);
  });
});

describe('checkVluTranscriptOrCombinedEligibility', () => {
  it('nhóm standard: luôn pass, không cần rank/điểm thay thế', () => {
    const result = checkVluTranscriptOrCombinedEligibility({ group: 'standard' });
    expect(result.pass).toBe(true);
  });

  it('nhóm law: đủ điều kiện (giỏi + tổng THPT 18) -> pass', () => {
    const result = checkVluTranscriptOrCombinedEligibility({ group: 'law', academicRank12: 'gioi', thptExamTotal30: 18 });
    expect(result.pass).toBe(true);
  });

  it('nhóm law: đủ điều kiện qua điểm xét tốt nghiệp thay thế (giỏi + graduation 8.5) -> pass', () => {
    const result = checkVluTranscriptOrCombinedEligibility({ group: 'law', academicRank12: 'gioi', graduationScore10: 8.5 });
    expect(result.pass).toBe(true);
  });

  it('nhóm law: rank khá (dưới giỏi) dù điểm đủ -> fail', () => {
    const result = checkVluTranscriptOrCombinedEligibility({ group: 'law', academicRank12: 'kha', thptExamTotal30: 25 });
    expect(result.pass).toBe(false);
  });

  it('nhóm law: rank đạt nhưng thiếu cả 2 loại điểm thay thế -> fail (thiếu input, không unknown)', () => {
    const result = checkVluTranscriptOrCombinedEligibility({ group: 'law', academicRank12: 'gioi' });
    expect(result.pass).toBe(false);
  });

  it('nhóm law: điểm đủ nhưng thiếu rank -> fail', () => {
    const result = checkVluTranscriptOrCombinedEligibility({ group: 'law', thptExamTotal30: 25 });
    expect(result.pass).toBe(false);
  });

  it('nhóm medicine-dentistry/pharmacy: cùng ngưỡng giỏi + 20/8.5', () => {
    expect(checkVluTranscriptOrCombinedEligibility({ group: 'medicine-dentistry', academicRank12: 'gioi', thptExamTotal30: 20 }).pass).toBe(true);
    expect(checkVluTranscriptOrCombinedEligibility({ group: 'pharmacy', academicRank12: 'gioi', thptExamTotal30: 19.99 }).pass).toBe(false);
  });

  it('nhóm nursing-medlab: ngưỡng khá + 16.5/6.5 (thấp hơn law/medicine)', () => {
    expect(checkVluTranscriptOrCombinedEligibility({ group: 'nursing-medlab', academicRank12: 'kha', thptExamTotal30: 16.5 }).pass).toBe(true);
    expect(checkVluTranscriptOrCombinedEligibility({ group: 'nursing-medlab', academicRank12: 'kha', graduationScore10: 6.49 }).pass).toBe(false);
  });
});
