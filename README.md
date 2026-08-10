# Uniscore

Tính & mô phỏng điểm xét tuyển đại học

- **Live**: https://diemvao.vercel.app _(Vercel project vẫn tên nội bộ "diemvao", chưa rename theo brand mới — xem CLAUDE.md Phase 13)_
- **GitHub**: https://github.com/shadowhunter67/uniscore
- **Issues**: https://github.com/shadowhunter67/uniscore/issues

## Giới thiệu

Uniscore là công cụ tính điểm xét tuyển đại học, chạy hoàn toàn phía client (không backend, không database, không đăng nhập), realtime khi người dùng nhập điểm gốc. Ngoài tính điểm, Uniscore còn hỗ trợ đặt mục tiêu điểm số, mô phỏng kịch bản, và so sánh với điểm chuẩn tham khảo của các năm trước.

Uniscore **không** dự đoán chắc chắn đậu hay đảm bảo trúng tuyển — mọi kết quả so sánh với điểm chuẩn chỉ mang tính tham khảo.

## Trường đang hỗ trợ

- **HCMUT** — Trường Đại học Bách khoa – ĐHQG TP.HCM, phương thức Xét tuyển Tổng hợp 2026 (thí sinh có kết quả ĐGNL ĐHQG-HCM 2026)

## Tính năng

- Tính điểm xét tuyển realtime từ điểm ĐGNL, THPT, học bạ, điểm cộng, điểm ưu tiên
- Quy đổi chứng chỉ tiếng Anh quốc tế (IELTS/PTE/TOEFL iBT/TOEIC) sang điểm môn Tiếng Anh thi THPT
- Đặt mục tiêu điểm số, tính ngược ĐGNL cần đạt (binary search)
- Mô phỏng kịch bản điểm ĐGNL giả định
- So sánh với điểm chuẩn tham khảo nhiều ngành, nhiều năm
- Chia sẻ kết quả qua URL (query params), không cần tài khoản
- Lưu input gần nhất vào localStorage của trình duyệt

## Kiến trúc multi-school

Uniscore hiện chỉ có một trường (HCMUT), nhưng kiến trúc được chuẩn bị để thêm trường mới mà không phải đập lại toàn bộ codebase:

```text
src/
├── core/           # Thật sự generic: round2, validateRange, SchoolModule contract
├── schools/
│   ├── index.ts    # schoolRegistry + activeSchoolId
│   └── hcmut/      # Module trường đầu tiên — xem "HCMUT module" bên dưới
├── config/
│   └── site.ts     # Brand: tên, tagline, description
├── components/      # UI dùng chung, không chứa business logic riêng trường nào
└── App.tsx
```

Nguyên tắc:

- Logic/công thức riêng của một trường nằm trong `schools/<id>/`, không tràn ra `components/` hay `core/`.
- Mỗi trường có input schema, thang điểm, phương thức xét tuyển riêng — **không** ép về một "universal formula engine". `SchoolModule` (`src/core/schoolModule.ts`) chỉ chứa thông tin định danh (id, tên, năm) để đăng ký vào `schoolRegistry`, không ép `calculate()` chung chữ ký.
- Thêm trường thứ hai (ví dụ UIT) = tạo `schools/uit/` theo cấu trúc tương tự + thêm 1 dòng vào `schoolRegistry` (`src/schools/index.ts`). Chưa cần React Router — khi có ≥2 trường mới cần tính đến URL dạng `/hcmut`, `/uit`.

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

## Giới hạn hiện tại

- Kiến trúc multi-school mới chuẩn bị sẵn, **chưa** implement UIT/HCMUS/UEL hay trường nào khác ngoài HCMUT.
- Dataset ngành/điểm chuẩn HCMUT mới có 29/70+ chương trình; chỉ 4 ngành có đủ 2025+2026 để so sánh lịch sử có ý nghĩa.
- Điểm ưu tiên khu vực/đối tượng có dropdown gợi ý điền nhanh (theo bảng chung Bộ GD&ĐT), nhưng ô nhập tay thang 30 vẫn còn để override.
- Quy đổi chứng chỉ tiếng Anh chỉ áp dụng cho điểm thi THPT, chưa áp dụng cho học bạ.
- Học bạ chưa xử lý trường hợp thí sinh đổi môn trong tổ hợp giữa lớp 10/11/12.
- localStorage dùng key `uniscore-input-v1` + `uniscore-target-v1` + `uniscore-program-v1` + `uniscore-dgnl-mode-v1` + `uniscore-applicant-type-v1` (đổi từ `hcmut-score-*`/`hcmut-applicant-type-*` khi rebrand sang Uniscore — người dùng cũ mất input đã lưu, không migrate).
- Chưa có: database ngành động, biểu đồ, AI recommendation, xác suất trúng tuyển, login, server, analytics.

## Disclaimer

Uniscore là công cụ độc lập, không thuộc các trường đại học được hỗ trợ. Thí sinh nên đối chiếu thông tin tuyển sinh chính thức của từng trường trước khi quyết định.
