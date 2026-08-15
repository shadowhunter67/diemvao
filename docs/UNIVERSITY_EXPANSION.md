# University Expansion Plan

This document is a planning artifact only. Entries here are not runtime support claims.

Runtime integration still requires the existing school-specific path:

1. Official admissions homepage
2. Official 2026 admission announcement
3. Program list
4. Method/formula
5. Threshold
6. Cutoff
7. Conversion tables
8. Bonuses
9. Priority
10. Worked examples, if published

Capability ladder:

| Level | Meaning |
| --- | --- |
| 0 - Catalog | School identity, programs, and official source |
| 1 - Information | Methods, thresholds, or cutoffs can be displayed |
| 2 - Eligibility | Conditions can be evaluated |
| 3 - Partial | Some score components can be calculated |
| 4 - Exact | Verified final score for a supported scope |

## Candidate Queue

| School | Official admission URL | Programs source | 2026 method source | Cutoff source | Potential level | Missing rules | Research status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DH Kinh te Quoc dan | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Ngoai thuong | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Bach khoa Ha Noi | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Cong nghe - DHQG Ha Noi | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Kinh te - DHQG Ha Noi | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Khoa hoc Tu nhien - DHQG Ha Noi | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH KHXH&NV - DHQG Ha Noi | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Y Ha Noi | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 thresholds, health-sector priority rules | Candidate |
| DH Y Duoc TP.HCM | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 thresholds, health-sector priority rules | Candidate |
| DH Su pham TP.HCM | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 thresholds, talent/special conditions | Candidate |
| DH Su pham Ha Noi | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 thresholds, talent/special conditions | Candidate |
| DH Giao thong Van tai | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Cong nghiep TP.HCM | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Ton Duc Thang | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Mo TP.HCM | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Ngan hang TP.HCM | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Luat TP.HCM | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| DH Thuong mai | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| Hoc vien Ngan hang | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |
| Hoc vien Tai chinh | TBD official verification | TBD | TBD | TBD | 0-4 | 2026 formulas, conversion, bonus/priority details | Candidate |

## First Research/Data Sprint Recommendation

Recommended first batch after the compare picker is merged:

1. DH Bach khoa Ha Noi
2. DH Kinh te Quoc dan
3. DH Ngoai thuong
4. DH Y Duoc TP.HCM
5. DH Su pham TP.HCM

Rationale: high applicant demand, national relevance, and likely availability of official admission-method/cutoff publications. This is not a data completeness claim; each school still needs official-source verification before runtime catalog or evaluator integration.

## Runtime Admission Policy

Do not add a school to the runtime catalog just to show an unsupported card. A school should enter the product catalog only when there is useful official information for discovery, program display, admission-method information, eligibility, partial calculation, or exact calculation.

Do not create a universal scoring engine. Every runtime evaluator remains school-specific and must return an honest `AdmissionEvaluation` with evidence and missing rules.
