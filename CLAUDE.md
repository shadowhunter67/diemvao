# hcmut-score-calculator

Web tĩnh tính điểm xét tuyển HCMUT 2026, 100% client-side (không backend/database/auth). Xem README.md để biết chạy dev/build và nơi cập nhật công thức tuyển sinh.

## Stack & dependencies

- Vite 8 + React 19 + TypeScript, package manager npm.
- Tailwind CSS v4 qua `@tailwindcss/vite` (không dùng postcss.config/tailwind.config cổ điển).
- `lucide-react` — icon (nút Đặt lại).
- `oxlint` — linter (`npm run lint`).
- `vitest` — test business logic (`npm run test`), thêm ở Phase 2.

## Ghi chú

- Phase 2 (nhập điểm gốc theo phương thức Xét tuyển Tổng hợp HCMUT 2026, có ĐGNL): công thức + tham số nằm ở `src/config/admission-2026.ts`, không hard-code trong component hay `calculator.ts`.
- localStorage lưu input gần nhất, key `hcmut-score-input-v2` (đã version hóa từ MVP `hcmut-score-calculator:input:v1`, không migrate dữ liệu cũ).
- Điểm ưu tiên KV/ĐT hiện nhập trực tiếp theo thang 30 (chưa có dropdown Khu vực/Đối tượng vì thiếu bảng mapping đối tượng ưu tiên chính thức).

## Đối chiếu rule root (../CLAUDE.md)

- Không có `.env` trong project này — rule "không tự đọc .env" không phát sinh tình huống áp dụng.
- MCP `chrome-devtools` đã dùng để verify UI qua dev server thật (Phase 1 + Phase 2), không dùng `openai-bridge`/`notebooklm` (không cần thiết cho project này).
- Skill `design-taste-frontend` (taste-skill) đã audit UI 2026-08-09: skill này tự khai phạm vi "NOT for dashboards / dense product UI / multi-step forms" (project này chính là dense data-entry form) nên phần lớn rule về hero/marquee/bento/em-dash không áp dụng. Rule phổ quát vẫn áp: đã đổi accent màu từ `indigo` (thiên tím, phạm LILA RULE) sang `blue` xuyên suốt `ScoreInput`/`ScoreForm`/`ScoreResult`.
