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

## First Research Sprint Results - 2026-08-15

| School | Official admission URL | Programs source | 2026 method source | Threshold source | Cutoff source | Level | Implemented status | Remaining gaps | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HUST - Dai hoc Bach khoa Ha Noi | https://ts.hust.edu.vn/tin-tuc/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-nam-2026 | Same official HUST 2026 admission page and school-level pages | Same official HUST page: XTTN, TSA, THPT | HUST page says THPT floor to be announced later | Not integrated in this sprint | 1 | Not runtime-integrated | Full program table/cutoff and final same-context threshold/cutoff data not fully integrated; TSA/THPT scopes need separate evaluator design | Revisit with official threshold/cutoff and machine-readable program table |
| NEU - Dai hoc Kinh te Quoc dan | https://neu.edu.vn/quyet-dinh-ve-viec-ban-hanh-thong-tin-tuyen-sinh-trinh-do-dai-hoc-chinh-quy-nam-2026-cua-dai-hoc-kinh-te-quoc-dan/ | Official attached 2026 admission information file linked from NEU page | Official attached 2026 admission information file | Not integrated in this sprint | Not integrated in this sprint | 1 | Not runtime-integrated | Attached file needs full extraction before program/method-level rules can be represented safely | Extract official attachment and classify applicant groups |
| FTU - Dai hoc Ngoai thuong | https://thongtintuyensinh.ftu.edu.vn/admissions-methods | https://thongtintuyensinh.ftu.edu.vn/programs (JS-heavy official program page) | Official FTU admissions-methods page | Official methods page describes conditions/threshold concepts | Official site has result/cutoff area, not integrated | 1 | Not runtime-integrated | Official program page data is JS/API-backed and was not cleanly extractable enough for checked-in runtime data; many method/campus/program groups need careful modeling | Extract public program API reliably, then add method/campus-aware evaluator |
| UMP - Dai hoc Y Duoc TP.HCM | https://ump.edu.vn/tin-tuc-su-kien/thong-bao/thong-tin-tuyen-sinh-dai-hoc-he-chinh-quy-nam-2026/10140 | Official attached 2026 admission information file linked from UMP page | Official UMP page: one THPT method, certificate bonus 0-1.50/30 | https://ump.edu.vn/tuyen-sinh-dao-tao/dai-hoc/tuyen-sinh?page=1 lists 2026 threshold notice | Not integrated in this sprint | 1 | Not runtime-integrated | Critical attached file/threshold details were not reliably accessible in this environment; bonus table and program conditions must be extracted before runtime | Ask for/download exact official attachments if direct access remains blocked |
| HCMUE - Truong Dai hoc Su pham TP.HCM | https://tuyensinh.hcmue.edu.vn/?site=183 | Official 2026 threshold table at HCMUE admissions site | https://tuyensinh.hcmue.edu.vn/index.php?Itemid=9677&catid=4069%3Atin-tc&id=27804%3Aphng-thc-tuyen-sinh-cac-nganh-ao-tao-trinh-o-ai-hoc-va-nganh-giao-duc-mam-non-trinh-o-cao-ng-he-chinh-quy-nm-2026&lang=vi&option=com_content&site=183&view=article | https://tuyensinh.hcmue.edu.vn/index.php?Itemid=9677&id=27823&lang=vi&option=com_content&site=183&view=article | Not integrated; threshold is not cutoff | 2 | Runtime-integrated as eligibility/threshold checker for 47 main-campus programs | Program-combination map and 2026 admission cutoffs are not runtime-integrated; no final score/cutoff gap | Add program-combination data and cutoff/result source when fully verified |
