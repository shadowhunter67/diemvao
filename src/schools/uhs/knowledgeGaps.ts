import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const uhsKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'uhs-method2-weights-range',
    label:
      'Trọng số Phương thức 2 công bố dạng khoảng (THPT 30-35%, ĐGNL 45-50%, học bạ 20%), chưa có giá trị w1/w2 cố định để tính điểm xét tuyển cuối.',
    status: 'incomplete',
    scoreAffecting: true,
    impact: 'exact-final-score-blocking',
    note:
      'Re-check 2026-08-20: trang chính thức `tuyensinh.uhsvnu.edu.vn/news.php?slug=thongtintuyensinh` VẪN ghi dạng khoảng ("w1 trong khoảng 30% đến 35%; w2 trong khoảng 45% đến 50%; w3 = 20%"). Một bài báo Tuổi Trẻ (10/7/2026, "Trường ĐH Khoa học Sức khỏe lấy điểm sàn 18-22, điều chỉnh cách tính điểm xét tuyển") trích "w1=30%; w2=50%; w3=20%" như số CỐ ĐỊNH đã điều chỉnh — nhưng đây là nguồn thứ cấp DUY NHẤT, chưa tìm được xác nhận trực tiếp từ chính UHS (trang tra cứu kết quả `news.php?slug=ketqua2026` chỉ dẫn tới link Google Drive, không có công thức). KHÔNG đủ để nâng verification — cần tìm văn bản UHS gốc xác nhận con số này trước khi implement, để lại làm lead cho batch sau.',
  },
  {
    id: 'uhs-cutoffs-2026',
    label:
      'Điểm trúng tuyển 2026 (Phương thức 2, Mã phương thức: 500) đã nhập vào `data/cutoffs.ts` cho 5/6 programId — bảng gốc do người dùng cung cấp trực tiếp (link Drive trên trang chính thức vẫn bị hạn chế quyền tải). "Y khoa (đặt hàng)" (uhs-7720101DH, quota riêng 120) KHÔNG có trong bảng — bảng gốc chỉ ghi 1 dòng "Y khoa" chung, không tách đặt hàng, nên uhs-7720101DH vẫn chưa có cutoff riêng. Cutoff KHÔNG hiện trong `/compare` vì UHS chưa tính được điểm xét tuyển cuối cùng (w1/w2 dạng khoảng, xem `uhs-method2-weights-range`) — dữ liệu này hiện chỉ mang tính tham khảo.',
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
      'uhs-7720101DH (Y khoa đặt hàng) không có dòng riêng trong bảng gốc, không suy đoán dùng chung điểm với Y khoa thường.',
  },
];
