import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-18 — văn bản chính thức "THÔNG TIN TUYỂN SINH ĐẠI HỌC CHÍNH QUY NĂM 2026" số
 * 1691/ĐHCNKT-ĐT (đã ký, xem `sources.ts`) chứa đầy đủ công thức và bảng số cho phần lớn rule
 * score-affecting (điểm ưu tiên, điểm xét thưởng cá nhân, ngưỡng đầu vào chung). Các khoảng trống
 * dưới đây là những gì CHÍNH VĂN BẢN tự nói rõ "sẽ công bố sau" hoặc yêu cầu tra cứu phụ lục quá
 * lớn để đưa vào batch này — không phải suy đoán.
 *
 * RE-AUDIT 2026-08-18 (batch 2): gap `hcmute-correlation-coefficients-ab` (hệ số a/b) đã RESOLVED
 * — Thông báo số 2092/TB-ĐHCNKT ngày 07/7/2026 (`sources.ts:hcmute-correlation-coefficients-2026`)
 * công bố chính thức a=0,8 (THPT/Học bạ), b=0,8 (THPT/ĐGNL), kèm 3 bảng công thức HLy.1/HLy.2/HLy.3
 * theo nhóm ngành — supersede hẳn statement "sẽ công bố sau" của văn bản tháng 6. Entry gap cũ bị
 * XÓA khỏi mảng này (không giữ lại đánh dấu resolved) theo đúng pattern đã dùng ở
 * `schools/ueh/knowledgeGaps.ts` — coverage regression cho đúng lớp bug "gap cũ tồn tại dù nguồn
 * mới đã publish" nằm ở `knowledgeGaps.test.ts`. HLy.3 (nhánh ĐGNL) giờ tính được ĐẦY ĐỦ, không
 * phụ thuộc ĐXTT. HLy.2 (nhánh học bạ) vẫn cần ĐXTT — xem gap `hcmute-school-group-bonus-dxtt` bên
 * dưới, giờ là blocker DUY NHẤT còn lại cho HLy.2 (trước đây bị chặn kép bởi cả a/b lẫn ĐXTT).
 *
 * BATCH 3 (2026-08-18, expansion): gap `hcmute-program-specific-eligibility-not-wired` đã RESOLVED
 * — `evaluate.ts` giờ nhận `programId` + `grade12Excellent` và áp đúng ngưỡng riêng SP tiếng
 * Anh/SP công nghệ/Luật (`eligibility.ts:HCMUTE_TEACHER_OR_LAW_PROGRAM_IDS`) thay vì ngưỡng chung
 * khi programId khớp. Nhóm công thức `english`/`design-architecture` cũng đã wire (trước đây chỉ
 * có pure calculator function).
 */
export const hcmuteKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hcmute-school-group-bonus-dxtt',
    label:
      'Điểm xét thưởng theo nhóm trường THPT (ĐXTT, Bảng 3: trường liên kết/chuyên-năng khiếu/trường ưu tiên) — cần đối chiếu 3 phụ lục lên tới ~660 dòng (Phụ lục 6/7/8: danh sách trường chuyên, trường ưu tiên, trường liên kết) để xác định thí sinh có thuộc diện hay không. Chưa import trong batch này.',
    status: 'official-but-unparsed',
    sourceId: 'hcmute-admission-info-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'ĐXTT chỉ áp dụng cho công thức HLy.2 (kết hợp học bạ) — thí sinh KHÔNG khai học bạ để xét kết hợp thì HLy.2 không phát sinh (không phải gap, là ngoài phạm vi), nên chỉ chặn đúng nhánh HLy.2 của thí sinh CÓ khai học bạ.',
    impact: 'hly2-transcript-route-blocking',
  },
  {
    id: 'hcmute-bonus-other-categories',
    label:
      'Điểm xét thưởng cá nhân (ĐXTCN) mục 1 (điểm thưởng diện tuyển thẳng không dùng quyền) và mục 4-7 (giải KHKT/mỹ thuật/thể thao/tay nghề theo ngành đặc thù), Bảng 2 văn bản 1691/ĐHCNKT-ĐT — chỉ mục 2 (giải HSG cấp tỉnh) và mục 3 (khuyến khích HSG quốc gia) đã implement (`bonus.ts`).',
    status: 'official-but-unparsed',
    sourceId: 'hcmute-admission-info-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Mục 4-7 áp dụng theo ngành đặc thù (không phải mọi ngành), cần đối chiếu danh mục ngành trước khi implement đúng phạm vi — chưa làm trong batch này.',
    impact: 'bonus-underclaim-for-uncommon-achievements',
  },
  {
    id: 'hcmute-microchip-percentile-threshold',
    label:
      'Ngưỡng đầu vào riêng Chương trình Kỹ thuật thiết kế vi mạch: yêu cầu thuộc nhóm 25% thí sinh có điểm tổ hợp xét tuyển cao nhất toàn quốc và nhóm 20% thí sinh có điểm môn Toán cao nhất toàn quốc — số liệu percentile do Bộ GDĐT công bố hằng năm, không có trong văn bản trường và UniscoreVN không có nguồn dữ liệu phổ điểm toàn quốc.',
    status: 'incomplete',
    sourceId: 'hcmute-admission-info-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'eligibility-only-gap',
  },
];
