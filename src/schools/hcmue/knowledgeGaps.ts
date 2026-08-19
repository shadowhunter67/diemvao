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
      'Điểm trúng tuyển 2026 theo ngành/phương thức đã được HCMUE công bố chính thức 11/08/2026 nhưng chỉ ở dạng file Google Drive bị khóa quyền tải (không phải text/HTML) — UniscoreVN chưa đọc được bảng số nên chưa tích hợp; ngưỡng đầu vào (threshold) không được gán là điểm chuẩn (cutoff).',
    status: 'official-but-unparsed',
    sourceId: 'hcmue-cutoffs-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'cutoff-comparison-blocking',
    attemptedSources: [
      'https://drive.usercontent.google.com/download?id=1lANt8eWxrU94gXvWcs32j8Jyqy4k40xc&export=download (các phương thức còn lại) — lỗi quyền tải',
      'https://drive.usercontent.google.com/download?id=1ylqhRWfKWs11yxAG7PM4EV4cmj9BuvpY&export=download (Ưu tiên xét tuyển) — lỗi quyền tải',
      'https://xettuyen.hcmue.edu.vn/tra-cuu-ket-qua — cổng tra cứu theo số báo danh cá nhân, không phải bảng điểm chuẩn công khai theo ngành',
    ],
    whyNotInferred:
      'Google Drive trả "Sorry, the owner hasn\'t given you permission to download this file." cho cả 2 file đính kèm bài thông báo 11/08/2026 (id=27828) — không có cách đọc nội dung mà không đoán số.',
    note:
      'Bài đăng gốc: http://tuyensinh.hcmue.edu.vn/index.php?option=com_content&view=article&id=27828&catid=4069&Itemid=9677&lang=vi&site=183 (đăng 11/08/2026 17:09, KHÔNG nhầm với bài id=27810 "Điểm trúng tuyển 2 năm gần nhất" đăng 14/04/2026 chỉ có số liệu 2024/2025). Người dùng cần tự mở 2 link Drive (đăng nhập Google) hoặc chờ trường mở quyền tải để lấy bảng điểm.',
  },
];
