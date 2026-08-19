import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const uhsKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'uhs-method2-weights-range',
    label:
      'Trọng số Phương thức 2 công bố dạng khoảng (THPT 30-35%, ĐGNL 45-50%, học bạ 20%), chưa có giá trị w1/w2 cố định để tính điểm xét tuyển cuối.',
    status: 'incomplete',
    scoreAffecting: true,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'uhs-cutoffs-2026',
    label:
      'UHS đã công bố kết quả trúng tuyển 2026 chính thức (10/8/2026) nhưng bảng chi tiết theo từng ngành chỉ tồn tại dưới dạng ảnh PNG trên Google Drive — link bị hạn chế quyền xem/tải ("owner hasn\'t given you permission to download"), không đọc được nội dung. Báo chí (Tuổi Trẻ, Thanh Niên, VTC News...) chỉ đăng lại 5 con số nhóm ngành lớn thang 100 (Y khoa 82.60, Răng-Hàm-Mặt 81.80, Dược học 73.00, Y học cổ truyền 72.41, Điều dưỡng 67.00), không đủ để khớp chắc chắn với 6 programId UniscoreVN đang hỗ trợ — không rõ "Y khoa (đặt hàng)" (uhs-7720101DH) dùng chung điểm với Y khoa thường hay có cutoff riêng biệt. Vì vậy CHƯA nhập record cutoff nào vào runtime; không dùng dữ liệu 2024/2025 làm cutoff 2026.',
    status: 'official-but-unparsed',
    sourceId: 'uhs-cutoffs-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'cutoff-comparison-blocking',
    attemptedSources: [
      'https://tuyensinh.uhsvnu.edu.vn/category.php?slug=diem-chuan',
      'https://tuyensinh.uhsvnu.edu.vn/news.php?slug=ketqua2026',
      'https://drive.google.com/file/d/16DnPzc4avv3NJvif551lLstBxDqKLk0p/view?usp=sharing',
    ],
    whyNotInferred:
      '5 số báo chí là mức nhóm ngành lớn, không đủ để khẳng định khớp đúng ngành nào trong 6 programId UHS, đặc biệt chưa rõ cutoff riêng của "Y khoa (đặt hàng)"; ảnh PNG chi tiết trên Drive bị chặn quyền tải/xem nên không đọc được text/bảng thật.',
  },
];
