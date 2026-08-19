import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { ufmKnowledgeGaps } from './knowledgeGaps';

const hocbaGap = ufmKnowledgeGaps.filter((gap) => gap.id === 'ufm-final-score-conversion-unparsed');
const vsatGap = ufmKnowledgeGaps.filter((gap) => gap.id === 'ufm-vsat-scale-unconfirmed' || gap.id === 'ufm-final-score-conversion-unparsed');
const dgnlGap = ufmKnowledgeGaps.filter((gap) => gap.id === 'ufm-final-score-conversion-unparsed');

/**
 * UFM 2026 — 4 phương thức tính điểm (mã 200/402/416/100; PT xét thẳng mã 301 không có công thức
 * điểm, không đưa vào đây, cùng quy ước HUFLIT/HUTECH).
 *
 * Re-verify 2026-08-19 qua domain gốc (`login.ufm.edu.vn`, screenshot trực tiếp, xem
 * `knowledgeGaps.ts`/`evidence.ts`):
 *
 * - `thpt`: `exactCalculator: true`, `bonus: true` — phạm vi chương trình CHUẨN (hệ số Toán×2 xác
 *   nhận CHỈ áp dụng chương trình Tiếng Anh toàn phần, không áp dụng Chuẩn — gap
 *   `ufm-math-coefficient-scope-conflicting` đã đóng). Bảng điểm cộng b1/b2/b3 đã verified, gap
 *   `ufm-bonus-table-not-found` đã đóng. "Điểm xét tuyển" phương thức này dùng thẳng tổng thô thang
 *   30 (không qua bước quy đổi bách phân vị) nên KHÔNG bị chặn bởi
 *   `ufm-final-score-conversion-unparsed`. KHÔNG gắn `knowledgeGaps` vào descriptor này (cùng lý do
 *   các trường trước — `auditMethods()` coi `exactCalculator:true` + `knowledgeGaps` non-empty là
 *   lỗi EXACT_METHOD_HAS_UNRESOLVED_GAPS).
 * - `hocba`/`dgnl`/`vsat`: giữ/hạ `exactCalculator: false` — văn bản gốc xác nhận "Điểm xét tuyển"
 *   của cả 3 phương thức này đều phải quy đổi qua bảng bách phân vị Bộ GD-ĐT sang thang 30 trước khi
 *   cộng ưu tiên/điểm cộng, bảng đó CHƯA parse hết (`ufm-final-score-conversion-unparsed`). `dgnl`
 *   TRƯỚC batch này claim `exactCalculator: true` bằng công thức thang 1200 — đã xác định đó là SAI
 *   theo văn bản gốc nên hạ xuống `false` để không tiếp tục claim sai (xem note trong
 *   `ufm-final-score-conversion-unparsed`).
 */
export const ufmAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ufm-thpt-2026',
    schoolId: 'ufm',
    name: 'Xét kết quả thi tốt nghiệp THPT 2026 (mã PT 100)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026, chương trình Chuẩn'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: true, priority: true, exactCalculator: true },
  },
  {
    id: 'ufm-hocba-2026',
    schoolId: 'ufm',
    name: 'Xét học bạ THPT (mã PT 200)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT'],
    capabilities: { eligibility: false, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: hocbaGap,
  },
  {
    id: 'ufm-vsat-2026',
    schoolId: 'ufm',
    name: 'Xét kết quả V-SAT 2026 (mã PT 416)',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả V-SAT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: vsatGap,
  },
  {
    id: 'ufm-dgnl-2026',
    schoolId: 'ufm',
    name: 'Xét kết quả ĐGNL ĐHQG TP.HCM 2026 (mã PT 402)',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả ĐGNL ĐHQG-HCM 2026, chương trình Chuẩn'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: dgnlGap,
  },
];
