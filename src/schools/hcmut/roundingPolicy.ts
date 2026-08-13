import type { RoundingRule } from '../../core/roundingPolicy';

/**
 * Audit toàn bộ điểm `round2()` trong `calculator.ts`/`targetCalculator.ts`. Đề án tuyển sinh
 * HCMUT 2026 KHÔNG nói rõ cách làm tròn ở bất kỳ bước trung gian nào (chỉ nói điểm xét tuyển
 * thang 100) — nên toàn bộ rounding hiện tại là 'assumption' của developer, KHÔNG phải quy định
 * chính thức. Đã fuzz-test 200,000 tổ hợp input ngẫu nhiên so sánh "làm tròn từng bước" (code
 * hiện tại) vs "chỉ làm tròn 1 lần ở finalScore" — lệch tối đa quan sát được ~0.03/100 điểm (xem
 * `calculator.rounding.test.ts`). KHÔNG đổi thuật toán vì chưa có evidence bước nào đúng hơn.
 */
export const hcmutRoundingAudit: RoundingRule[] = [
  {
    stage: 'dgnl.normalizedScore / thpt.normalizedScore / transcript.normalizedScore',
    decimals: 2,
    authority: 'assumption',
    note: 'Làm tròn trước khi nhân trọng số ở calculateAcademicScore — có thể lệch kết quả cuối tối đa ~0.03/100 so với làm tròn 1 lần ở cuối. Không có nguồn chính thức nói rõ cách làm tròn từng thành phần.',
  },
  {
    stage: 'academic.dgnlContribution / thptContribution / transcriptContribution / score',
    decimals: 2,
    authority: 'assumption',
    note: 'Làm tròn từng contribution trước khi cộng — cùng nguồn gốc assumption như trên.',
  },
  {
    stage: 'bonus.raw / bonus.received',
    decimals: 2,
    authority: 'presentation',
    note: 'Input điểm cộng thực tế luôn là số nguyên/1 chữ số thập phân trong đề án — round2 ở đây gần như không ảnh hưởng, coi là làm tròn hiển thị.',
  },
  {
    stage: 'priority.raw30Scale / priority.converted / priority.received',
    decimals: 2,
    authority: 'assumption',
    note: 'Không có nguồn nói rõ làm tròn điểm ưu tiên ở bước trung gian.',
  },
  {
    stage: 'finalScore',
    decimals: 2,
    authority: 'official',
    note: 'Điểm xét tuyển hiển thị/so sánh với điểm chuẩn luôn ở thang 100 với 2 chữ số thập phân trong mọi thông báo điểm chuẩn HCMUT đã thu thập (docs/admission-research-2026.md) — coi là quy tắc hiển thị chính thức duy nhất có thể xác nhận từ nguồn công khai.',
  },
];
