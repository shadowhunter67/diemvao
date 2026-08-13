import { describe, expect, it } from 'vitest';
import { activeAdmissionConfig } from '../config/admission-2026';
import { calculateAdmissionScore } from './calculator';
import type { AdmissionInput } from '../types/admission';

const config = activeAdmissionConfig;

/**
 * Regression test cho behavior rounding HIỆN TẠI (làm tròn từng bước trung gian) — xem
 * `roundingPolicy.ts` cho audit đầy đủ. KHÔNG chứng minh đây là cách đúng theo quy định
 * chính thức (nguồn không nói rõ) — chỉ khóa lại behavior đang chạy để tránh vô tình đổi số
 * khi refactor sau này. Input dưới đây là case tìm được qua fuzz test (200k tổ hợp ngẫu nhiên,
 * xem lịch sử batch 2) cho lệch lớn nhất quan sát được giữa "làm tròn từng bước" (~58.86) và
 * "chỉ làm tròn 1 lần ở cuối" — lệch quan sát được tới ~0.03/100 điểm trên các case khác trong
 * cùng lần fuzz test.
 */
describe('calculateAdmissionScore — rounding regression (khóa behavior hiện tại, không phải quy định chính thức)', () => {
  it('case tìm được qua fuzz test, dùng để khóa behavior rounding từng bước hiện tại', () => {
    const input: AdmissionInput = {
      dgnl: {
        vietnamese: 124.44718854899435,
        english: 46.64623596176519,
        math: 127.9327557650868,
        scientificThinking: 268.6807281763014,
      },
      thpt: {
        math: 9.1546945375937,
        subject2: 3.4914199564694925,
        subject3: 0.38973537635858535,
      },
      transcript: {
        grade10: { math: 9.502179193553303, subject2: 6.6620878140297135, subject3: 6.560099116718222 },
        grade11: { math: 2.1416368879638794, subject2: 6.723166989387964, subject3: 2.99668054316235 },
        grade12: { math: 3.6945733346380596, subject2: 2.165181810532858, subject3: 0.1961093255602797 },
      },
      bonus: { reward: 4.3881123204778305, considerationReward: 0.5339795327057012, encouragement: 2.5636866519889634 },
      priorityRaw30Scale: 0.9375528069892487,
    };

    const result = calculateAdmissionScore(input, config);
    expect(result.finalScore).toBe(58.85);
  });
});
