import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const hcmueKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hcmue-program-combination-map-2026',
    label: 'Danh sách tổ hợp xét tuyển theo từng ngành HCMUE 2026 chưa được transcribe vào runtime.',
    status: 'official-but-unparsed',
    sourceId: 'hcmue-methods-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'eligibility-context-guard',
  },
  {
    id: 'hcmue-current-cutoffs-2026',
    label:
      'Điểm trúng tuyển 2026 (cột "KQ thi TN THPT 2026") đã nhập đủ 47/47 ngành trụ sở chính TP.HCM + 10 ngành phân hiệu Long An + 5 ngành phân hiệu Gia Lai (`src/schools/hcmue/data/cutoffs.ts`) từ ảnh bảng gốc user cung cấp trực tiếp (2 file Drive đính kèm bài đăng vẫn khóa quyền tải, không dùng được). CHƯA nhập cột song song "KQ học tập THPT kết hợp ĐGNLCB / kết quả thi NK kết hợp ĐGNLCB" (cột phải trên bảng gốc) để tránh rủi ro lẫn cột khi nhập tay trong 1 lượt. Ngưỡng đầu vào (threshold) riêng cho Long An/Gia Lai KHÔNG có trong bảng công bố — `HcmueProgramThreshold.thptThreshold30/dgnlcbThreshold30` để `undefined` cho 15 ngành phân hiệu, không suy đoán bằng số trụ sở chính. Ngưỡng đầu vào (threshold) không được gán là điểm chuẩn (cutoff).',
    status: 'incomplete',
    sourceId: 'hcmue-cutoffs-2026',
    scoreAffecting: false,
    implemented: true,
    missingData: [
      'Cột "KQ học tập THPT kết hợp ĐGNLCB / kết quả thi NK kết hợp ĐGNLCB" (cột phải trên bảng gốc) cho cả 62 dòng đã nhập.',
      'Ngưỡng đầu vào (threshold) riêng cho 15 ngành phân hiệu Long An/Gia Lai — bảng gốc không công bố, không suy đoán bằng số trụ sở chính.',
    ],
    impact: 'cutoff-comparison-blocking',
    attemptedSources: [
      'https://drive.usercontent.google.com/download?id=1lANt8eWxrU94gXvWcs32j8Jyqy4k40xc&export=download (các phương thức còn lại) — vẫn lỗi quyền tải',
      'https://drive.usercontent.google.com/download?id=1ylqhRWfKWs11yxAG7PM4EV4cmj9BuvpY&export=download (Ưu tiên xét tuyển) — vẫn lỗi quyền tải',
      'https://xettuyen.hcmue.edu.vn/tra-cuu-ket-qua — cổng tra cứu theo số báo danh cá nhân, không phải bảng điểm chuẩn công khai theo ngành',
    ],
    whyNotInferred:
      'Google Drive trả "Sorry, the owner hasn\'t given you permission to download this file." cho cả 2 file đính kèm bài thông báo 11/08/2026 (id=27828) — đã đọc được số thật qua ảnh bảng gốc user gửi trực tiếp thay vì Drive, không suy đoán.',
    note:
      'Bài đăng gốc: http://tuyensinh.hcmue.edu.vn/index.php?option=com_content&view=article&id=27828&catid=4069&Itemid=9677&lang=vi&site=183 (đăng 11/08/2026 17:09, KHÔNG nhầm với bài id=27810 "Điểm trúng tuyển 2 năm gần nhất" đăng 14/04/2026 chỉ có số liệu 2024/2025). Runtime evaluator (`evaluateHcmueAdmission`) vẫn KHÔNG tính `evaluation.score` nên bảng cutoff này chưa kích hoạt cutoff-comparison ở `/compare` — chỉ là dữ liệu tham khảo hiện tại.',
  },
];
