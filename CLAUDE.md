# UniscoreVN

Web tĩnh tính & mô phỏng điểm xét tuyển đại học, 100% client-side (không backend/database/auth). Package name: `uniscorevn` (đổi từ `uniscore` ở Batch 7, trước đó `diemvao` ở Phase 13, trước đó nữa `hcmut-score-calculator` ở Phase 9 — xem `docs/CHANGELOG.md`). Xem README.md để biết chạy dev/build và nơi cập nhật công thức tuyển sinh.

**Product identity**: UniscoreVN là nền tảng multi-school (kiến trúc). **HCMUT/IU** có calculator thật (`status: 'supported'`) — IU nâng lên exact 2026-08-15 cho đối tượng "Thí sinh tốt nghiệp THPT 2026" (đối tượng tốt nghiệp ≤2025 và THPT nước ngoài ngoài phạm vi, xem `schools/iu/knowledgeGaps.ts`). **UEH/UEL** có explorer + công cụ quy đổi ĐGNL (V-ACT) verified, đọc/ghi `ApplicantProfile` dùng chung, nhưng chưa có exact calculator cuối (`status: 'partial'`). **UIT** có trang thông tin + eligibility/bonus checker + điểm chuẩn thật, chưa có calculator chính xác (`status: 'researching'`). Các trường còn lại (HCMUS, USSH, AGU, UHS) mới khai báo định danh hoặc partial trong registry. Mỗi trường có công thức/input schema/thang điểm hoàn toàn khác — KHÔNG ép mọi trường dùng chung một "universal formula engine". Xem README.md mục "Kiến trúc multi-school" + "HCMUT module".

## Stack & dependencies

- Vite 8 + React 19 + TypeScript, package manager npm.
- Tailwind CSS v4 qua `@tailwindcss/vite` (không dùng postcss.config/tailwind.config cổ điển).
- `lucide-react` — icon.
- `oxlint` — linter (`npm run lint`).
- `vitest` — test business logic (`npm run test`).

## Kiến trúc hiện tại (tóm tắt)

- `src/core/` — thật sự generic: `round2`, `rangeValidation`, `schoolModule.ts` (contract `SchoolModule`, không ép `calculate()` chung chữ ký), `storage.ts` (`getSchoolStorageKey` + `readWithMigration`), `applicantProfile*` (shared factual runtime state giữa HCMUT/UEH/UEL — **không bao giờ** chứa điểm đã quy đổi/điểm cuối riêng trường nào), `admissionMethod.ts` (`AdmissionMethodDescriptor[]` là nguồn sự thật cho `SchoolModule.capabilities`, method-level chứ không phải trường-level blanket flag).
- `src/schools/<id>/` — business logic/công thức riêng từng trường, không tràn ra `components/`/`core/`. `src/schools/index.ts` export `schoolRegistry`; thêm trường mới = thêm 1 dòng registry + thư mục `schools/<id>/` (không cần sửa `App.tsx`/router — đã kiểm chứng thật ở Phase 15 khi thêm UIT).
- Routing hand-rolled (`src/hooks/useRoute.ts`, không dùng router lib): `/` → landing, `/<id>` → tra registry. Backward-compat share link cũ (`/` + query) tự canonicalize sang `/hcmut`.
- **Storage namespace hiện tại**: `uniscorevn:*` (đổi từ `uniscore:*` ở Batch 7). Có migration chain đọc-xuyên nhiều đời cũ (`hcmut-score-*` → `uniscore-*-v1` → `uniscore:*` → `uniscorevn:*`), priority new-key-wins, không xóa legacy trừ khi user chủ động "Xóa hồ sơ đã lưu" (tombstone, tránh legacy resurrect). Đổi/thêm storage key phải đi qua `readWithMigration`, không tự ý bỏ chain.
- **Missing ≠ 0**: field điểm chưa nhập phải là `undefined`/absent trong `ApplicantProfile`, không phải `0`. Boundary form→calculator (tolerant, có default 0 cho input rỗng) khác với boundary form→`ApplicantProfile` mapper (phải bảo toàn missingness) — xem chi tiết fix ở `docs/CHANGELOG.md` mục Batch 7.

Toàn bộ lịch sử phát triển chi tiết (Phase 1–16, Batch 6–7 — quyết định, lý do, file bị đụng, QA đã chạy) nằm ở **[docs/CHANGELOG.md](docs/CHANGELOG.md)**. Đọc file đó trước khi giả định một kiến trúc/quyết định đã có sẵn hay chưa, hoặc khi cần biết vì sao code hiện tại trông như vậy.

## Lưu ý kỹ thuật khi test qua chrome-devtools

- Dùng tool `click` (không dùng `evaluate_script` với async function) để tránh crash "Target closed" từng gặp trong môi trường này; nếu cần verify state sau khi click, atomic hoá bằng một `evaluate_script` vừa click vừa đọc kết quả trong cùng script thay vì tách 2 lượt gọi (từng đo state "kẹt" giả do timing round-trip giữa các tool call riêng lẻ, không phải bug thật).
- `mcp__chrome-devtools__resize_page` bị clamp bởi kích thước cửa sổ tối thiểu của OS trên máy này (test 390px thực ra chỉ resize được viewport ~666px) — muốn test đúng breakpoint mobile phải dùng `emulate` với `viewport: "390x844x2,mobile,touch"`, verify lại bằng `window.innerWidth` trước khi chụp screenshot.

## Đối chiếu rule root (../CLAUDE.md)

- Không có `.env` trong project này — rule "không tự đọc .env" không phát sinh tình huống áp dụng.
- MCP `chrome-devtools` đã dùng để verify UI qua dev server thật, không dùng `openai-bridge`/`notebooklm` (không cần thiết cho project này).
- Skill `design-taste-frontend` (taste-skill) đã audit UI: skill này tự khai phạm vi "NOT for dashboards / dense product UI / multi-step forms" (project này chính là dense data-entry form) nên phần lớn rule về hero/marquee/bento/em-dash không áp dụng. Rule phổ quát vẫn áp: accent màu dùng `blue` xuyên suốt (đã đổi từ `indigo` thiên tím, phạm LILA RULE).
