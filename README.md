# UniscoreVN

Tính & mô phỏng điểm xét tuyển đại học

- **Live**: https://uniscorevn.vercel.app _(canonical, Batch 7 — domain cũ `https://diemvao.vercel.app` từ Phase 13 hiện redirect 307 sang domain này, chỉ còn giá trị legacy reference)_
- **GitHub**: https://github.com/shadowhunter67/uniscore _(tên repo chưa đổi theo brand mới — external action ngoài phạm vi code, xem CLAUDE.md Batch 7)_
- **Issues**: https://github.com/shadowhunter67/uniscore/issues

UniScoreVN separates official/current data, historical references, and rules that are still awaiting verification. A source can be official but superseded; a previous-year cutoff can still be a valid historical reference; a missing current-year cutoff remains `unknown` unless there is explicit `not-published` evidence.

Maintainers can run the offline data-health check before deploy:

```bash
npm run audit:data
```

## Giới thiệu

UniscoreVN (rebrand từ **Uniscore**, Batch 7 — trước đó nữa là **DiemVao** ở Phase 13) là công cụ tính điểm xét tuyển đại học, chạy hoàn toàn phía client (không backend, không database, không đăng nhập), realtime khi người dùng nhập điểm gốc. Ngoài tính điểm, UniscoreVN còn hỗ trợ đặt mục tiêu điểm số, mô phỏng kịch bản, và so sánh với điểm chuẩn tham khảo của các năm trước.

UniscoreVN **không** dự đoán chắc chắn đậu hay đảm bảo trúng tuyển — mọi kết quả so sánh với điểm chuẩn chỉ mang tính tham khảo.

## Trường đang hỗ trợ

- **HCMUT** — Trường Đại học Bách khoa – ĐHQG TP.HCM, phương thức Xét tuyển Tổng hợp 2026 — **exact calculator đầy đủ** (`status: 'supported'`)
- **UEH** — Trường Đại học Kinh tế TP.HCM (ngoài ĐHQG-HCM) — explorer: trang thông tin, điểm chuẩn 97 chương trình, bảng quy đổi ĐGNL→THPT **đã verified** (đọc lại ĐGNL từ hồ sơ điểm dùng chung, không cần nhập lại), **chưa có exact calculator** (thiếu bước quy đổi cuối sang thang 100 + bảng điểm cộng)
- **UEL** — Trường Đại học Kinh tế - Luật – ĐHQG TP.HCM — explorer: trang thông tin, điểm chuẩn 38 ngành, ngưỡng đầu vào, công cụ quy đổi ĐGNL→thang 100 (đọc từ hồ sơ điểm dùng chung, công thức chính thức verified), reuse điểm thi THPT theo tổ hợp user chọn, công cụ tính điểm ưu tiên giảm dần khi tổng điểm cao, **chưa có exact calculator** (chỉ còn thiếu bảng điểm cộng ngoại ngữ)
- **UIT** — Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM — trang thông tin, bonus/eligibility checker, điểm chuẩn 19 ngành 2026 thật, **chưa có exact calculator** (thiếu bảng bách phân vị)
- **HCMUS, USSH** — đã research công thức (xem `docs/admission-research-2026.md`), chưa implement trang riêng
- **IU, AGU, UHS** — mới khai báo định danh trong registry, research công thức chưa đủ nguồn tin cậy

UEH/UEL/UIT đều dùng chung cơ chế "method-level capability" (`core/admissionMethod.ts`,
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
- `/compare` gọi school evaluator/adapter riêng của HCMUT/UEH/UEL/UIT rồi render `AdmissionEvaluation`
  dưới dạng card. Đây là lớp orchestration/presentation, **không** phải universal formula engine,
  không normalize tất cả trường về một thang chung và không so cutoff nếu scale/ngữ cảnh không comparable.
- Thêm trường mới = tạo `schools/<id>/` theo cấu trúc tương tự + thêm 1 dòng vào `schoolRegistry` (`src/schools/index.ts`). Route dạng `/hcmut`, `/uit` xử lý bởi `src/hooks/useRoute.ts` (hand-rolled, không thêm router lib).

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

- Chỉ HCMUT có exact calculator đầy đủ wire vào UI. UIT/UEL/UEH có trang thông tin + eligibility/
  conversion tool thật nhưng chưa có exact calculator (thiếu công thức nguồn — xem
  `docs/admission-research-2026.md`). HCMUS/USSH/IU/AGU/UHS mới ở mức research/định danh.
- Dataset ngành/điểm chuẩn HCMUT mới có 29/70+ chương trình; chỉ 4 ngành có đủ 2025+2026 để so sánh lịch sử có ý nghĩa.
- Điểm ưu tiên khu vực/đối tượng có dropdown gợi ý điền nhanh (theo bảng chung Bộ GD&ĐT), nhưng ô nhập tay thang 30 vẫn còn để override.
- Quy đổi chứng chỉ tiếng Anh chỉ áp dụng cho điểm thi THPT, chưa áp dụng cho học bạ.
- Học bạ chưa xử lý trường hợp thí sinh đổi môn trong tổ hợp giữa lớp 10/11/12.
- localStorage dùng namespace `uniscorevn:hcmut:*` (vd `uniscorevn:hcmut:input:v1`) + hồ sơ dùng chung `uniscorevn:applicant-profile:v1` (Batch 7). Khác Phase 13 (đổi brand DiemVao→Uniscore KHÔNG migrate, cố ý phá dữ liệu cũ), lần rebrand Uniscore→UniscoreVN này CÓ migrate tự động — đọc được cả key cũ `uniscore:*` (brand trước) lẫn các đời flat key cũ hơn (`uniscore-*-v1`, `hcmut-score-*`, `hcmut-applicant-type-*`), ưu tiên key mới nếu đã tồn tại. Xem `src/core/storage.ts`, `src/core/applicantProfileStorage.ts`.
- Chưa có: database ngành động, biểu đồ, AI recommendation, xác suất trúng tuyển, login, server, analytics.

## Cutoff comparison safety

`/compare` chỉ tính chênh lệch với điểm chuẩn khi có final exact score cùng context chương
trình/phương thức/thang điểm. Điểm quy đổi partial (vd UEH ĐGNL→THPT, UEL ĐGNL/THPT→100) không được
hiển thị như chênh lệch trực tiếp với điểm chuẩn trúng tuyển cuối.

## Disclaimer

UniscoreVN là công cụ độc lập, không thuộc các trường đại học được hỗ trợ. Thí sinh nên đối chiếu thông tin tuyển sinh chính thức của từng trường trước khi quyết định.
