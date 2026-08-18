import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-18 — 2 trang chính thức `huflit.edu.vn` (xem `sources.ts`) xác nhận đầy đủ 3
 * phương thức tính điểm (PT1 tổng thô 3 môn THPT, PT2 tổng TB 3 môn 3 năm, PT3 ĐGNL) + ngưỡng đầu
 * vào chính xác từng phương thức (công bố 09/7/2026, supersede statement "sẽ công bố sau" của
 * trang 02/4/2026). Các khoảng trống dưới đây là phần đã tìm kỹ nhưng KHÔNG định vị được nguồn
 * chính thức đọc được.
 */
export const huflitKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'huflit-bonus-table-not-found',
    label:
      'Bảng điểm thưởng (thành tích HSG/giải thưởng) và điểm khuyến khích (chứng chỉ ngoại ngữ) cụ thể — nhiều nguồn thứ cấp xác nhận HUFLIT CÓ "điểm cộng" (điểm thưởng + điểm khuyến khích, trần không quá 10% thang điểm xét tuyển = 3,00/30) và "nhiều thành tích chỉ cộng cao nhất", nhưng KHÔNG định vị được trang/PDF chính thức công bố bảng số cụ thể (bao nhiêu điểm mỗi loại giải/mỗi mức chứng chỉ).',
    status: 'incomplete',
    sourceId: 'huflit-admission-plan-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Đã search nhiều truy vấn (tên trường + "điểm thưởng"/"điểm khuyến khích"/"bảng quy đổi chứng chỉ") và duyệt huflit.edu.vn/thongtintuyensinh.huflit.edu.vn trực tiếp — không tìm được bảng số. Không suy đoán giá trị.',
    impact: 'exact-blocking-unless-no-achievement',
  },
  {
    id: 'huflit-priority-table-not-huflit-specific',
    label:
      'Bảng điểm ưu tiên khu vực/đối tượng và công thức giảm dùng bảng chuẩn quốc gia (Quy chế tuyển sinh Bộ GDĐT: KV1=0,75/KV2-NT=0,5/KV2=0,25/KV3=0; ĐT01-03=2/ĐT04-06=1, thang 30; giảm khi tổng ≥22,5/30, chia 7,5) — KHÔNG tìm được trang HUFLIT tự công bố bảng này trực tiếp, chỉ có 1 nguồn thứ cấp trích lời HUFLIT "Điểm ưu tiên: áp dụng theo quy chế tuyển sinh của Bộ GDĐT" xác nhận rule TỒN TẠI nhưng không có bảng số riêng.',
    status: 'official-but-unparsed',
    sourceId: 'huflit-admission-plan-2026',
    scoreAffecting: true,
    implemented: true,
    whyNotInferred: 'Bảng số dùng cross-check nội bộ với 5 trường khác trong repo (HCMUS/UEL/IU/USSH/HCMUTE/TDTU) đã verified/cross-checked cùng công thức tỉ lệ quốc gia — verification level giữ `cross-checked`, KHÔNG nâng lên `verified` vì không có trang HUFLIT trực tiếp.',
    impact: 'evidence-verification-level-only',
  },
  {
    id: 'huflit-program-catalog-not-imported',
    label:
      'Danh mục đầy đủ 23 ngành + tổ hợp môn xét tuyển từng ngành chưa import — evaluator nhận tổ hợp trực tiếp từ caller (giống HCMUT/HCMUTE/TDTU); chỉ 2 ngành đặc thù (Luật, Luật kinh tế — ngưỡng riêng) có stable ID trong `eligibility.ts`.',
    status: 'official-but-unparsed',
    sourceId: 'huflit-admission-plan-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'eligibility-only-gap',
  },
];
