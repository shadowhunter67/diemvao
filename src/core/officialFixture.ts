import type { RuleEvidence } from './evidence';

/**
 * Một ví dụ minh họa LẤY TỪ tài liệu tuyển sinh chính thức (không phải input/expected tự đặt ra
 * theo cách hiểu của developer) — mục đích tránh tình huống "hiểu sai công thức → code sai →
 * viết test theo cùng cách hiểu sai → test vẫn xanh". Nếu tài liệu chính thức chưa có ví dụ đủ
 * chi tiết cho một trường, KHÔNG bịa fixture — chỉ dùng infra này khi có evidence thật.
 */
export interface OfficialExampleFixture<I, O> {
  id: string;
  schoolId: string;
  year: number;
  description: string;
  evidence: RuleEvidence[];
  input: I;
  expected: O;
}
