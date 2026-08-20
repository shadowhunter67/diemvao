import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-19/20 (browser thật, chrome-devtools, đọc trực tiếp `www.vlu.edu.vn`). Ngưỡng
 * đảm bảo chất lượng đầu vào theo nhóm ngành (thi TN THPT: 15/18/20/22; học bạ/kết hợp: điều kiện
 * học lực + điểm thay thế) đã verified từ 2 bài viết chính thức, cross-check khớp nhau. Các mục
 * dưới đây vẫn là gap vì lý do CỤ THỂ đọc được, không phải "trường chưa công bố" chung chung.
 */
export const vluKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'vlu-primary-subject-list-unpublished',
    label:
      'Danh mục ngành áp dụng "môn thi chính nhân hệ số 2" — bài công bố chính thức nêu nguyên tắc chung ("Riêng đối với các ngành có môn thi chính, môn thi chính được nhân hệ số 2 và quy về thang điểm 30") nhưng không liệt kê ngành nào thuộc diện này ngay trong bài; trang chỉ dẫn chiếu sang mục "Danh mục ngành và tổ hợp môn xét tuyển" (một khối nội dung riêng trên cùng trang, không trích xuất được nội dung bảng cụ thể qua lần đọc DOM hiện tại).',
    status: 'official-but-unparsed',
    sourceId: 'vlu-admission-info-2026',
    scoreAffecting: true,
    implemented: false,
    attemptedSources: [
      'www.vlu.edu.vn/news/truong-dai-hoc-van-lang-cong-bo-thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026 — chỉ có nguyên tắc chung, không có bảng ngành/môn chính.',
      'Tìm kiếm web trực tiếp cho danh sách ngành có môn thi chính VLU 2026 — không ra kết quả có bảng đầy đủ.',
    ],
    whyNotInferred:
      'Không suy đoán ngành nào có môn thi chính từ tên ngành (vd ngành Ngôn ngữ Anh có thể có môn chính tiếng Anh, nhưng đây là suy đoán, không phải nguồn xác nhận) — hệ số 2 là score-affecting, sai 1 ngành sẽ làm sai điểm xét tuyển của đúng ngành đó.',
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'vlu-priority-bonus-table-not-found',
    label:
      'Bảng điểm ưu tiên khu vực/đối tượng cụ thể và công thức giảm điểm ưu tiên theo Thông tư 08/2022 (nếu VLU tự công bố lại) — bài viết chỉ nêu "Thí sinh có thể cộng điểm ưu tiên (đối tượng, khu vực) vào điểm của tổ hợp môn xét tuyển, miễn đạt mức sàn quy định này", không kèm bảng số hay công thức giảm dần khi tổng điểm cao. Không tìm thấy bảng điểm cộng/khuyến khích (thành tích, chứng chỉ ngoài ngoại ngữ) nào khác trên 2 nguồn đã đọc.',
    status: 'incomplete',
    sourceId: 'vlu-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred:
      'Không tái dùng bảng ưu tiên chuẩn quốc gia cross-checked từ trường khác (như UFM/HUTECH đã làm) cho VLU trong batch này vì scope batch này dừng ở eligibility-only (chưa có scoreConversion/exactCalculator nào cần tới điểm ưu tiên) — để dành khi VLU tiến lên exact calculator.',
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'vlu-combined-method-conversion-table-unpublished',
    label:
      'Phương thức 3 (kết hợp học bạ 20% + 1 trong 5 kỳ thi: V-ACT/HSA/TSA/V-SAT/SAT, trọng số 80%) cần công thức/bảng quy đổi từng loại điểm đầu vào (thang điểm khác nhau: V-ACT 1200, V-SAT theo thang riêng, SAT 1600...) về cùng 1 thang trước khi áp trọng số 20%/80% — chưa tìm thấy công thức quy đổi cụ thể trên 2 nguồn đã đọc.',
    status: 'incomplete',
    sourceId: 'vlu-admission-info-2026',
    scoreAffecting: true,
    implemented: false,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'vlu-transcript-semester-granularity-gap',
    label:
      'Công thức học bạ chính thức ("tổng điểm trung bình 03 môn theo tổ hợp xét tuyển của 06 học kỳ") cần điểm trung bình TỪNG HỌC KỲ (lớp 10/11/12, mỗi lớp 2 học kỳ) — `ApplicantProfile.transcript` hiện chỉ lưu điểm theo NĂM (`grade10`/`grade11`/`grade12`), không có độ chi tiết theo học kỳ. Đây là data-model gap thật (cùng loại đã ghi nhận ở HUTECH/UFM), không phải thiếu nguồn — không xấp xỉ bằng điểm trung bình năm để "cho ra" một con số gần đúng.',
    status: 'incomplete',
    sourceId: 'vlu-admission-info-2026',
    scoreAffecting: true,
    implemented: false,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'vlu-program-catalog-not-imported',
    label:
      'Danh mục 64 ngành Chương trình tiêu chuẩn + 16 ngành Global Standard + 10 ngành Global Elite, tổ hợp môn xét tuyển từng ngành, và bảng ánh xạ ngành → nhóm ngưỡng (Y khoa-Dược-RHM/Điều dưỡng-KTXNYH/Luật-Luật KT/còn lại) chưa import — evaluator nhận `VluThresholdGroup` trực tiếp từ caller thay vì tự suy từ tên/mã ngành (cùng pattern UFM/HUTECH).',
    status: 'incomplete',
    sourceId: 'vlu-admission-info-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'program-catalog-only',
  },
  {
    id: 'vlu-talent-methods-not-modeled',
    label:
      'Phương thức 4 (kết hợp thi TN THPT + năng khiếu) và Phương thức 5 (kết hợp học bạ + năng khiếu) chưa được model hoá trong UniscoreVN — ngưỡng môn năng khiếu Âm nhạc/Sân khấu Điện ảnh (2 môn: ≥5,00 và ≥7,00 thang 10) đã đọc được, nhưng nhóm ngành Thiết kế/Kiến trúc (chọn 1 trong các môn Vẽ) không có ngưỡng điểm cụ thể trong nguồn đã đọc — để ngoài scope batch này (khác cấu trúc tổ hợp 3 môn chuẩn của phương thức 1-3).',
    status: 'incomplete',
    sourceId: 'vlu-admission-info-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'talent-methods-out-of-scope',
  },
  {
    id: 'vlu-2026-admission-scheme-pdf-not-found',
    label:
      'Đề án tuyển sinh 2026 dạng PDF chính thức — trang lưu trữ đề án của trường (`vlu.edu.vn/dynamic/de-an-tuyen-sinh`) tại thời điểm research (2026-08-20) chỉ có các năm 2018/2023/2024/2025, CHƯA có bản 2026. Dữ liệu trong module này dựa trên 2 bài tin tức chính thức trên cùng domain (`vlu.edu.vn/news/...`), không phải Đề án PDF — nếu Đề án 2026 được công bố sau, cần đối chiếu lại toàn bộ ngưỡng/công thức.',
    status: 'incomplete',
    sourceId: 'vlu-admission-info-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'source-lifecycle-review-needed',
  },
];
