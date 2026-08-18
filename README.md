# UniscoreVN

Tính & mô phỏng điểm xét tuyển đại học

- **Live**: https://uniscorevn.vercel.app _(canonical, Batch 7 — domain cũ `https://diemvao.vercel.app` từ Phase 13 hiện redirect 307 sang domain này, chỉ còn giá trị legacy reference)_
- **GitHub**: https://github.com/shadowhunter67/uniscorevn _(đổi tên từ `uniscore` 2026-08-18, đồng bộ brand — xem CLAUDE.md Batch 7 cho lý do trước đó chưa đổi)_
- **Issues**: https://github.com/shadowhunter67/uniscorevn/issues

UniScoreVN separates official/current data, historical references, and rules that are still awaiting verification. A source can be official but superseded; a previous-year cutoff can still be a valid historical reference; a missing current-year cutoff remains `unknown` unless there is explicit `not-published` evidence.

Mỗi rule quan trọng được nối tới nguồn dữ liệu cụ thể, và audit CI kiểm tra source/rule lifecycle trước deploy.

Maintainers can run the offline data-health check before deploy:

```bash
npm run audit:data
```

## Giới thiệu

UniscoreVN (rebrand từ **Uniscore**, Batch 7 — trước đó nữa là **DiemVao** ở Phase 13) là công cụ tính điểm xét tuyển đại học, chạy hoàn toàn phía client (không backend, không database, không đăng nhập), realtime khi người dùng nhập điểm gốc. Ngoài tính điểm, UniscoreVN còn hỗ trợ đặt mục tiêu điểm số, mô phỏng kịch bản, và so sánh với điểm chuẩn tham khảo của các năm trước.

UniscoreVN **không** dự đoán chắc chắn đậu hay đảm bảo trúng tuyển — mọi kết quả so sánh với điểm chuẩn chỉ mang tính tham khảo.

## Trường đang hỗ trợ

- **HCMUT** — Trường Đại học Bách khoa – ĐHQG TP.HCM, phương thức Xét tuyển Tổng hợp 2026 — **exact calculator đầy đủ** (`status: 'supported'`)
- **UEH** — Trường Đại học Kinh tế TP.HCM (ngoài ĐHQG-HCM) — **exact calculator** (`status: 'supported'`, re-audit 2026-08-13) cho Đối tượng 1 (thí sinh tốt nghiệp THPT Việt Nam): trang thông tin, điểm chuẩn 97 chương trình, bảng quy đổi ĐGNL→THPT, điểm cộng/ưu tiên đầy đủ (đọc lại ĐGNL từ hồ sơ điểm dùng chung, không cần nhập lại) — Đối tượng 2 (THPT nước ngoài) chưa nằm trong scope vì cấu trúc học bạ khác chưa implement
- **UEL** — Trường Đại học Kinh tế - Luật – ĐHQG TP.HCM — **exact calculator đầy đủ cả 3 đối tượng (DT1/DT2/DT3)** (`status: 'supported'`): điểm chuẩn 38 ngành, ngưỡng đầu vào, công thức β1/β2/β3 (ĐGNL/THPT/học bạ), bảng điểm cộng chứng chỉ ngoại ngữ (re-audit 2026-08-15 — bảng công khai lộ ra trên trang "Tổ hợp tuyển sinh" HTML chính thức, không còn phụ thuộc file Google Drive view-only như trước), quy tắc giảm điểm ưu tiên khi tổng điểm cao, đều verified và có golden/domain conformance test
- **UIT** — Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM — trang thông tin, bonus/eligibility checker, điểm chuẩn 19 ngành 2026 thật, **chưa có exact calculator** (thiếu bảng bách phân vị, `status: 'researching'`)
- **HCMUS** — Trường Đại học Khoa học Tự nhiên – ĐHQG TP.HCM — **exact calculator đầy đủ** (`status: 'supported'`, phương thức Xét tuyển Tổng hợp/Phương thức 2): điểm học lực MAX(THPT/ĐGNL kết hợp học bạ), bảng điểm cộng, điểm ưu tiên khu vực/đối tượng (nguồn `cross-checked` với bảng chuẩn quốc gia, chưa tìm được trang HCMUS công bố trực tiếp — xem `schools/hcmus/evidence.ts`), golden/domain conformance test
- **USSH** — Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM — **exact calculator** (`status: 'supported'`) trong phạm vi thí sinh **không có thành tích cộng điểm** (ĐHL1/ĐHL2/ĐHL3), công thức verified 2 nguồn độc lập (PDF chính thức + thông báo)
- **IU** — Trường Đại học Quốc tế – ĐHQG TP.HCM — **exact calculator** (`status: 'supported'`) trong phạm vi đối tượng "Thí sinh tốt nghiệp THPT 2026", đủ trọng số học lực/điểm cộng/điểm ưu tiên + quy tắc giảm điểm ưu tiên verified
- **UHS** — Trường Đại học Khoa học Sức khỏe – ĐHQG TP.HCM — eligibility + quy đổi thang điểm + bonus + điểm ưu tiên đã verified cho 6 nhóm ngành (Y khoa/Dược/Răng-Hàm-Mặt/Điều dưỡng/Y học cổ truyền...), **chưa có exact calculator** (thiếu khoảng hệ số w1/w2 cố định — `status: 'researching'`)
- **AGU** — Trường Đại học An Giang – ĐHQG TP.HCM — eligibility (ngưỡng THPT/ĐGNL theo 43 ngành + điều kiện riêng ngành Luật) + hệ số β1/β2/β3 chính thức, **chưa có scoreConversion/bonus/priority/exact calculator** (`status: 'researching'`)
- **HCMUE** — Trường Đại học Sư phạm TP.HCM — đã tích hợp kiểm tra ngưỡng đầu vào 47 ngành tại trụ sở chính TP.HCM từ nguồn tuyển sinh chính thức 2026; chưa tính điểm trúng tuyển cuối và không gắn ngưỡng đầu vào là điểm chuẩn (`status: 'researching'`)
- **HCMUTE** — Trường Đại học Công nghệ Kỹ thuật TP.HCM (ngoài ĐHQG-HCM, thêm batch 2026-08-18, re-audit + expansion cùng ngày) — eligibility (ngưỡng chung 15/30 + ngưỡng riêng SP tiếng Anh/SP công nghệ/Luật đã wire theo `programId`), bảng điểm ưu tiên khu vực/đối tượng + công thức giảm, điểm cộng ĐXTCN (2/4 mục), và điểm học lực HLy.1/HLy.2/HLy.3/HLy.max theo 3 nhóm công thức (chuẩn/Ngôn ngữ Anh+SP tiếng Anh/Kiến trúc-Kiến trúc Nội thất-Thiết kế đồ họa-Thiết kế thời trang, cả 3 nhóm đã wire vào evaluator) đều verified từ văn bản chính thức đã ký (số 1691/ĐHCNKT-ĐT + Thông báo hệ số tương quan a=0,8/b=0,8 số 2092/TB-ĐHCNKT ngày 07/7/2026) — **chưa có exact calculator** (còn 2 blocker: ĐXTT theo nhóm trường THPT chặn nhánh HLy.2 khi thí sinh khai học bạ, ĐXTCN mục 1/4-7 chưa implement — `status: 'researching'`)
- **TDTU** — Trường Đại học Tôn Đức Thắng (ngoài ĐHQG-HCM, trường thứ 12, thêm batch 2026-08-18) — **exact calculator cho cả 2 phương thức** (`exactCalculator: true` method-level): PT1 "Xét tuyển tổng hợp" (thang 100, Đối tượng 1.1 — học sinh lớp 12 tốt nghiệp THPT 2026: Điểm năng lực 75% THPT + 25% học bạ, Điểm cộng = Điểm thưởng+Điểm xét thưởng theo Phụ lục 6/7 đầy đủ, Điểm ưu tiên có quy tắc giảm) và PT2 "Xét theo ĐGNL ĐHQG-HCM" (thang 1200, đọc ĐGNL từ hồ sơ điểm dùng chung) — công thức verified từ trang HTML chính thức (không phải PDF quét) + Phụ lục 5/6/7 (PDF text layer). Danh mục 119 ngành/tổ hợp (Phụ lục 2) và Đối tượng 1.2-1.5 CHƯA import (`status: 'researching'`, chưa có `Page` riêng)
- **HUFLIT** — Trường Đại học Ngoại ngữ - Tin học TP.HCM (ngoài ĐHQG-HCM, trường thứ 13, thêm batch 2026-08-18) — **exact calculator cho cả 3 phương thức** (`exactCalculator: true` method-level, semantics conditional-exact như USSH/IU/TDTU): PT1 (thi THPT, thang 30) và PT2 (học bạ, thang 30) exact trong phạm vi thí sinh **không có thành tích cộng điểm**; PT3 (ĐGNL ĐHQG-HCM, thang 1200) exact toàn bộ (không có thành phần điểm cộng). Công thức PT1/PT2 là tổng thô 3 môn (KHÔNG nhân hệ số môn nào — đơn giản nhất trong 13 trường), ngưỡng đầu vào cả 3 phương thức + ngành Luật/Luật kinh tế riêng đều verified từ Thông báo 09/7/2026 (supersede statement "sẽ công bố sau" của trang 02/4/2026 — cùng lớp regression HCMUTE đã phát hiện). Bảng điểm thưởng/khuyến khích cụ thể đã tìm kỹ nhưng KHÔNG định vị được nguồn — thí sinh có thành tích cộng điểm vẫn `partial`; danh mục 23 ngành/tổ hợp CHƯA import (`status: 'researching'`, chưa có `Page` riêng)
- **HUTECH** — Trường Đại học Công nghệ TP.HCM (ngoài ĐHQG-HCM, trường thứ 14, thêm batch 2026-08-18) — **exact calculator cho 2/4 phương thức** (`exactCalculator: true` method-level, semantics conditional-exact như USSH/IU/TDTU/HUFLIT): xét THPT (thang 30, tổng thô 3 môn) và xét ĐGNL ĐHQG-HCM (thang 1200) exact trong phạm vi thí sinh **không có thành tích cộng điểm**. Ngưỡng đầu vào cả 4 phương thức × 4 nhóm ngành (Y khoa/Dược+Luật/Điều dưỡng+Kỹ thuật xét nghiệm y học/còn lại) verified từ Thông báo 04/7/2026 (KHÔNG còn "sẽ công bố sau"), phân biệt rõ với điểm chuẩn trúng tuyển (nguồn riêng, chỉ tham khảo). Xét học bạ dừng ở `unavailable` — công thức chính thức cần điểm theo 6 học kỳ, hồ sơ điểm dùng chung chỉ lưu TB cả năm (khoảng cách độ chi tiết dữ liệu, không phải thiếu điểm cộng). Xét V-SAT dừng ở eligibility-only — thang điểm/công thức quy đổi V-SAT của HUTECH đọc được từ 2 trang chính thức khác nhau, không nhất quán. Bảng điểm thưởng/khuyến khích cụ thể chưa tìm được nguồn nên thí sinh có thành tích cộng điểm vẫn `partial`; danh mục 63 ngành CHƯA import (`status: 'researching'`, chưa có `Page` riêng)
- **UFM** — Trường Đại học Tài chính – Marketing (ngoài ĐHQG-HCM, trường thứ 15, thêm batch 2026-08-18) — **exact calculator cho 2/4 phương thức** (`exactCalculator: true` method-level, semantics conditional-exact như HUTECH): xét THPT (thang 30, tổng thô 3 môn, phạm vi chương trình **Chuẩn**) và xét ĐGNL ĐHQG-HCM (thang 1200) exact trong phạm vi thí sinh **không có thành tích cộng điểm**. Ngưỡng đầu vào cả 4 phương thức × 2 nhóm ngành (chuẩn/Luật kinh tế — Luật kinh tế có thêm điều kiện Toán≥6 + không môn nào <1) verified từ Thông báo 10/7/2026 (KHÔNG còn "sẽ công bố sau"). Hệ số Toán×2 của chương trình **Tiếng Anh toàn phần** CHƯA implement — 2 nguồn thứ cấp mâu thuẫn nhau về phạm vi áp dụng, không tìm được xác nhận trực tiếp từ UFM. Xét học bạ dừng ở `unavailable` — công thức cần điểm tính đến HK1 lớp 12 (5 học kỳ), hồ sơ dùng chung chỉ lưu TB cả năm, và công thức đọc được mơ hồ giữa các nguồn. Xét V-SAT dừng ở eligibility-only. Bảng điểm cộng/xét thưởng cụ thể chưa tìm được nguồn nên thí sinh có thành tích cộng điểm vẫn `partial`; danh mục ngành/chương trình CHƯA import (`status: 'researching'`, chưa có `Page` riêng)

Tổng cộng 15 trường trong `schoolRegistry`, trong đó **HCMUT/UEH/UEL/HCMUS/USSH/IU/TDTU/HUFLIT/HUTECH/UFM** có `exactCalculator: true` (USSH/IU/TDTU/HUFLIT/HUTECH/UFM giới hạn phạm vi verified, xem trên); **UIT/UHS/AGU/HCMUE/HCMUTE** dừng ở eligibility/partial calculator, chưa đủ nguồn cho exact. Mọi trường (không riêng UEH/UEL/UIT) dùng chung cơ chế "method-level capability" (`core/admissionMethod.ts`,
`AdmissionMethodDescriptor`) làm nguồn sự thật cho từng khả năng (eligibility/quy đổi/điểm cộng/điểm
ưu tiên/exact calculator) — `SchoolModule.capabilities` cấp trường chỉ là tổng hợp (OR) từ đó, không
khai tay riêng lẻ dễ lệch với thực tế.

## Tính năng

- Tính điểm xét tuyển realtime từ điểm ĐGNL, THPT, học bạ, điểm cộng, điểm ưu tiên
- Quy đổi chứng chỉ tiếng Anh quốc tế (IELTS/PTE/TOEFL iBT/TOEIC) sang điểm môn Tiếng Anh thi THPT
- Đặt mục tiêu điểm số, tính ngược ĐGNL cần đạt (binary search)
- Mô phỏng kịch bản điểm ĐGNL giả định
- So sánh với điểm chuẩn tham khảo nhiều ngành, nhiều năm
- So sánh cùng một hồ sơ trên nhiều trường qua `/compare`: exact/partial/unavailable cho từng
  trường, không ép ra điểm cuối nếu thiếu dữ liệu hoặc thiếu nguồn chính thức
- Chia sẻ kết quả qua URL (query params), không cần tài khoản
- Lưu input gần nhất vào localStorage của trình duyệt
- Nhập điểm gốc (ĐGNL/THPT/học bạ) một lần ở HCMUT — UEH/UEL tự đọc lại ĐGNL từ `ApplicantProfile`
  dùng chung (`core/applicantProfile.ts`, runtime qua `ApplicantProfileContext`), không cần nhập lại.
  UEL bắt đầu reuse thật điểm thi THPT theo tổ hợp user chọn (vd A01 đọc Toán/Lý/Anh), chỉ hỏi môn
  còn thiếu và ghi ngược điểm thi raw mới nhập vào hồ sơ dùng chung.
  Hồ sơ dùng chung chỉ chứa **điểm gốc/factual** (ĐGNL thô, điểm thi THPT, điểm học bạ) — KHÔNG bao
  giờ chứa điểm đã quy đổi/điểm xét tuyển cuối cùng của riêng một trường. Nếu 2 trường ghi 2 con số
  ĐGNL xung đột nhau, UniscoreVN tự phát hiện và báo rõ thay vì âm thầm giữ cả hai (xem
  `docs/architecture.md` mục Batch 5). Trang chủ tự hiện khi đã có hồ sơ lưu sẵn, kèm nút xóa nếu
  muốn bắt đầu lại
- Mỗi trang trường hiện rõ "phương thức đang hỗ trợ tính được đến đâu" (điều kiện/quy đổi/điểm
  cộng/điểm ưu tiên/điểm cuối) thay vì chỉ nói chung "đang bổ sung dữ liệu"

## Kiến trúc multi-school

UniscoreVN hỗ trợ nhiều trường (xem "Trường đang hỗ trợ" ở trên), kiến trúc được chuẩn bị để thêm trường mới mà không phải đập lại toàn bộ codebase:

```text
src/
├── core/
│   ├── schoolModule.ts          # SchoolModule contract + SchoolStatus/SchoolCapabilities
│   ├── admissionMethod.ts       # AdmissionMethodDescriptor — method-level capability (source of truth)
│   ├── applicantProfile.ts      # Shared factual profile type (ĐGNL/THPT/học bạ thô, không có điểm quy đổi)
│   ├── applicantProfileStorage.ts / storage.ts   # Persist + migration (uniscorevn:* namespace)
│   └── round2, validateRange, ...                # Thật sự generic, không thuộc trường nào
├── schools/
│   ├── index.ts    # schoolRegistry
│   ├── hcmut/      # Exact calculator — xem "HCMUT module" bên dưới
│   ├── ueh/        # Explorer — đọc ApplicantProfile qua applicantProfileAdapter.ts
│   └── uel/        # Explorer — đọc ApplicantProfile qua applicantProfileAdapter.ts
├── config/
│   └── site.ts     # Brand: tên, slug, canonicalUrl, tagline, description
├── components/      # UI dùng chung (bao gồm ApplicantProfileContext runtime), không chứa business logic riêng trường nào
├── compare/         # Orchestrator/presentation adapter cho /compare, không chứa công thức trường
└── App.tsx
```

Nguyên tắc:

- Logic/công thức riêng của một trường nằm trong `schools/<id>/`, không tràn ra `components/` hay `core/`.
- Mỗi trường có input schema, thang điểm, phương thức xét tuyển riêng — **không** ép về một "universal formula engine". `SchoolModule` (`src/core/schoolModule.ts`) chỉ chứa thông tin định danh (id, tên, năm, status) để đăng ký vào `schoolRegistry`, không ép `calculate()` chung chữ ký.
- Khả năng thật của từng phương thức xét tuyển (eligibility/quy đổi/điểm cộng/điểm ưu tiên/exact calculator) khai báo qua `AdmissionMethodDescriptor` (`core/admissionMethod.ts`) — đây là **nguồn sự thật** ở các trường đã migrate sang cơ chế này (UEH/UEL/UIT); `SchoolModule.capabilities` cấp trường chỉ derive (OR) từ đó qua `aggregateSchoolCapabilities`, tránh khai tay 2 nơi dễ lệch nhau.
- Trường nào cần đọc lại điểm gốc đã nhập ở trường khác thì tự viết `applicantProfileAdapter.ts` đọc `ApplicantProfile` (`core/applicantProfile.ts`) qua `useApplicantProfile()` — hồ sơ này chỉ chứa dữ liệu factual dùng chung nhiều trường, không phải kết quả tính của riêng trường nào. Context riêng của trường (vd UEL chọn tổ hợp A01) nằm ở page/adapter của trường, không ghi vào profile.
- `/compare` lặp qua `schoolComparisonAdapters` (`src/compare/comparisonRegistry.ts`) rồi render
  `AdmissionEvaluation` dưới dạng card — mỗi trường implement đúng 1
  `SchoolComparisonAdapter` (`src/compare/schoolComparisonAdapter.ts`, ở
  `schools/<id>/comparison.ts`) thay vì có 1 chuỗi `if (schoolId === ...)` trong orchestrator. Đây
  là lớp orchestration/presentation, **không** phải universal formula engine, không normalize tất
  cả trường về một thang chung và không so cutoff nếu scale/ngữ cảnh không comparable. Xem
  "Thêm trường mới" bên dưới.
- Thêm trường mới = tạo `schools/<id>/` theo cấu trúc tương tự + thêm 1 dòng vào `schoolRegistry` (`src/schools/index.ts`). Route dạng `/hcmut`, `/uit` xử lý bởi `src/hooks/useRoute.ts` (hand-rolled, không thêm router lib). Muốn trường đó tham gia `/compare` thì thêm bước thứ 2: tạo `schools/<id>/comparison.ts` export 1 `SchoolComparisonAdapter` (`buildContext` map `ComparisonSelection` generic → context riêng trường; `evaluate` gọi `evaluate.ts` sẵn có + optionally `withProgramCutoffComparison` nếu trường có cutoff data) rồi thêm 1 dòng vào `schoolComparisonAdapters` (`src/compare/comparisonRegistry.ts`). `comparisonRegistry.test.ts` fail ngay nếu 1 trong 2 bước bị quên (school có module nhưng thiếu adapter, hoặc ngược lại) — không còn cách nào "implement rồi quên nối 1 nơi" lọt qua CI.

## HCMUT module

Toàn bộ phần đặc thù HCMUT nằm trong `src/schools/hcmut/`:

```text
schools/hcmut/
├── config/admission-2026.ts     # Trọng số + tham số công thức 2026
├── calculator/
│   ├── calculator.ts            # Engine tính điểm — pure function, không phụ thuộc React
│   └── targetCalculator.ts      # Tính ngược ĐGNL cần đạt (binary search) + scenario simulator
├── data/
│   ├── programs.ts               # 29 ngành/chương trình
│   ├── cutoffs.ts                # Điểm chuẩn tham khảo, có sourceLabel/sourceUrl/accessedAt
│   └── validateDataset.ts        # Kiểm tra toàn vẹn dataset (dev/test)
├── types/                         # admission.ts, form.ts, programs.ts
├── programs.ts                    # Helper so sánh ngành / tra cutoff
├── validation.ts                  # Validator riêng schema HCMUT (dựa trên core/rangeValidation)
├── urlState.ts                    # Serialize/parse query params riêng schema HCMUT
└── index.ts                       # export hcmutModule (SchoolModule) để đăng ký registry
```

Để thêm năm tuyển sinh mới cho HCMUT: tạo `schools/hcmut/config/admission-<năm>.ts` theo cùng cấu trúc `AdmissionConfig` rồi trỏ `activeAdmissionConfig` sang file mới — không cần đổi gì trong `calculator.ts`.

### Công thức HCMUT (không đổi khi rebrand)

```text
Điểm gốc (ĐGNL 4 phần thi, THPT 3 môn, học bạ 9 ô điểm 3 năm)
  → chuẩn hóa từng thành phần về thang 100
  → điểm học lực = 70% ĐGNL + 20% THPT + 10% học bạ
  → điểm cộng = thưởng + xét thưởng + khuyến khích (tối đa 10)
  → điểm ưu tiên KV/ĐT quy đổi từ thang 30, giảm dần khi (học lực + điểm cộng) ≥ 75
  → điểm xét tuyển = học lực + điểm cộng + ưu tiên thực nhận (tối đa 100)
```

Chi tiết công thức xem `src/schools/hcmut/calculator/calculator.ts` (pure function, có test ở `calculator.test.ts`).

## Development

```bash
npm install
npm run dev
```

Trên Windows có thể double-click [start-dev.bat](start-dev.bat) — tự `npm install` nếu thiếu `node_modules` rồi chạy `npm run dev`.

## Test

```bash
npm run test
```

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```

## Deploy

Có thể import repository trực tiếp vào Vercel (framework preset: Vite).

## Data sources

Dataset ngành/điểm chuẩn HCMUT (`src/schools/hcmut/data/`) dẫn nguồn báo chí trích công bố chính thức của trường (bảng điểm gốc trên hcmut.edu.vn nhúng dạng ảnh, không fetch trực tiếp được). Mỗi cutoff có `sourceLabel`/`sourceUrl`/`accessedAt`. Bảng quy đổi chứng chỉ tiếng Anh dẫn nguồn hcmut.edu.vn/tintuc/quy-doi-chung-chi-tieng-anh.

## Kiến trúc / model dùng chung

Xem [docs/architecture.md](docs/architecture.md) cho tổng quan các abstraction dùng chung (evidence/
provenance, rounding policy, ApplicantProfile, AdmissionEvaluation, explanation steps...) — không
universal hóa công thức tuyển sinh, mỗi trường vẫn tự tính riêng trong `src/schools/<id>/`.

## Giới hạn hiện tại

- HCMUT/UEH/UEL/HCMUS/USSH/IU có exact calculator wire vào UI (xem badge "Tính điểm chính xác" ở
  từng trang + `docs/architecture.md` mục golden/domain conformance) — USSH/IU chỉ exact trong
  phạm vi verified (USSH: thí sinh không có thành tích cộng điểm; IU: đối tượng "Thí sinh tốt
  nghiệp THPT 2026"). UIT có trang thông tin + eligibility/bonus checker thật nhưng chưa có exact
  calculator (thiếu bảng bách phân vị — xem `docs/admission-research-2026.md`). AGU/UHS/HCMUE có
  trang thông tin/eligibility, chưa đủ nguồn cho exact calculator.
- Dataset ngành/điểm chuẩn HCMUT mới có 29/70+ chương trình; chỉ 4 ngành có đủ 2025+2026 để so sánh lịch sử có ý nghĩa.
- Điểm ưu tiên khu vực/đối tượng có dropdown gợi ý điền nhanh (theo bảng chung Bộ GD&ĐT), nhưng ô nhập tay thang 30 vẫn còn để override.
- Quy đổi chứng chỉ tiếng Anh chỉ áp dụng cho điểm thi THPT, chưa áp dụng cho học bạ.
- Học bạ chưa xử lý trường hợp thí sinh đổi môn trong tổ hợp giữa lớp 10/11/12.
- localStorage dùng namespace `uniscorevn:hcmut:*` (vd `uniscorevn:hcmut:input:v1`) + hồ sơ dùng chung `uniscorevn:applicant-profile:v1` (Batch 7). Khác Phase 13 (đổi brand DiemVao→Uniscore KHÔNG migrate, cố ý phá dữ liệu cũ), lần rebrand Uniscore→UniscoreVN này CÓ migrate tự động — đọc được cả key cũ `uniscore:*` (brand trước) lẫn các đời flat key cũ hơn (`uniscore-*-v1`, `hcmut-score-*`, `hcmut-applicant-type-*`), ưu tiên key mới nếu đã tồn tại. Xem `src/core/storage.ts`, `src/core/applicantProfileStorage.ts`.
- Chưa có: database ngành động, biểu đồ, AI recommendation, xác suất trúng tuyển, login, server, analytics.

## Cutoff comparison safety

`/compare` chỉ tính chênh lệch với điểm chuẩn khi có final exact score cùng context chương
trình/phương thức/thang điểm. Điểm quy đổi partial (vd UIT bách phân vị chưa xác định, UHS thiếu
hệ số w1/w2 cố định — xem `docs/admission-research-2026.md`) không được hiển thị như chênh lệch
trực tiếp với điểm chuẩn trúng tuyển cuối.

## Disclaimer

UniscoreVN là công cụ độc lập, không thuộc các trường đại học được hỗ trợ. Thí sinh nên đối chiếu thông tin tuyển sinh chính thức của từng trường trước khi quyết định.
