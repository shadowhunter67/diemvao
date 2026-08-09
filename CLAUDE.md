# hcmut-score-calculator

Web tĩnh tính điểm xét tuyển HCMUT 2026, 100% client-side (không backend/database/auth). Xem README.md để biết chạy dev/build và nơi cập nhật công thức tuyển sinh.

## Stack & dependencies

- Vite 8 + React 19 + TypeScript, package manager npm.
- Tailwind CSS v4 qua `@tailwindcss/vite` (không dùng postcss.config/tailwind.config cổ điển).
- `lucide-react` — icon (nút Đặt lại).
- `oxlint` — linter (`npm run lint`).

## Ghi chú

- Công thức + trọng số nằm ở `src/config/admission-2026.ts`, không hard-code trong component.
- localStorage lưu input gần nhất, key `hcmut-score-calculator:input:v1`.
