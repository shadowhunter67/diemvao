import type { KnowledgeGap } from '../../core/knowledgeStatus';

/** Batch 2026-08-14: cả 2 gap cũ ("điểm thưởng/khuyến khích" + "bảng ưu tiên") đã được resolve
 * hoàn toàn qua `iu-admission-info-2026` (đọc qua trình duyệt thật, accordion Khoản 5/7) — xoá
 * khỏi mảng, KHÔNG đánh dấu "done" (KnowledgeGap chỉ đại diện gap còn MỞ). Các gap còn lại dưới
 * đây KHÔNG ảnh hưởng `exactCalculator: true` của `iu-method2-2026` (chỉ áp dụng đối tượng "Thí
 * sinh tốt nghiệp THPT 2026" — 1.1/1.2), vì đều thuộc phạm vi đối tượng 2/3 chưa hỗ trợ. */
export const iuKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'iu-object2-object3-out-of-scope',
    label:
      'Công thức Điểm học lực cho "Thí sinh tốt nghiệp THPT 2025 trở về trước" (đối tượng 2) và "THPT nước ngoài" (đối tượng 3, cần điểm Phỏng vấn — chưa có field trong ApplicantProfile) đã verified nhưng CHƯA implement — chỉ hỗ trợ đối tượng 1 (tốt nghiệp THPT 2026)',
    status: 'incomplete',
    sourceId: 'iu-admission-info-2026',
    scoreAffecting: false,
    implemented: false,
    note: 'Không chặn exactCalculator của đối tượng 1 — là method/scope riêng, chưa tới lượt implement.',
  },
  {
    id: 'iu-cambridge-certificate-not-supported',
    label:
      'Bảng "Điểm khuyến khích" có mức quy đổi theo Cambridge — ApplicantProfile.certificates hiện chưa có field Cambridge (chỉ IELTS/TOEFL iBT/TOEIC) nên chưa tính được cho thí sinh chỉ có chứng chỉ Cambridge',
    status: 'incomplete',
    sourceId: 'iu-admission-info-2026',
    scoreAffecting: false,
    implemented: false,
    note: 'Thí sinh có IELTS/TOEFL iBT/TOEIC vẫn tính đúng đủ; chỉ thiếu riêng đường Cambridge.',
  },
];
