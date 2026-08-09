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
- Phase 3 (target calculator + scenario simulator + share URL): `src/lib/targetCalculator.ts` chứa `calculateRequiredDgnl` (binary search, tái sử dụng `calculateAdmissionScore`). `src/lib/urlState.ts` serialize/parse query params (chỉ field hợp lệ). Target lưu localStorage riêng, key `hcmut-score-target-v1`. URL query params có precedence cao hơn localStorage khi load trang.
- Phase 4 (ngành mục tiêu + điểm chuẩn tham khảo): `src/data/hcmut-programs.ts` + `hcmut-cutoffs.ts` (29 chương trình, nguồn báo chí dẫn công bố chính thức HCMUT — trang hcmut.edu.vn nhúng bảng điểm dạng ảnh nên không fetch trực tiếp được). `calculateAdmissionScoreFromWeightedDgnlRaw` (đổi tên từ `calculateScoreForWeightedRaw` ở Phase 3, refactor bỏ hack nhét weightedRaw vào field ĐGNL giả — giờ tái sử dụng thẳng `convertThptScore`/`convertTranscriptScore`/`calculateAcademicScore`/`calculateBonus`/`calculatePriority`). Ngành/buffer/compare lưu localStorage `hcmut-score-program-v1`, mở rộng `urlState.ts` với `program`/`buffer`/`compare`. Tuyệt đối không gọi kết quả so sánh là "xác suất đậu"/"đậu"/"rớt" — chỉ "tham khảo"/"chênh lệch".
- Khi test qua `mcp__chrome-devtools`, dùng tool `click` (không dùng `evaluate_script` với async function) để tránh crash "Target closed" từng gặp trong môi trường này; nếu cần verify state sau khi click, atomic hoá bằng một `evaluate_script` vừa click vừa đọc kết quả trong cùng script thay vì tách 2 lượt gọi (từng đo state "kẹt" giả do timing round-trip giữa các tool call riêng lẻ, không phải bug thật).

## Đối chiếu rule root (../CLAUDE.md)

- Không có `.env` trong project này — rule "không tự đọc .env" không phát sinh tình huống áp dụng.
- MCP `chrome-devtools` đã dùng để verify UI qua dev server thật (Phase 1 + Phase 2), không dùng `openai-bridge`/`notebooklm` (không cần thiết cho project này).
- Skill `design-taste-frontend` (taste-skill) đã audit UI 2026-08-09: skill này tự khai phạm vi "NOT for dashboards / dense product UI / multi-step forms" (project này chính là dense data-entry form) nên phần lớn rule về hero/marquee/bento/em-dash không áp dụng. Rule phổ quát vẫn áp: đã đổi accent màu từ `indigo` (thiên tím, phạm LILA RULE) sang `blue` xuyên suốt `ScoreInput`/`ScoreForm`/`ScoreResult`.
