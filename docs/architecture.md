# Kiến trúc Uniscore (batch 2, 2026-08-12)

Tài liệu này mô tả các abstraction dùng chung được thêm ở batch 2 — bổ sung cho README.md (chạy
dự án) và CLAUDE.md (lịch sử phase chi tiết theo ngày). Mục tiêu sản phẩm:

> Người dùng nhập hồ sơ/điểm một lần → Uniscore tự giải thích từng trường/phương thức sẽ xử lý hồ
> sơ đó như thế nào, tính được gì, chưa tính được gì, vì sao, dựa trên nguồn nào.

Nguyên tắc bất biến: **KHÔNG universal hóa công thức tuyển sinh**. Mỗi trường vẫn tự tính theo
cách riêng trong `schools/<id>/`. Các abstraction dưới đây chỉ dùng chung ở tầng profile/
metadata/evidence/result — không ép `calculate()` chung chữ ký.

## Luồng dữ liệu — HCMUT (đã wire vào UI thật, batch 3)

```text
Form state (HcmutCalculatorPage.tsx)
        │
        ▼
evaluate.ts: evaluateHcmutAdmission / evaluateHcmutNoDgnlAdmission /
             evaluateHcmutAdmissionFromWeightedDgnlRaw
        │            (chỉ đọc lại kết quả từ calculator/*.ts — không tính lại lần 2)
        ▼
HcmutAdmissionEvaluation { ...AdmissionEvaluation, result: AdmissionResult }
        │
        ├─→ result → CurrentScoreCard / ScoreBreakdownDetails / StickySummaryBar / các section
        │             (đọc field trực tiếp, KHÔNG tự tính lại — presentation-only)
        │
        └─→ explanation (CalculationStep[]) → FormulaExplanation (renderer thuần, không hard-code
              công thức) → EvidenceLinks (per-step "Nguồn")
```

`HcmutAdmissionEvaluation` là type MỞ RỘNG riêng HCMUT (`interface HcmutAdmissionEvaluation extends
AdmissionEvaluation { result: AdmissionResult }`) — `AdmissionEvaluation` (core, generic) không
biết breakdown chi tiết theo field vì mỗi trường có shape khác nhau; ép nó biết sẽ vi phạm nguyên
tắc "không universal hóa". `result` giữ nguyên `AdmissionResult` để UI hiện có (đã viết trước khi
có `AdmissionEvaluation`) không cần đổi props.

Target calculator (`calculateRequiredDgnl`) và `ScenarioSimulator` **cố tình KHÔNG** đi qua
`evaluate.ts` — chúng gọi thẳng `calculator/targetCalculator.ts` (verified engine) như cũ, vì mục
đích của chúng là "what-if" nhiều lần liên tục (binary search hàng chục lần/giây khi kéo slider),
không cần explanation/evidence structured mỗi lần.

## Luồng dữ liệu — UEH/UIT (chưa có exact calculator)

UEH có `evaluateUehAdmission()` (`confidence: 'partial'`, `score` luôn `undefined`) nhưng **chưa
wire vào `UehExplorerPage.tsx`** — trang này vẫn dùng trực tiếp `convertDgnlToThpt`/
`checkUehThreshold` (đã đủ, không cần lớp evaluation cho 2 tool đơn giản này). `evaluate.ts` của
UEH tồn tại như bằng chứng kiến trúc (test + `applicantProfileAdapter.ts`), sẵn sàng dùng khi UEH
có thêm tool phức tạp hơn cần structured explanation.

## Các model mới (`src/core/`)

| File | Mục đích |
|---|---|
| `evidence.ts` | `RuleEvidence`/`SourcedRule<T>` — gắn nguồn vào một hằng số/rule cụ thể (khác `<school>/sources.ts` ở mức dataset). |
| `officialFixture.ts` | `OfficialExampleFixture<I,O>` — ví dụ minh họa lấy từ tài liệu chính thức, dùng làm test, không tự đặt input/expected. |
| `roundingPolicy.ts` | `RoundingRule`/`RoundingAuthority` — phân loại `official`/`presentation`/`assumption` cho từng bước làm tròn. Xem `docs/rounding-audit.md`. |
| `subjects.ts` | `SubjectId`/`SubjectCombination` — taxonomy môn học dùng chung, tối thiểu (4 tổ hợp phổ biến). |
| `knowledgeStatus.ts` | `KnowledgeStatus`/`KnowledgeGap` — vòng đời tri thức (`verified`/`provisional`/`conflicting-sources`/`official-but-unparsed`/`incomplete`/`superseded`), khác `VerificationLevel` (chất lượng nguồn). |
| `admissionMethod.ts` | `AdmissionMethodDescriptor`/`AdmissionMethodCapabilities` — capability ở mức phương thức, chi tiết hơn `SchoolCapabilities` (school-level). |
| `cutoffContext.ts` | `CutoffContext` — metadata mở rộng cho cutoff (method/campus/combination/applicantType/round), additive, demo ở UEH (2 campus). |
| `applicantProfile.ts` | `ApplicantProfile` — dữ liệu factual dùng chung nhiều trường. |
| `calculationStep.ts` | `CalculationStep` — 1 bước trong lời giải thích, sinh từ domain layer. |
| `admissionEvaluation.ts` | `AdmissionEvaluation`/`ResultConfidence` — output contract chung: `exact-verified` / `exact-cross-checked` / `partial` / `unavailable`. `partial`/`unavailable` BẮT BUỘC không có `score`. |
| `privacy.ts` | `FORBIDDEN_SHARE_KEY_PATTERNS` — guardrail test-time chặn key nhạy cảm lọt vào share URL/localStorage. |

## Ví dụ dùng thật (không phải type rỗng)

- `schools/hcmut/evidence.ts` + `schools/ueh/evidence.ts` — evidence cho hằng số quan trọng nhất.
- `schools/ueh/dgnlConversion.fixtures.ts` — fixture chính thức đầu tiên (950→25.55).
- `schools/hcmut/methods.ts` + `schools/ueh/methods.ts` — method descriptor, test khớp `SchoolCapabilities` (`schools/methods.test.ts`).
- `schools/ueh/cutoffContext.ts` — join cutoff+program ra `CutoffContext` (campus hcmc/mekong).
- `schools/uit/knowledgeGaps.ts` + `schools/ueh/knowledgeGaps.ts` — UI đọc list gap từ data, không hard-code text.
- `schools/hcmut/applicantProfileAdapter.ts` — `buildHcmutAdmissionInput(profile, context)`, test chứng minh kết quả khớp 100% khi gọi `calculateAdmissionScore` trực tiếp.
- `schools/hcmut/evaluate.ts` — `evaluateHcmutAdmission`/`evaluateHcmutNoDgnlAdmission`/`evaluateHcmutAdmissionFromWeightedDgnlRaw`, `confidence: 'exact-verified'`, explanation 7 bước, **đã wire vào `HcmutCalculatorPage.tsx` thật** (batch 3).
- `schools/ueh/evaluate.ts` — `evaluateUehAdmission`, `confidence: 'partial'`, `score` luôn `undefined`, `eligibility: 'unknown'` trừ khi người dùng tự cung cấp điểm đã biết.
- `components/FormulaExplanation.tsx` + `components/EvidenceLinks.tsx` (batch 3) — renderer thuần từ `CalculationStep[]`, không hard-code công thức.
- `schools/hcmut/abilityScoreLabel.ts` (batch 3) — nguồn sự thật duy nhất cho label "ĐGNL" vs "Điểm năng lực", dùng ở cả `evaluate.ts` và `CurrentScoreCard.tsx`.
- `schools/ueh/applicantProfileAdapter.ts` + `core/applicantProfile.crossSchool.test.ts` (batch 3) — proof "1 profile, 2 trường đọc 2 field khác nhau" (HCMUT đọc `vact.components`, UEH đọc `vact.total`).

## Domain smell đã fix (workstream B)

`AdmissionResult.dgnl` (tên field) **giữ nguyên** — đổi tên sẽ lan khắp UI hiện có. Thêm field mới
`AdmissionResult.abilitySource?: 'dgnl-vnuhcm' | 'thpt-derived'` để domain layer không còn ngầm
định giá trị trong `dgnl` luôn là điểm ĐGNL thật. `evaluate.ts` dùng field này để chọn label đúng
("Chuẩn hóa ĐGNL" vs "Điểm năng lực (quy đổi từ THPT)").

## Rounding policy

Xem `docs/rounding-audit.md` — kết luận: HCMUT không có quy định chính thức về làm tròn bước
trung gian, code hiện tại (làm tròn từng bước) là assumption, đo được lệch tối đa ~0.03/100 điểm
so với "chỉ làm tròn 1 lần ở cuối". **Không đổi thuật toán** (chưa có evidence bước nào đúng hơn),
chỉ document + khóa lại bằng regression test (`calculator.rounding.test.ts`).

## Privacy

Share URL (`urlState.ts`) và localStorage HCMUT hiện chỉ chứa điểm số/id ngành/mã đối tượng —
không có tên/CCCD/ngày sinh/SĐT/email. Guardrail test ở `urlState.test.ts` (`privacy guardrail`)
chặn regression nếu sau này có field nhạy cảm vô tình được serialize.

## Batch 3 (2026-08-13) — HCMUT vertical slice đã đi vào UI thật

`HcmutCalculatorPage.tsx` không còn gọi `calculateAdmissionScore`/`calculateAdmissionScoreNoDgnl`/
`calculateAdmissionScoreFromWeightedDgnlRaw` trực tiếp — cả 3 nhánh (đối tượng có ĐGNL, không có
ĐGNL, chế độ "Nhập tổng điểm ĐGNL") đều đi qua `evaluate.ts`. `FormulaExplanation.tsx` (nay ở dạng
danh sách 7 bước tuần tự thay vì sơ đồ Phase 7c — xem "Đổi UX" bên dưới) đọc `CalculationStep[]`
từ `evaluation.explanation`, không hard-code % trọng số/ngưỡng nào. `CurrentScoreCard` dùng
`getAbilityScoreLabel`/`getAbilityScoreSourceCaption` (`schools/hcmut/abilityScoreLabel.ts`) thay
vì tự map theo `applicantType` — nguồn sự thật giờ là `result.abilitySource`.

**Parity đã chứng minh** (`evaluate.parity.test.ts`): 5 case biên (max/typical/quanh ngưỡng ưu
tiên/bonus cap/final cap) + fuzz 3000 input deterministic (seed cố định) cho cả 3 nhánh — 100%
khớp `finalScore`/`baseScore`/`academic`/`bonus`/`priority`/normalized scores giữa hàm calculator
gốc và `evaluate.ts`. Không có sai khác nào được phát hiện — không cần "dừng migration" phần nào.

**Đổi UX có chủ đích**: `FormulaExplanation` đổi từ sơ đồ flow tĩnh (chỉ vẽ % trọng số, không có
số của user) sang danh sách 7 bước có SỐ THẬT của lần tính hiện tại + nguồn mở được từng bước —
đúng mockup batch 3 yêu cầu ("Điểm xét tuyển: 82.37 → Xem cách tính → 1. ... 7. ..."). Đánh đổi:
mất phần chip trực quan (Tiếng Việt/Tiếng Anh/Toán×2...) của thiết kế Phase 7c.

## Chưa làm (để lại có chủ đích, không phải bỏ sót)

- **`ApplicantProfile` CHƯA wire vào form HCMUT chính** — form hiện tại dùng field trung tính
  "Môn 2"/"Môn 3" (không gắn tên môn cụ thể, xem CLAUDE.md Phase 8), nên map sang
  `ApplicantProfile.thpt.scores[SubjectId]` sẽ phải ĐOÁN tổ hợp môn của người dùng — vi phạm
  nguyên tắc "không giả dữ liệu khi evidence thiếu". `buildHcmutAdmissionInput` (batch 2) vẫn là
  consumer thật, dùng đúng khi có combination thật (test + proof cross-school ở
  `core/applicantProfile.crossSchool.test.ts`) — chỉ chưa gắn vào trang chính vì trang chính chưa
  thu thập dữ liệu cần thiết.
- **UEH chưa wire `evaluateUehAdmission`/`buildUehEvaluationInput` vào `UehExplorerPage.tsx`** —
  trang hiện tại đã đủ đơn giản (1 input, 1 conversion) không cần lớp evaluation; adapter tồn tại
  như proof kiến trúc + sẵn sàng khi UEH cần tool phức tạp hơn.
- **Subject taxonomy chưa áp cho toàn bộ tổ hợp VN** — chỉ 4 tổ hợp phổ biến (A00/A01/B00/D01), đủ
  cho adapter/test hiện tại.
- **`KnowledgeStatus` mới áp dụng cho UIT + UEH** — HCMUS/USSH provisional/conflicting-sources
  (nếu có) chưa migrate vì docs hiện tại chưa có case cụ thể đủ rõ để gán state mà không suy đoán.
