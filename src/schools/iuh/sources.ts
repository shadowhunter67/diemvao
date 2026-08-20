import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface IuhSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  sourceType?: SourceType;
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
  /** Ghi chú provenance bổ sung khi `url` không đủ diễn đạt (vd file PDF cụ thể + cách verify). */
  note?: string;
}

/**
 * Nguồn đã xác minh cho IUH (Trường Đại học Công nghiệp Thành phố Hồ Chí Minh) 2026 — research
 * 2026-08-19. Domain chính thức: `iuh.edu.vn`, `tuyensinh.iuh.edu.vn` (cả 2 dùng chứng chỉ TLS tự
 * ký/không hợp lệ với client fetch mặc định — đọc được qua `curl -k`/trình duyệt, KHÔNG phải dấu
 * hiệu trang giả; đã đối chiếu nội dung PDF tải về khớp 100% với screenshot con dấu/chữ ký Hiệu
 * trưởng, xem `note` từng nguồn).
 *
 * IUH 2026 chỉ có 2 phương thức: "Xét tuyển thẳng" (theo quy chế Bộ GD-ĐT, không có công thức điểm
 * riêng — cùng quy ước với các trường khác trong repo, không đưa vào methods.ts) và "Xét tuyển kết
 * hợp" (DUY NHẤT phương thức có công thức tính điểm, dùng chung 1 công thức Max(XT1,XT2,XT3) cho mọi
 * ngành/tổ hợp).
 */
export const iuhSources: IuhSource[] = [
  {
    id: 'iuh-admission-notice-2026',
    publisher: 'Trường Đại học Công nghiệp Thành phố Hồ Chí Minh (IUH)',
    title:
      'Thông báo Tuyển sinh Đại học hệ chính quy năm 2026 (Thông báo số 867/TB-ĐHCN ngày 16/4/2026) — nguyên tắc chung, đối tượng, 2 phương thức (xét thẳng/xét kết hợp), danh mục ngành + tổ hợp xét tuyển + Nhóm môn tự chọn TC1-TC12 (Trụ sở chính TP.HCM) và TC1/TC10/TC11 (Phân hiệu Quảng Ngãi — định nghĩa KHÁC bộ TC ở Trụ sở chính dù trùng tên nhãn), Điểm cộng (Điểm thưởng/Điểm xét thưởng/Điểm khuyến khích) dẫn chiếu Phụ lục 1-2, và link công thức tính điểm chi tiết',
    url: 'https://tuyensinh.iuh.edu.vn/thiSinh/fTinhDiem_2026',
    accessedAt: '2026-08-19',
    publishedAt: '2026-04-16',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Trang công cụ tính điểm chính thức (SPA nội bộ, đọc được qua `curl -k` do chứng chỉ TLS tự ký) — nội dung nguyên tắc/danh mục ngành/nhóm môn tự chọn nhúng thẳng trong HTML (không phải PDF quét), đối chiếu cùng nội dung với trang thông báo tĩnh ' +
      'https://iuh.edu.vn/vi/thong-bao/thong-bao-tuyen-sinh-dai-hoc-he-chinh-quy-nam-2026-2176.html (cùng ngày 16/4/2026). Batch này CHỈ import đầy đủ 12 nhóm môn tự chọn (TC1-TC12, Trụ sở chính) — danh mục ngành/mã ngành/tổ hợp cố định theo TỪNG ngành (40 dòng bảng) CHƯA import đầy đủ vào dataset (xem knowledgeGaps.ts), evaluator nhận tổ hợp 3 môn trực tiếp từ caller thay vì tra theo ngành.',
  },
  {
    id: 'iuh-formula-2026',
    publisher: 'Trường Đại học Công nghiệp Thành phố Hồ Chí Minh (IUH)',
    title:
      'CÔNG THỨC TÍNH ĐIỂM XÉT TUYỂN ĐẠI HỌC CHÍNH QUY NĂM 2026 — ĐXT=Max(XT1;XT2;XT3), XT1=0.7×ĐK+0.3×ĐHB+Đ(Kv;Đt)+ĐC, XT2=ĐTN+Đ(Kv;Đt)+ĐC, XT3=ĐĐGNL+Đ(Kv;Đt)+ĐC, ĐK=Max(ĐTN,ĐĐGNL), ĐĐGNL=(Kết quả ĐGNL×30)/ĐTK',
    url: 'https://tuyensinh.iuh.edu.vn/HoSoTuyenSinh/cong-thuc-xet-tuyen-iuh-2026.pdf',
    accessedAt: '2026-08-19',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'File PDF 1 trang, tải trực tiếp từ domain gốc (`tuyensinh.iuh.edu.vn`), đọc nguyên văn công thức (không OCR/mirror). Thang điểm 30. "ĐTK: Điểm cao nhất trong kỳ thi đánh giá năng lực (Điểm thủ khoa của kỳ thi đánh giá năng lực năm 2026)" — số liệu CỤ THỂ của ĐTK 2026 KHÔNG xuất hiện trong văn bản này (biến phụ thuộc kết quả thi) nhưng đã xác định được = 1139 qua nguồn `iuh-vact-topscore-2026` (batch 2026-08-20), xem `calculator.ts:IUH_DTK_2026`.',
  },
  {
    id: 'iuh-vact-topscore-2026',
    publisher: 'ĐHQG-HCM — Trung tâm Khảo thí và Đánh giá Chất lượng Đào tạo',
    title: 'Thủ khoa Kỳ thi Đánh giá năng lực đợt 2 ĐHQG-HCM 2026 đạt 1.139 điểm',
    url: 'https://cetqa.vnuhcm.edu.vn/tin-tuc/thu-khoa-ky-thi-danh-gia-nang-luc-dot-2-dhqghcm-dat-1139-diem-p-341.html',
    accessedAt: '2026-08-20',
    publishedAt: '2026-06-07',
    sourceType: 'vnuhcm',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Trang chính thức của chính đơn vị tổ chức kỳ thi ĐGNL (Trung tâm Khảo thí và Đánh giá Chất lượng Đào tạo, ĐHQG-HCM, domain `.edu.vn`) — verbatim: "Thí sinh có điểm cao nhất trong Kỳ thi V-ACT đợt 2 là 1.139 điểm". Đợt 2 diễn ra sau đợt 1 (đợt 1 báo chí ghi tối đa 1098) nên 1139 là điểm cao nhất của cả năm 2026, khớp đúng định nghĩa "điểm cao nhất trong kỳ thi... năm 2026" (không tách riêng theo đợt) trong `iuh-formula-2026`. Cross-check độc lập: UFM (`ufm-quality-threshold-2026`, đọc trực tiếp PDF gốc, không liên quan tới nguồn này) dùng CHÍNH số 1139 làm trần "Khoảng 1" trong bảng quy đổi bách phân vị ĐGNL↔thi TN THPT của họ.',
  },
  {
    id: 'iuh-bonus-appendix-2026',
    publisher: 'Trường Đại học Công nghiệp Thành phố Hồ Chí Minh (IUH)',
    title:
      'Phụ lục 1 (Danh mục các đối tượng được cộng điểm xét thưởng) + Phụ lục 2 (Danh mục các chứng chỉ được cộng điểm khuyến khích hoặc quy đổi môn Tiếng Anh) — kèm theo Thông báo số 867/TB-ĐHCN ngày 16/4/2026',
    url: 'https://tuyensinh.iuh.edu.vn/HoSoTuyenSinh/PhuLucTBTS_01_2026.pdf',
    accessedAt: '2026-08-19',
    publishedAt: '2026-04-16',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Phụ lục 1: bảng 7 dòng, điểm xét thưởng tối đa 1,50 điểm (tổng, nếu nhiều thành tích). Phụ lục 2 (URL riêng ' +
      'https://tuyensinh.iuh.edu.vn/HoSoTuyenSinh/PhuLucTBTS_02_2026.pdf): điểm khuyến khích IELTS 4.5-6.5+ (0,50→1,50) + bảng quy đổi các chứng chỉ khác (TOEIC 4 kỹ năng/VSTEP/TOEFL ITP/TOEFL iBT) sang IELTS tương đương. Cả 2 file có dấu mộc đỏ + chữ ký PGS.TS. Phan Hồng Hải (Hiệu trưởng), đọc trực tiếp qua Read tool (render ảnh trang PDF, không OCR rời). Dòng 5-7 Phụ lục 1 (trường ký kết hợp tác/trường chuyên/Top trường THPT) tham chiếu danh mục TRA CỨU ĐỘNG trên cổng tuyển sinh (không phải bảng số tĩnh) — CHƯA import (xem knowledgeGaps.ts:iuh-bonus-school-lookup-not-modeled). "Điểm thưởng" (mục đầu tiên trong Điểm cộng, dành cho thí sinh đủ điều kiện xét thẳng nhưng không dùng quyền) KHÔNG có bảng mức điểm cụ thể trong nguồn đọc được — CHƯA quantify (không suy đoán).',
  },
  {
    id: 'iuh-quality-threshold-2026',
    publisher: 'Trường Đại học Công nghiệp Thành phố Hồ Chí Minh (IUH)',
    title:
      'Thông báo số 930/TB-ĐHCN (10/7/2026) — Ngưỡng đảm bảo chất lượng đầu vào tuyển sinh bậc Đại học hệ chính quy năm 2026: Trụ sở chính TP.HCM chương trình Chuẩn 18,00 điểm/chương trình tăng cường tiếng Anh 17,00 điểm (trừ ngành Dược học và các ngành thuộc lĩnh vực Pháp luật, áp dụng ngưỡng riêng theo quy định Bộ GD-ĐT); Phân hiệu Quảng Ngãi 16,00 điểm mọi ngành. Thang điểm 30, không nhân hệ số, không gồm điểm ưu tiên KV/ĐT và điểm cộng. Kèm điều kiện nguồn tuyển theo Thông tư 06/2026/TT-BGDĐT (tổng 3 môn thi TN THPT theo tổ hợp xét tuyển, hoặc Toán+Ngữ văn+1 môn khác, ≥15,00/30).',
    url: 'https://iuh.edu.vn/vi/thong-bao/thong-bao-nguong-dam-bao-chat-luong-dau-vao-tuyen-sinh-bac-dai-hoc-he-chinh-quy-nam-2026-2223.html',
    accessedAt: '2026-08-19',
    publishedAt: '2026-07-10',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'File PDF gốc (1 trang, có dấu/chữ ký, số 930/TB-ĐHCN): https://iuh.edu.vn/upload/files/2026/07/TB%20930.pdf — đọc trực tiếp qua Read tool (render trang PDF, không OCR rời). Module này chỉ implement track "Trụ sở chính TP.HCM, chương trình Chuẩn" (ngưỡng 18,00) — TCTA (17,00)/Phân hiệu Quảng Ngãi (16,00)/Dược-Pháp luật (ngưỡng riêng Bộ GD-ĐT, chưa xác định số cụ thể) CHƯA implement, xem knowledgeGaps.ts. Điều kiện nguồn tuyển Thông tư 06/2026 (≥15,00/30) KHÔNG code riêng vì luôn được bao trùm bởi ngưỡng 18,00 IUH tự đặt trên CÙNG tổ hợp xét tuyển (18>15) — nhánh thay thế "Toán+Ngữ văn+1 môn khác" (khác tổ hợp xét tuyển) chưa modeled.',
  },
  {
    id: 'iuh-admission-cutoff-2026',
    publisher: 'Trường Đại học Công nghiệp Thành phố Hồ Chí Minh (IUH)',
    title:
      'Thông báo số 971/TB-ĐHCN (10/8/2026) — Điểm trúng tuyển bậc Đại học hệ Chính quy năm 2026 (phương thức xét kết hợp) tại Trụ sở chính TP.HCM, 32 dòng ngành/nhóm ngành, thang 30',
    url: 'https://iuh.edu.vn/vi/thong-bao/thong-bao-diem-trung-tuyen-bac-dai-hoc-he-chinh-quy-nam-2026-2236.html',
    accessedAt: '2026-08-19',
    publishedAt: '2026-08-10',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'File PDF gốc (3 trang, có dấu/chữ ký, số 971/TB-ĐHCN): https://iuh.edu.vn/upload/files/2026/08/TB-971-2026.pdf — đọc trực tiếp qua Read tool. Bảng điểm trúng tuyển đọc được đầy đủ (32 dòng, "Điểm trúng tuyển bằng phương thức xét kết hợp căn cứ vào kết quả thi TN THPT 2026, kết quả ĐGNL ĐHQG-HCM 2026, kết quả học tập THPT lớp 12 và thành tích nổi bật (nếu có)") NHƯNG CHƯA đưa vào dataset `cutoffs.ts` trong batch này vì thiếu mã ngành/tổ hợp chuẩn (danh mục ngành CHƯA import đầy đủ, xem knowledgeGaps.ts:iuh-program-catalog-and-cutoffs-not-imported) — module giữ `capabilities.cutoffs: false`, chỉ đăng ký nguồn để dùng ở batch sau.',
  },
];
