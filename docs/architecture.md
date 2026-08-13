# Kiến trúc UniscoreVN (batch 2, 2026-08-12)

Tài liệu này mô tả các abstraction dùng chung được thêm ở batch 2 — bổ sung cho README.md (chạy
dự án) và CLAUDE.md (lịch sử phase chi tiết theo ngày). Mục tiêu sản phẩm:

> Người dùng nhập hồ sơ/điểm một lần → UniscoreVN tự giải thích từng trường/phương thức sẽ xử lý hồ
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

## Batch 6 (2026-08-13) — Method-level capability runtime + THPT profile guardrail

### Capability hierarchy: method-level là truth, school-level chỉ là summary

```text
AdmissionMethodDescriptor[]  = chi tiết THẬT ("trường/phương thức này tính được đến đâu")
        │
        ▼  aggregateSchoolCapabilities() — OR qua các field overlap
        │  (eligibility/scoreConversion/exactCalculator — KHÔNG derive admissionInfo/programs/
        │  cutoffs vì đó là capability trang/dataset, không phải phương thức tính điểm)
        ▼
SchoolModule.capabilities    = summary cấp trường (Landing/page đọc field này)
```

`core/admissionMethod.ts` thêm `aggregateSchoolCapabilities()` + `AdmissionMethodDescriptor.schoolId`/
`.knowledgeGaps` (additive). `schools/{hcmut,ueh,uel,uit}/index.ts` giờ derive `capabilities` từ
`aggregateSchoolCapabilities(schoolAdmissionMethods)` thay vì hard-code song song — **bắt được 1
bug thật ngay lập tức**: `uelModule.capabilities.scoreConversion` batch 5 để `false` dù đã thêm
công cụ quy đổi ĐGNL→100 thật (`dgnlConversion.ts` + UI) — 2 tầng lệch nhau đúng kiểu rủi ro batch
6 muốn triệt tiêu. `schools/uel/methods.ts` + `schools/uit/methods.ts` mới tạo (batch 5 chỉ có
HCMUT/UEH). `methods.test.ts` khóa chặt: school-level không được nói mạnh hơn method-level, và
test `aggregateSchoolCapabilities` OR-semantics độc lập với dữ liệu thật (mảng rỗng, nhiều method).

`components/MethodCapabilitySummary.tsx` (mới) — đọc thẳng `AdmissionMethodDescriptor.capabilities`,
render ✓/○ theo nhãn tiếng Việt, dùng ở UEH/UEL/UIT (không phải HCMUT — HCMUT chỉ 1 method full
capability, danh sách ✓ toàn bộ không thêm thông tin). Gap cụ thể (○ vì sao) vẫn đọc từ
`knowledgeGaps` riêng của từng trang (không lặp 2 nguồn liệt kê gap).

### UEL research targeted (workstream T) — 1/2 blocker unblocked

Fetch trực tiếp `tuyensinh.uel.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026/` (2026-08-13):

- **Quy tắc giảm điểm ưu tiên: verified** — `(100 – Điểm học lực – Điểm cộng)/25 × Điểm ưu tiên quy
  đổi` khi tổng ≥75/100 (đúng cấu trúc HCMUT: ngưỡng 75, chia 25 — quy định chung quốc gia).
  `schools/uel/priorityReduction.ts` (`calculateUelEffectivePriority`, pure, 5 test) + UI "nâng cao"
  trong `UelExplorerPage.tsx`. `uelAdmissionMethods[0].capabilities.priority`: `false → true`.
- **Bảng điểm cộng ngoại ngữ: vẫn incomplete** — trang chính thức chỉ có 1 ví dụ rời rạc ("IELTS
  5.5 → +3,50"), bảng đầy đủ nằm trong file đính kèm Google Drive PDF không đọc được qua fetch tự
  động; cross-check báo chí (batch 5) nói "IELTS≥5.0 tối đa 5/100" — 2 nguồn không đủ chi tiết,
  không suy đoán các mức còn thiếu. `exactCalculator` TIẾP TỤC `false` — 1/2 blocker chưa đủ để mở
  (spec batch 6: "sai 1 trong 2 vẫn ra điểm cuối sai"). Xem `schools/uel/knowledgeGaps.ts`.

Đây KHÔNG phải "numerical behavior thay đổi của calculator cũ" — `calculateUelEffectivePriority`
là tool MỚI hoàn toàn độc lập (như `dgnlConversion.ts` batch 5), không đụng gì đã verified trước.

### THPT/transcript factual invariants + chặn contamination (workstream I-N)

`core/thptProfile.ts` (mới) — `THPT_SUBJECT_SCORE_RANGE` (0-10, thang quốc gia dùng chung) +
`validateThptScores()` (audit-only, không throw). Dùng được cho CẢ `thpt.scores` lẫn
`transcript.grade10/11/12` (cùng shape `Partial<Record<SubjectId, number>>`, cùng invariant) — không
tạo transcript engine riêng.

**Bug phát hiện khi audit (workstream K)**: `ThptSection.tsx`'s `EnglishCertConverter` — nút "Điền
vào Môn 2/3" gọi THẲNG `onChange` giống hệt user tự gõ điểm thi thật. Điểm quy đổi từ chứng chỉ
quốc tế (vd IELTS 6.5 → 8.5/10 điểm Tiếng Anh THPT) sẽ bị ghi vào `ApplicantProfile.thpt.scores`
như thể đó là điểm thi THPT thật của thí sinh — contamination đúng loại spec batch 6 cảnh báo
("điểm THPT tương đương do trường quy đổi" lẫn vào "điểm thi THPT thật của user").

**Fix**: `ThptSection` tách `onCertificateFill` khỏi `onChange` (2 event riêng, cùng cập nhật form
local — HCMUT vẫn TÍNH điểm bằng giá trị quy đổi này bình thường, trường công nhận quy đổi). HCMUT
page track `certFilledThptFields: { subject2, subject3 }` (set `true` khi bấm nút quy đổi, tự
`false` lại nếu user gõ tay đè lên — coi là điểm thật lại). Mapper
(`buildApplicantProfileFromHcmutForm`) nhận thêm `thptNonFactualSubjectIds?: SubjectId[]` — field
nào trong danh sách này bị LOẠI khỏi `profile.thpt.scores` trước khi ghi (transcript không bị ảnh
hưởng — quy đổi chứng chỉ chỉ áp cho điểm thi THPT). Regression test:
`applicantProfileMapper.test.ts` mục "thptNonFactualSubjectIds".

**Chưa làm (có chủ đích)**: KHÔNG ghi điểm cert-derived vào `ApplicantProfile.certificates.ielts`
(dù field đã tồn tại từ batch 3/4) — cần map 5 loại chứng chỉ UI hỗ trợ (IELTS/PTE/TOEFL
iBT/TOEFL iBT 2026/TOEIC) sang 3 field schema hiện có (ielts/toeflIbt/toeic, thiếu pte/toeflIbt2026),
và UI hiện chọn "mức đạt" theo range hiển thị (vd "≥ 8.0") không phải số band chính xác — quyết
định KHÔNG đoán/làm tròn ép để lấp khoảng trống, chỉ fix phần chắc chắn đúng (chặn contamination).
Chưa có consumer nào đọc `certificates.*` nên không mất giá trị thực tế nào.

### Cross-school THPT reuse — CHƯA implement (có chủ đích)

Workstream M cân nhắc UEH/UEL đọc `ApplicantProfile.thpt.scores` (cả 2 công thức đều dùng "THPT
quy đổi thang 100 = tổng 3 môn tổ hợp × 100/30"). KHÔNG implement trong batch này: cần thêm UI
chọn tổ hợp môn (giống `HcmutSubjectContext`) cho UEH/UEL — 2 trang mới, độ phức tạp tương đương
công việc batch 4 đã làm cho HCMUT, rủi ro làm batch phình to mà không xong dứt điểm phần capability
model (ưu tiên #1 theo yêu cầu batch 6). V-ACT vẫn là field factual DUY NHẤT thật sự dùng chung
runtime giữa 3 trường ở batch này — ghi rõ để không nhầm là đã làm.

### Landing: hồ sơ dùng chung hiển thị + xóa được (workstream O/P/Q/R)

`core/applicantProfileSummary.ts` — `summarizeApplicantProfile(profile)` pure, trả `hasData` +
`vactTotal`/`thptSubjectCount`/`transcriptSubjectCount` (đếm theo union 3 năm học bạ, không cộng
dồn trùng). `LandingPage.tsx` hiện banner "Đã lưu hồ sơ điểm dùng chung" CHỈ khi `hasData` true
(im lặng hoàn toàn nếu rỗng — không hint giả) + nút "Xóa hồ sơ đã lưu" (`window.confirm`, không
custom modal) gọi `clearProfile()` (mới, `ApplicantProfileContext`) — set `profile = {}`, KHÔNG
đụng localStorage/state riêng từng trường (phân biệt rõ với "Đặt lại form HCMUT").

`components/SharedProfileNotice.tsx` (mới) — wording thống nhất "Điểm này được lưu trong hồ sơ dùng
chung và có thể được dùng lại ở trường khác", thay 2 đoạn text gần giống nhau ở UEH/UEL batch 5,
thêm 1 chỗ ở HCMUT (chỉ dưới `DgnlSection` khi đang ghi profile — 1 notice/section, không spam).

### Lint 0 warning (workstream X)

`core/ApplicantProfileContext.tsx` từng export cả component (`ApplicantProfileProvider`) lẫn hook
(`useApplicantProfile`) → oxlint `react(only-export-components)` (mất fast-refresh). Tách
`core/applicantProfileContextCore.ts` (context object + type + hook, KHÔNG export component nào) —
`ApplicantProfileContext.tsx` giờ chỉ export `ApplicantProfileProvider`. 4 file import
`useApplicantProfile` đổi sang path mới. Lint sạch 0 warning (từ 1 warning batch 4/5).

## Batch 5 (2026-08-13) — ApplicantProfile consistency + trường thứ 3 (UEL)

### Vấn đề phát hiện sau batch 4

Batch 4 để HCMUT ghi `exams.vact.components` và UEH ghi `exams.vact.total` độc lập, chính sách
"last active editor wins" ngầm định (xem "UEH đọc + ghi ngược" ở batch 4 bên dưới). Hệ quả: profile
có thể tự mâu thuẫn — `components` sum ra 980 nhưng `total` là 1050 — mà không có cách nào biết cái
nào còn đúng. Batch 5 thay bằng model + policy rõ ràng.

### `core/vactProfile.ts` — input provenance + reconciliation policy

`VactValueSource` (`user-components-input` / `derived-from-components` / `user-total-input` /
`legacy-import` / `unknown`) gắn vào `ApplicantProfile.exams.vact.totalSource`/`.componentsSource`
— biết một con số đến từ đâu, KHÔNG phải "vì sao UniscoreVN tin một rule tuyển sinh" (đó là
`RuleEvidence`, `core/evidence.ts` — 2 khái niệm tách biệt có chủ đích, không dùng chung type: input
provenance mô tả nguồn gốc SỐ NGƯỜI DÙNG NHẬP, rule evidence mô tả nguồn gốc một HẰNG SỐ/QUY TẮC
tuyển sinh mà UniscoreVN code hóa).

3 hàm pure trung tâm (test ở `vactProfile.test.ts`):

```text
reconcileVactFromComponents(current, components)
  → INVARIANT 1: đủ 4 phần → total = sum(components), totalSource = derived-from-components
  → chưa đủ 4 phần → không suy đoán, giữ total/totalSource cũ

reconcileVactFromTotal(current, total, source)
  → có components VÀ sum(components) === total → giữ components (không phải xung đột thật)
  → có components VÀ sum(components) !== total → XÓA components (INVARIANT 2/3 — không giữ 2 fact
    mâu thuẫn), giữ total mới, trả componentsCleared: true để UI hiện rõ

validateVactProfile(vact)
  → range check (INVARIANT 5, dùng chung VACT_COMPONENT_RANGE/VACT_TOTAL_RANGE — không duplicate
    con số 300/1200 theo từng trường) + audit-only conflict check, không throw
```

Chính sách chọn (theo yêu cầu batch 5 "ưu tiên clear conflicting data hơn stale-state phức tạp"):
**components là source cụ thể hơn nên luôn thắng khi đủ 4 phần; total nhập tay chỉ thắng khi không
còn components hợp lệ tương ứng.** Không bao giờ tự phân bổ total vào 4 phần, không bao giờ tự suy
components từ total (INVARIANT 4 ngầm — 2 hướng suy diễn này đều bị cấm rõ trong spec batch 5).

### Mutation centralized qua `ApplicantProfileContext`

`updateVactComponents(components)`/`updateVactTotal(total, source)` (mới, `core/
ApplicantProfileContext.tsx`) — 2 hàm DUY NHẤT được phép sửa `exams.vact`, cả 2 gọi thẳng
`reconcileVactFromComponents`/`reconcileVactFromTotal` bên trong. `updateVactTotal` đọc
`profileRef.current` (ref đồng bộ theo `profile` qua effect) thay vì đọc từ closure `profile` trực
tiếp — cần trả `componentsCleared` NGAY cho caller (để UI hiện thông báo), không thể chờ vào bên
trong `setProfile` updater (updater không đảm bảo chạy đồng bộ trước khi hàm gọi return).
`schools/ueh/UehExplorerPage.tsx` và `schools/uel/UelExplorerPage.tsx` đều gọi qua context này —
KHÔNG còn nơi nào tự `{...current, exams: {...current.exams, vact: {...}}}` rời rạc bypass policy.

### Fix race: mount không được âm thầm ghi đè fact mới hơn (workstream H/I)

**Bug phát hiện**: `HcmutCalculatorPage.tsx` batch 4 có effect đồng bộ profile chạy bất cứ khi nào
`hasCoreInput` true — kể cả lần đầu mount, khi form hydrate từ `localStorage` CÓ THỂ đã cũ hơn
profile hiện tại (vd UEH vừa sửa `total` sau lần cuối user rời `/hcmut`). Mount đơn thuần sẽ ghi đè
fact mới bằng dữ liệu cũ, dù user chưa chạm gì.

**Fix**: 2 cờ `hasUserEditedDgnlFields`/`hasUserEditedAcademicFields` (state, KHÔNG phải ref/effect-
timing trick — tránh phụ thuộc thứ tự effect hay StrictMode double-invoke). Chỉ bật `true` bên
trong đúng handler tương ứng (`handleDgnlChange`/`handleDgnlModeChange`/`handleDgnlTotalChange` →
dgnl; `handleThptChange`/`handleTranscriptChange`/`handleSubjectContextChange` → academic). Effect
đồng bộ chỉ ghi phần user THẬT SỰ vừa sửa (sửa THPT không kéo theo ghi đè ĐGNL bằng giá trị hydrate
cũ, và ngược lại) — `buildApplicantProfileFromHcmutForm` giờ nhận `dgnl`/`thpt`/`transcript` đều
optional, `undefined` = "không đụng tới field này lượt này".

**Ngoại lệ có chủ đích**: link chia sẻ (`?dg_v=...`) là "hydration source rõ ràng" (user chủ động mở
link mang số thật) — 2 cờ trên khởi tạo `true` ngay nếu `window.location.search` có key liên quan
(`dg_v`/`dg_e`/`dg_m`/`dg_s` hoặc `th_m`/`th_2`/`th_3`/`tr10_m`/`tr11_m`/`tr12_m`), để profile đồng
bộ đúng dữ liệu link mang theo mà không bắt user gõ lại 1 field mới tính là "đã sửa".

### UX rõ ràng khi ghi/xung đột (workstream G/J)

`UehExplorerPage.tsx`/`UelExplorerPage.tsx` hiện dòng "Thay đổi điểm này sẽ cập nhật hồ sơ dùng
chung cho các trường khác" khi đang ở chế độ nhập tay, và thông báo cảnh báo (không phải modal) khi
`updateVactTotal` trả `componentsCleared: true`: "Tổng điểm mới không khớp với điểm thành phần ĐGNL
đã lưu trước đó. Các điểm thành phần cũ đã được xóa khỏi hồ sơ dùng chung." Không dùng thuật ngữ
`invariant`/`source-of-truth`/`reconcile` trong UI (theo đúng yêu cầu batch 5) — chỉ "hồ sơ dùng
chung"/"điểm thành phần"/"tổng điểm"/"không còn khớp".

### Storage repair cho profile cũ (workstream L)

`applicantProfileStorage.ts` — `repairApplicantProfile()` chạy mỗi lần `loadApplicantProfile()`:
nếu phát hiện `total` != `sum(components)` (dữ liệu ghi từ batch 4, trước khi có reconcile*, không
có source/timestamp để biết cái nào mới hơn), áp CÙNG chính sách với `reconcileVactFromTotal` khi
conflict — giữ `total`, xóa `components`, gắn `totalSource: 'legacy-import'`. Không đoán, không
throw, không tạo policy migration riêng (nhất quán 1 chính sách duy nhất cho mọi loại conflict, dù
xuất hiện từ đâu).

### Trường thứ 3: UEL (workstream N/O)

Chọn UEL thay vì UIT vì UEL đã có công thức quy đổi ĐGNL→thang 100 ĐẦY ĐỦ và ĐƠN GIẢN (`raw ×
100/1200`, không cần bảng nội suy 12 khoảng như UEH) — semantics rõ nhất trong 2 ứng viên. Thêm
`schools/uel/applicantProfileAdapter.ts` (`buildUelEvaluationInput`, đọc `exams.vact.total`, giống
hệt UEH — không đọc `components`) + `schools/uel/dgnlConversion.ts` (`convertDgnlToScale100`, dùng
chung `VACT_TOTAL_RANGE` từ `core/vactProfile.ts` thay vì tự định nghĩa 0-1200 riêng). UI mới trong
`UelExplorerPage.tsx` ("Quy đổi điểm ĐGNL-HCM → thang 100") — cùng pattern hiển thị/ghi ngược với
UEH: ưu tiên số có sẵn trong hồ sơ, cho phép "Thay đổi", ghi ngược qua `updateVactTotal`.

**Bằng chứng "không phải special case 2 trường"**: `applicantProfile.threeSchool.test.ts` — CÙNG 1
`ApplicantProfile`, HCMUT ghi qua mapper thật, UEH và UEL đều đọc lại đúng `total` qua adapter thật
của chính mình, không nhập lại, không có bước "giả lập" nào. Chưa mở exact calculator UEL (vẫn thiếu
bảng điểm cộng ngoại ngữ + quy tắc giảm ưu tiên, không đổi ở batch 5) — chỉ dùng công thức quy đổi
ĐÃ verified.

### Numerical behavior

KHÔNG thay đổi bất kỳ công thức/kết quả đã verified nào. `reconcileVactFromComponents` tính
`total = sum(components)` — CÙNG công thức batch 4 đã dùng (`vietnamese + english + math +
scientificThinking`, không nhân hệ số), chỉ chuyển vào 1 hàm pure dùng chung thay vì tính rời rạc
trong mapper. 237 test (204 batch 4 + mới) đều pass, không sửa expect nào của batch trước.

## Batch 4 (2026-08-13) — ApplicantProfile thành runtime factual profile thật

### 3 tầng state — phân biệt bắt buộc

```text
1. ApplicantProfile          = factual data CHÉO trường (core/applicantProfile.ts). Chỉ điểm gốc
                                (THPT/học bạ theo SubjectId, ĐGNL thô). KHÔNG BAO GIỜ chứa điểm đã
                                qua công thức riêng trường nào (normalizedScore, weightedScore,
                                academic.score, finalScore, bonus/priority received...).
2. School UI/context state   = lựa chọn riêng UI một trường (HcmutSubjectContext, applicantType,
                                dgnlMode, program đã chọn...) — sống trong state cục bộ của trang
                                trường đó, KHÔNG chia sẻ chéo trường.
3. AdmissionEvaluation       = kết quả ĐÃ TÍNH của một trường/phương thức cụ thể (HcmutAdmissionEvaluation,
                                UEH partial evaluation) — luôn derive lại được từ (1)+(2), không
                                bao giờ ghi ngược vào (1).
```

### Luồng dữ liệu chéo trường

```text
HCMUT form (raw scores + HcmutSubjectContext)
      │
      ├──────────────────────────────┐
      ▼                               ▼
evaluateHcmutAdmission(...)    buildApplicantProfileFromHcmutForm(...)
(đường tính điểm HIỆN TẠI,      (ghi "shadow" — chỉ factual, xem "Vì sao
KHÔNG đổi, đã parity-test)       tách 2 đường" bên dưới)
      │                               │
      ▼                               ▼
HcmutAdmissionEvaluation      ApplicantProfileContext (React Context,
(hiển thị ở HCMUT)             mount 1 lần ở App.tsx + localStorage
                                `uniscore:applicant-profile:v1`)
                                       │
                                       ▼
                          buildUehEvaluationInput(profile, ...)
                                       │
                                       ▼
                          evaluateUehAdmission(...) → 'partial'
                          (hiển thị ở UEH — KHÔNG BAO GIỜ ghi finalScore giả)
```

**Vì sao tách 2 đường (evaluate không đi qua profile+adapter)**: `buildHcmutAdmissionInput`
(batch 2) cố tình `throw` khi thiếu field — đúng cho use case "đã có đủ profile", nhưng form
realtime cần tolerate input rỗng ở MỌI thời điểm khi đang gõ. Ép cả 2 dùng chung 1 đường sẽ phải
hy sinh 1 trong 2 tính chất đó. Quyết định: giữ `evaluate()` đọc thẳng form state (đã parity-test
kỹ ở batch 3, không đổi), còn `ApplicantProfile` được đồng bộ MỘT CHIỀU form → profile mỗi khi
`hasCoreInput` true (không đợi form hoàn chỉnh 100%, nhưng không ghi khi rỗng hoàn toàn).

### Phát hiện quan trọng: `exams.vact.total` và `exams.vact.components` CÙNG một fact

Batch 3 giả định 2 field này "không có conversion an toàn giữa nhau" nên để trống `.total` khi
build từ HCMUT. Batch 4 audit lại kỹ hơn (đọc `docs/admission-research-2026.md`) và phát hiện:
điểm ĐGNL ĐHQG-HCM có thang RAW chính thức là **0-1200** — đúng bằng tổng 4 phần thi của HCMUT
KHÔNG nhân hệ số Toán×2 (4 × 300 = 1200). Cùng thang này được UEL ("X = raw × 100/1200") và FTU
("ngưỡng 850/1200") xác nhận độc lập. Vì vậy `schools/hcmut/applicantProfileMapper.ts` giờ tính
`total = vietnamese + english + math + scientificThinking` (KHÔNG nhân hệ số — khác hẳn
`weightedScore` HCMUT dùng nội bộ, thang 1500) và ghi thẳng vào `exams.vact.total`. Đây KHÔNG phải
suy diễn/quy đổi mới — là cùng một con số, hai cách trường công bố.

### Subject identity (workstream B/C/D/E)

Form HCMUT trước batch 4 chỉ có field trung tính "Môn 2"/"Môn 3" — không đủ để map sang
`ApplicantProfile.thpt.scores[SubjectId]`. Batch 4 thêm `HcmutSubjectContext` (`subject2`/
`subject3: SubjectId | null`, optional, chọn 1 lần dùng chung cho cả Học bạ + Thi THPT ở
`TranscriptSection.tsx`) + serialize vào URL (`sj2`/`sj3`, optional, không có trong link cũ) +
localStorage riêng (`uniscore:hcmut:subject-context:v1`, không có legacy key). Chưa chọn vẫn tính
điểm bình thường — chỉ cần khi muốn ghi `ApplicantProfile.thpt`/`.transcript`.

### Runtime ownership

`ApplicantProfileProvider` (`core/ApplicantProfileContext.tsx`) mount ở `App.tsx`, NGOÀI router —
không unmount khi chuyển `/hcmut` ↔ `/ueh` (khác state cục bộ của từng trang), nên factual profile
sống suốt phiên SPA. Persist qua `localStorage` (`uniscore:applicant-profile:v1`) để refresh trang
không mất. `updateProfile` dùng `useCallback` rỗng deps (không phụ thuộc `profile`) — quan trọng để
tránh effect loop ở nơi gọi (nếu không, mỗi lần profile đổi sẽ tạo `updateProfile` mới → effect nào
list nó trong deps sẽ refire vô hạn).

### UEH đọc + ghi ngược (workstream K/L)

`UehExplorerPage.tsx` ưu tiên dùng `profile.exams.vact.total` nếu có ("Đã dùng điểm ĐGNL từ hồ sơ
của bạn: X — [Thay đổi]"), không bắt nhập lại. User bấm "Thay đổi" + tự nhập số khác → ghi NGƯỢC
đúng con số thô đó vào profile (KHÔNG BAO GIỜ ghi `dgnlResult`/điểm THPT đã quy đổi — đó là kết quả
riêng UEH tính, không phải fact chung). Nếu sau đó user quay lại HCMUT và sửa form, HCMUT's mapper
sẽ tính lại `total` từ components của chính nó và ghi đè — "last active editor wins" trên cùng 1
fact, chấp nhận được vì cả 2 đang mô tả đúng 1 con số thật.

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

- **`evaluate()` KHÔNG đi qua `ApplicantProfile`+`buildHcmutAdmissionInput`** — chỉ ghi shadow một
  chiều (form → profile). Lý do kỹ thuật (throw-on-missing vs tolerance realtime) xem mục "Vì sao
  tách 2 đường" ở trên. `buildHcmutAdmissionInput` (batch 2) vẫn dùng đúng khi có combination thật
  qua `COMMON_SUBJECT_COMBINATIONS` (test ở `applicantProfileAdapter.test.ts` +
  `applicantProfile.crossSchool.test.ts`).
- **UEH chưa dùng `evaluateUehAdmission`/`HcmutAdmissionEvaluation`-style contract trong UI** —
  `UehExplorerPage.tsx` (batch 4) đã đọc/ghi `ApplicantProfile` trực tiếp qua
  `buildUehEvaluationInput` cho phần input, nhưng phần hiển thị kết quả vẫn gọi thẳng
  `convertDgnlToThpt`/`checkUehThreshold` (đủ đơn giản, chưa cần lớp evaluation đầy đủ).
- ~~UEH ghi ngược `exams.vact.total` khi user "Thay đổi" nhưng KHÔNG có UI xác nhận rõ ràng~~ — đã
  fix ở batch 5 (xem mục "UX rõ ràng khi ghi/xung đột" bên trên): có dòng thông báo cập nhật hồ sơ
  dùng chung + cảnh báo khi components bị xóa do xung đột.
- **Subject taxonomy chưa áp cho toàn bộ tổ hợp VN** — chỉ 4 tổ hợp phổ biến (A00/A01/B00/D01) +
  chọn tự do từng môn qua `HcmutSubjectContext`, đủ cho use case hiện tại.
- **`KnowledgeStatus` mới áp dụng cho UIT + UEH** — HCMUS/USSH provisional/conflicting-sources
  (nếu có) chưa migrate vì docs hiện tại chưa có case cụ thể đủ rõ để gán state mà không suy đoán.
- **Landing page chưa có hint "đã lưu hồ sơ điểm"** (workstream Q, batch 4) — cố tình bỏ qua để ưu
  tiên cross-school functionality theo đúng chỉ dẫn batch 4 ("nếu feature làm scope tăng, bỏ").
