import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-15 (browser thật, chrome-devtools) — 4 ảnh đính kèm Thông báo 24/TB-HĐTS đã mở
 * và đọc trực tiếp. Kết quả: ngưỡng 43 ngành (THPT/ĐGNL) và hệ số β1/β2/β3 = 0,4/0,4/0,2 là exact,
 * có nguồn ảnh đã ký. Các thành phần dưới đây VẪN thiếu vì lý do CỤ THỂ đọc được từ chính ảnh
 * (trang 3-4), không phải "trường chưa công bố" chung chung.
 */
export const aguKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'agu-component-conversion-formula',
    label:
      'Công thức quy đổi cụ thể từng thành phần (THPT/ĐGNL/Học bạ) về thang điểm 100 — ảnh thông báo dẫn chiếu "đã được công bố trong Thông tin tuyển sinh" tại tuyensinh.agu.edu.vn/tuyen-sinh, nhưng trang đó chỉ có công cụ JS tính sẵn (input → kết quả), không có công thức dạng văn bản/ảnh đọc được.',
    status: 'official-but-unparsed',
    sourceId: 'agu-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    attemptedSources: [
      '4 ảnh đính kèm Thông báo 24/TB-HĐTS (trang 1-4): không chứa công thức quy đổi từng thành phần.',
      'tuyensinh.agu.edu.vn/tuyen-sinh: chỉ có widget JS "Ước tính điểm xét tuyển", không có công thức dạng prose.',
    ],
    whyNotInferred:
      'Không suy công thức quy đổi từ hành vi input/output của widget JS vì widget này đồng thời tự ghi "hệ số giả lập" ở phần β — không đủ tin cậy để coi các công thức quy đổi khác trong cùng widget là chính thức.',
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'agu-equivalence-conversion-table',
    label:
      'Bảng quy đổi tương đương điểm trúng tuyển giữa các tổ hợp môn — ảnh trang 4 của thông báo nói rõ Trường "SẼ xây dựng và công bố" (thì tương lai), tức CHƯA tồn tại tại thời điểm research.',
    status: 'incomplete',
    sourceId: 'agu-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'combination-equivalence-only',
  },
  {
    id: 'agu-bonus-priority-table',
    label:
      'Bảng điểm cộng và điểm ưu tiên khu vực/đối tượng — chỉ xuất hiện trong widget "Ước tính điểm xét tuyển" (JS demo) trên tuyensinh.agu.edu.vn/tuyen-sinh, không có trong 4 ảnh đã ký của thông báo chính thức. Widget tự ghi phần β là "hệ số giả lập" nên toàn bộ nội dung trong cùng widget (kể cả bảng ưu tiên, công thức giảm điểm ưu tiên, mức cộng tối đa 10 điểm) không được dùng làm evidence độc lập.',
    status: 'official-but-unparsed',
    sourceId: 'agu-tuyensinh-tool-page-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred:
      'Không dùng số liệu trong widget demo làm nguồn duy nhất cho một rule ảnh hưởng điểm số, kể cả khi số liệu trùng khớp phần khác đã verified (β).',
    impact: 'exact-final-score-blocking',
  },
];
