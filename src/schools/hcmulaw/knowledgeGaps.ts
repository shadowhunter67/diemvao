import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-20 (đọc qua chrome-devtools do WebFetch thô lỗi TLS chain trên domain
 * `hcmulaw.edu.vn`). Batch đầu (2026-08-19/20): bảng quy đổi tương đương Phương thức 2/3/4 CHƯA
 * TỒN TẠI (chờ kết quả thi TN THPT 2026). Batch tiếp theo, CÙNG NGÀY 2026-08-20 (kết quả thi đã
 * công bố trong lúc đó): bảng đã xuất hiện (`hcmulaw-equivalence-notice-2026`) — đóng gap cho
 * Phương thức 4 (V-SAT, `conversionTable.ts`), Phương thức 2/3 (học bạ) vẫn blocked nhưng vì lý do
 * KHÁC (granularity dữ liệu, xem `hcmulaw-hocba-semester-granularity-gap` dưới đây), không còn là
 * "bảng chưa tồn tại".
 */
export const hcmulawKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hcmulaw-hocba-semester-granularity-gap',
    label:
      'Phương thức 2 (410, kết hợp học bạ + chứng chỉ/SAT) và Phương thức 3 (200, học bạ trường ưu tiên ĐHQG-HCM) đều quy đổi học bạ↔THPT bằng công thức y=x-k (bảng "độ lệch k" theo 16 tổ hợp/nhóm tổ hợp, ĐÃ có đủ) — nhưng x = "điểm tổ hợp của học bạ cấp THPT (TRUNG BÌNH CỘNG CỦA 6 HỌC KỲ)". `ApplicantProfile.transcript` chỉ lưu TB CẢ NĂM (`grade10`/`grade11`/`grade12`, 3 giá trị/môn), không lưu theo 6 học kỳ riêng lẻ — TB năm (Thông tư 22/2021, thường = (TB HK1 + 2×TB HK2)/3) KHÔNG tương đương phép tính trung bình cộng đơn giản của 6 học kỳ, nên không thể suy ngược đúng công thức HCMULAW từ dữ liệu hiện có mà không có rủi ro sai số — cùng loại blocker với HUTECH (`schools/hutech/knowledgeGaps.ts:hutech-hocba-semester-granularity-gap`).',
    status: 'official-but-unparsed',
    sourceId: 'hcmulaw-equivalence-notice-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Không mở rộng `ApplicantProfile` sang lưu theo học kỳ trong batch này (ngoài phạm vi — tránh redesign model dùng chung chỉ để phục vụ 1-2 trường), giữ Phương thức 2/3 ở mức unavailable thay vì dùng TB năm làm proxy không chính xác.',
    impact: 'exact-blocking-for-method-2-3',
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
