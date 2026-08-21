import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-21 (bài đăng chính thức HIU đọc trực tiếp qua browser thật, xem
 * `sources.ts:hiu-quality-threshold-2026`). Ngưỡng thi TN THPT nhóm `standard` (15/30) và ngưỡng
 * ĐGNL ĐHQG-HCM cả 3 nhóm (650/700/675, thang 1200) đã verified. Các mục dưới đây là gap CỤ THỂ
 * đọc được từ chính văn bản.
 */
export const hiuKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hiu-health-license-law-threshold-not-found',
    label:
      'Ngưỡng đầu vào phương thức thi TN THPT cho nhóm pháp luật (Luật, Luật Kinh tế) và nhóm sức khỏe có cấp phép hành nghề (Y khoa, Y học cổ truyền, Răng Hàm Mặt, Dược học, Kỹ thuật xét nghiệm y học, Kỹ thuật hình ảnh y học, Kỹ thuật phục hồi chức năng, Kỹ thuật Y sinh, Điều dưỡng, Hộ sinh) — nguồn chỉ ghi "sẽ áp dụng theo ngưỡng đảm bảo chất lượng đầu vào do Bộ Giáo dục và Đào tạo quy định, dự kiến công bố trước 17h00 ngày 8-7-2026", KHÔNG nêu con số cụ thể trong bài đăng này.',
    status: 'incomplete',
    sourceId: 'hiu-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Không tái dùng ngưỡng Bộ GD&ĐT của trường khác (CTU dẫn Quyết định 1961/1963/QĐ-BGDĐT cho pháp luật/sư phạm, không phải sức khỏe) cho HIU trong batch này — chưa tìm thấy quyết định riêng khối sức khỏe/pháp luật áp dụng cho HIU trong bài đăng này.',
    impact: 'eligibility-partial-scope',
  },
  {
    id: 'hiu-combined-method-formula-not-found',
    label:
      'Phương thức kết hợp thi TN THPT + học bạ lớp 12 — nguồn chỉ nêu ngưỡng (16/30 phần lớn ngành, cao hơn cho khối sức khỏe cấp phép hành nghề) mà KHÔNG có công thức trọng số cụ thể (tỷ lệ % thi TN THPT / học bạ) để tính điểm xét tuyển kết hợp — không thể xây evaluator cho phương thức này.',
    status: 'official-but-unparsed',
    sourceId: 'hiu-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Không tự đặt tỷ lệ trọng số (vd 50/50 hay 70/30) khi nguồn không công bố — sai tỷ lệ sẽ làm sai điểm xét tuyển.',
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'hiu-priority-bonus-table-not-found',
    label: 'Bảng điểm ưu tiên khu vực/đối tượng cụ thể áp dụng cho HIU và bảng điểm cộng thành tích/chứng chỉ (nếu có) chưa tìm được nguồn HIU tự công bố riêng — điểm sàn công bố ở đây là điều kiện đăng ký, không phải điểm chuẩn trúng tuyển cuối.',
    status: 'incomplete',
    sourceId: 'hiu-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'hiu-program-catalog-not-imported',
    label:
      'Danh mục 43 ngành/chương trình đào tạo đầy đủ, mã xét tuyển, tổ hợp môn từng ngành và bảng ánh xạ ngành → nhóm ngưỡng (standard/medicine-dentistry-law/traditional-medicine-pharmacy/health-license-or-law) chưa import — evaluator nhận group trực tiếp từ caller (cùng pattern HUB/CTU/TDMU), không tự suy từ tên ngành.',
    status: 'incomplete',
    sourceId: 'hiu-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'program-catalog-only',
  },
];
