import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-21 (thông báo chính thức HUB đọc trực tiếp qua browser thật, xem
 * `sources.ts:hub-quality-threshold-2026`). Ngưỡng đảm bảo chất lượng đầu vào theo nhóm ngành
 * (15/30 chung, 20/30 Luật, IELTS≥5.5 Elite Class) đã verified. Các mục dưới đây là gap CỤ THỂ
 * đọc được từ chính văn bản, không phải "trường chưa công bố" chung chung.
 */
export const hubKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hub-appendix1-vsat-percentile-table-unparsed',
    label:
      'Phụ lục I — bảng phân vị quy đổi điểm V-SAT sang điểm thi TN THPT (các mốc khoảng điểm a/b tương ứng c/d dùng trong công thức nội suy tuyến tính y = c + ((x-a)/(b-a))×(d-c)). Thông báo chỉ đưa ví dụ minh họa 1 dòng (Toán, khoảng (122.5, 129.5] → (8.5, 9.0]); toàn bộ bảng nằm trong file đính kèm "Thông báo điểm sàn - quy đổi bách phân vị tuyển sinh 2026" (nút Download trên trang) — URL PDF thật không lộ ra trong DOM snapshot đã lấy, nội dung bảng KHÔNG đọc được ở lần research này. Cổng tra cứu riêng `xettuyen.hub.edu.vn/quy-doi-diem` là ứng dụng động, không phải trang tĩnh có thể parse.',
    status: 'official-but-unparsed',
    sourceId: 'hub-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    attemptedSources: [
      'tuyensinh.hub.edu.vn/... (trang thông báo chính) — chỉ có 1 ví dụ minh họa, nút Download không lộ URL PDF trong DOM snapshot.',
      'xettuyen.hub.edu.vn/quy-doi-diem — cổng tra cứu riêng của trường, ứng dụng động (không phải bảng tĩnh), chưa parse được.',
    ],
    whyNotInferred:
      'Không suy đoán các mốc khoảng điểm còn lại từ 1 ví dụ duy nhất — nội suy tuyến tính cần đúng các mốc (a,b,c,d) chính thức cho từng môn/khoảng điểm, sai 1 mốc sẽ làm sai điểm quy đổi.',
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'hub-appendix2-comprehensive-conversion-table-unparsed',
    label:
      'Phụ lục II — khung quy đổi tương đương điểm trúng tuyển Phương thức Tổng hợp sang điểm thi TN THPT (các mốc khoảng điểm quy đổi theo tổ hợp môn, dùng trong cùng công thức nội suy tuyến tính). Thông báo chỉ đưa 1 ví dụ minh họa (tổ hợp A01, x=138.5 → khoảng (137.5,140.5] ứng THPT tổ hợp A00 (20.25,22.25] → y=21.25); bảng đầy đủ nằm trong cùng file đính kèm chưa đọc được như Phụ lục I.',
    status: 'official-but-unparsed',
    sourceId: 'hub-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    attemptedSources: [
      'tuyensinh.hub.edu.vn/... (trang thông báo chính) — chỉ có 1 ví dụ minh họa, nút Download không lộ URL PDF trong DOM snapshot.',
    ],
    whyNotInferred:
      'Điểm quy đổi Phương thức Tổng hợp còn phụ thuộc thêm điểm quy đổi chứng chỉ tiếng Anh quốc tế/HSG/trường chuyên/học lực Tốt (chưa có bảng), không chỉ điểm học bạ 3 năm — không đủ cơ sở để dựng công thức quy đổi đầy đủ từ 1 ví dụ.',
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'hub-priority-bonus-table-not-found',
    label:
      'Bảng điểm ưu tiên khu vực/đối tượng cụ thể áp dụng cho HUB (dù có thể trùng bảng chuẩn Bộ GD&ĐT thang 30, chưa có nguồn HUB tự công bố lại để cross-check riêng) và bảng điểm cộng thành tích/chứng chỉ khác (ngoài IELTS Elite Class) nếu có — thông báo chỉ nêu công thức tổng quát "Điểm xét tuyển cuối = y + điểm ưu tiên khu vực/đối tượng (thang 30 theo quy định chung)" cho Phương thức Tổng hợp, không có bảng số hay xác nhận riêng cho Phương thức 1 (thi TN THPT).',
    status: 'incomplete',
    sourceId: 'hub-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred:
      'Không tái dùng bảng ưu tiên chuẩn quốc gia cross-checked từ trường khác cho HUB trong batch này vì scope batch này dừng ở eligibility/threshold-only (chưa có scoreConversion/exactCalculator nào cần tới điểm ưu tiên) — để dành khi HUB tiến lên exact calculator.',
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'hub-program-catalog-not-imported',
    label:
      'Danh mục ngành/chương trình đầy đủ (tên/mã ngành, tổ hợp môn xét tuyển từng ngành) và bảng ánh xạ ngành → nhóm ngưỡng chưa import — evaluator nhận `HubProgramGroup` trực tiếp từ caller thay vì tự suy từ tên/mã ngành (cùng pattern VLU/UFM/HUTECH). Chỉ 3 nhóm có nguồn rõ được model hoá: "Luật, Luật kinh tế, Luật kinh tế (tiếng Anh bán phần)" (ngưỡng riêng 20đ), "Tài chính - Ngân hàng, Chương trình Tinh hoa (Elite Class)" (điều kiện IELTS riêng), và "các ngành khác" (ngưỡng mặc định 15đ).',
    status: 'incomplete',
    sourceId: 'hub-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'program-catalog-only',
  },
  {
    id: 'hub-law-other-priority-zones-threshold-unknown',
    label:
      'Ngưỡng đầu vào 20 điểm cho khối Luật được thông báo ghi rõ "áp dụng cho thí sinh khu vực 3" — chưa có nguồn nêu ngưỡng tương đương cho thí sinh khu vực 1/2/2-NT (thông thường sẽ khác do điểm ưu tiên khu vực, nhưng HUB không công bố công thức quy đổi ngưỡng theo khu vực trong thông báo này). Evaluator chỉ kết luận được (eligible/ineligible) khi thí sinh khai báo khu vực 3; khu vực khác trả về `unknown`.',
    status: 'incomplete',
    sourceId: 'hub-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred:
      'Không tự suy ngưỡng khu vực khác bằng cách trừ điểm ưu tiên chuẩn Bộ GD&ĐT khỏi mốc 20 — thông báo không xác nhận ngưỡng 20 đã "chuẩn hoá về khu vực 3" theo đúng nghĩa công thức giảm trừ đó, chỉ ghi đây là ngưỡng áp dụng cho khu vực 3.',
    impact: 'eligibility-partial-scope',
  },
  {
    id: 'hub-elite-ielts-equivalent-table-not-found',
    label:
      'Điều kiện Elite Class ghi "chứng chỉ tiếng Anh quốc tế IELTS từ 5.5 trở lên hoặc chứng chỉ tiếng Anh quốc tế khác được quy đổi tương đương theo quy định của Trường" — chưa tìm được bảng quy đổi tương đương (TOEFL iBT/TOEIC/khác) cụ thể. Evaluator chỉ kiểm tra được điều kiện qua điểm IELTS trực tiếp; chứng chỉ khác trả về `unknown`.',
    status: 'incomplete',
    sourceId: 'hub-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    impact: 'eligibility-partial-scope',
  },
  {
    id: 'hub-comprehensive-vsat-pre2026-graduate-not-modeled',
    label:
      'Với thí sinh tốt nghiệp THPT năm 2025 trở về trước, điều kiện ngưỡng Phương thức Tổng hợp/V-SAT dùng khái niệm "tổng điểm xét tuyển" (không nhất thiết là điểm thi TN THPT thô, có thể đã qua quy đổi) — nguồn không định nghĩa rõ cách tính khái niệm này độc lập với Phụ lục II (khung quy đổi, vốn đã là gap riêng). Evaluator KHÔNG suy đoán bằng cách dùng điểm thi TN THPT thô làm proxy — nhánh thí sinh tốt nghiệp trước 2026 trong Phương thức Tổng hợp/V-SAT trả về `unknown` kèm giải thích, không tính pass/fail.',
    status: 'incomplete',
    sourceId: 'hub-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred:
      'Dùng điểm thi TN THPT thô làm proxy cho "tổng điểm xét tuyển" đã quy đổi là suy diễn công thức — vi phạm nguyên tắc evidence-first khi nguồn không xác nhận 2 khái niệm này tương đương.',
    impact: 'eligibility-partial-scope',
  },
];
