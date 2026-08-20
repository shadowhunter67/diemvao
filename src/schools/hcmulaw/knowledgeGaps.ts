import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-20 (2 trang chính thức, đọc qua chrome-devtools do WebFetch thô lỗi TLS chain
 * trên domain `hcmulaw.edu.vn`). Cả 2 trang published trong chu kỳ 2026 (28/4 và 9/7/2026), không
 * phát hiện dấu hiệu "stale source"/"old-source trap".
 */
export const hcmulawKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hcmulaw-equivalence-table-not-yet-published',
    label:
      'Phương thức 2 (410, kết hợp học bạ + chứng chỉ/SAT), Phương thức 3 (200, học bạ trường ưu tiên ĐHQG-HCM), Phương thức 4 (417, V-SAT) đều cần "Mức quy đổi tương đương" sang thang điểm thi TN THPT trước khi ra ĐXT — văn bản gốc xác nhận mức quy đổi này SẼ được Trường/Trung tâm Khảo thí Quốc gia xác định NGAY SAU KHI Bộ GD-ĐT công bố kết quả thi TN THPT 2026 và số liệu thống kê tương quan. Đây KHÔNG phải tài liệu tồn tại nhưng chưa đọc được (khác `official-but-unparsed`) — bảng quy đổi CHƯA TỒN TẠI tại thời điểm research vì phụ thuộc kết quả thi TN THPT 2026 (chưa diễn ra).',
    status: 'incomplete',
    sourceId: 'hcmulaw-method-notice-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred:
      'Không thể suy đoán bảng quy đổi điểm học bạ/V-SAT sang thang thi TN THPT trước khi Bộ công bố — đây là quy đổi thống kê phụ thuộc kết quả thi thật của năm 2026, không phải hằng số cố định.',
    impact: 'exact-blocking-for-method-2-3-4',
  },
  {
    id: 'hcmulaw-foreign-language-combinations-not-modeled',
    label:
      'Nhiều tổ hợp môn chính thức của ngành Luật/Luật thương mại quốc tế/Ngôn ngữ Trung Quốc dùng ngoại ngữ Pháp/Nhật/Trung thay cho Tiếng Anh (cùng 1 vị trí "Ngoại ngữ" trong tổ hợp, khác mã tổ hợp) — module này CHỈ model nhánh Tiếng Anh (`programs.ts`), vì core `SubjectId` hiện chưa có taxonomy cho tiếng Pháp/Nhật/Trung như môn thi độc lập.',
    status: 'incomplete',
    sourceId: 'hcmulaw-method-notice-2026',
    scoreAffecting: false,
    implemented: false,
    whyNotInferred: 'Mở rộng `core/subjects.ts` để thêm 3 môn ngoại ngữ mới là thay đổi core dùng chung — ngoài phạm vi 1 batch research trường mới, để lại làm follow-up nếu có nhu cầu thật.',
    impact: 'eligibility-only-gap',
  },
  {
    id: 'hcmulaw-quang-tri-campus-not-modeled',
    label:
      'Phân hiệu tại tỉnh Quảng Trị (mã tuyển sinh LPQ) chỉ tuyển ngành Luật, cùng tổ hợp/ngưỡng đầu vào (20,00/30) với ngành Luật tại trụ sở chính (LPS) — module này KHÔNG phân biệt campus (mặc định phục vụ LPS), vì công thức/ngưỡng giống hệt nhau nên không ảnh hưởng kết quả tính, chỉ ảnh hưởng lựa chọn mã trường lúc đăng ký (nằm ngoài phạm vi tính điểm).',
    status: 'incomplete',
    sourceId: 'hcmulaw-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'informational-only',
  },
  {
    id: 'hcmulaw-priority-table-not-school-specific',
    label: 'Bảng điểm ưu tiên khu vực/đối tượng dùng bảng chuẩn quốc gia — không tìm được trang HCMULAW tự công bố bảng số riêng.',
    status: 'official-but-unparsed',
    sourceId: 'hcmulaw-quality-threshold-2026',
    scoreAffecting: true,
    implemented: true,
    whyNotInferred: 'Bảng số dùng cross-check nội bộ với các trường khác trong repo đã verified/cross-checked cùng công thức tỉ lệ quốc gia.',
    impact: 'evidence-verification-level-only',
  },
  {
    id: 'hcmulaw-method1-not-scored',
    label:
      'Phương thức 1 (mã 301, tuyển thẳng/xét tuyển thẳng/ưu tiên xét tuyển) không có công thức điểm — quyết định theo diện đặc thù (giải HSG quốc gia/quốc tế, người nước ngoài, dân tộc thiểu số rất ít người, người khuyết tật nặng...), không đưa vào `methods.ts` (cùng quy ước UFM/HUFLIT/HUTECH với các phương thức xét thẳng không công thức điểm).',
    status: 'verified',
    sourceId: 'hcmulaw-method-notice-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'out-of-scope',
  },
];
