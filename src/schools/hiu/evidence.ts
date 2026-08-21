import type { SourcedRule } from '../../core/evidence';

/** Ngưỡng đầu vào phương thức thi TN THPT — chỉ nhóm `standard` có số cụ thể (15/30). Nhóm sức
 * khỏe có cấp phép hành nghề/pháp luật dùng ngưỡng do Bộ GD&ĐT quy định — nguồn KHÔNG nêu con số,
 * xem `hiu-health-license-law-threshold-not-found`. */
export const hiuThptExamThresholdEvidence = {
  value: { standard: 15 },
  evidence: [
    {
      sourceId: 'hiu-quality-threshold-2026',
      location:
        '"đối với phương thức xét kết quả thi tốt nghiệp THPT, mức điểm sàn áp dụng cho phần lớn các ngành là 15 điểm"; "Riêng ngành Kỹ thuật Y sinh, Công nghệ thẩm mỹ, Dinh dưỡng, Y tế công cộng cùng thuộc lĩnh vực sức khỏe, tiếp tục áp dụng mức điểm sàn chung 15 điểm."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<{ standard: number }>;

/** Ngưỡng đầu vào phương thức ĐGNL ĐHQG-HCM — thang 1200, điểm thô, khớp trực tiếp
 * `ApplicantProfile.exams.vact.total`. 3 nhóm đều có số cụ thể trong nguồn. */
export const hiuVactThresholdEvidence = {
  value: { standard: 650, 'medicine-dentistry-law': 700, 'traditional-medicine-pharmacy': 675 },
  evidence: [
    {
      sourceId: 'hiu-quality-threshold-2026',
      location:
        '"trường nhận hồ sơ từ 650 điểm đối với phần lớn các ngành. Nhóm ngành Y khoa, Răng – Hàm – Mặt, Luật và Luật kinh tế yêu cầu từ 700 điểm; Y học cổ truyền và Dược học từ 675 điểm."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<'standard' | 'medicine-dentistry-law' | 'traditional-medicine-pharmacy', number>>;
