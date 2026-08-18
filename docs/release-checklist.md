# UniscoreVN Release Checklist

## Release cadence

Quy luật production checkpoint: **mỗi +5 trường mới trong `schoolRegistry` → 1 deployment
checkpoint**. Giữa các checkpoint vẫn có thể tiếp tục làm việc trên working tree theo workflow
bình thường — không bắt buộc push production sau từng trường — nhưng phải giữ
`lint`/`audit:data`/`test`/`build` xanh sau mỗi batch lớn (không để dirty tree tích lũy ở trạng
thái broken nhiều batch liên tiếp).

**Current checkpoint state:**

```text
Production checkpoint: 15 schools
Commit: d582052
Pushed: main -> origin/main, 2026-08-18
Next release checkpoint: 20 schools
```

Cập nhật khối này mỗi khi tạo checkpoint mới — đây là nơi DUY NHẤT ghi tay con số trường/commit,
không lặp lại ở CLAUDE.md/AGENTS.md (những file đó chỉ trỏ về đây). Không hard-code danh sách tên
trường/exact method ở đây — nguồn sự thật luôn là `schoolRegistry`
(`src/schools/index.ts`)/`AdmissionMethodDescriptor.capabilities.exactCalculator`, tự derive khi
cần audit thay vì tin danh sách viết tay có thể đã lệch.

## Quy trình checkpoint (chạy đủ 10 bước, theo thứ tự)

1. **Audit toàn bộ dirty tree** — `git status --short`, `git diff --stat`, đọc diff thật (không
   giả định dirty tree chỉ chứa batch gần nhất; đọc kỹ các file core/compare thay đổi nhiều để chắc
   không vô tình đổi formula ngoài phạm vi đã verify của trường cũ).
2. **Security/repo hygiene** — search `.env`/token/secret/password/apiKey/Authorization/
   localhost/127.0.0.1/TODO TEMP/DEBUG trong diff; kiểm tra `.gitignore` che đúng
   `node_modules/dist/coverage/playwright-report/test-results`; không mechanically xóa mọi
   `console.log` (chỉ tìm debug/secret rơi rớt, phân biệt với `console.log` cố ý trong CLI script).
3. **Full verification** — `npm run lint && npm run audit:data && npm run test && npm run build`.
   Cả 4 phải pass. Chạy thêm E2E nếu repo lúc đó đã có E2E suite. Không commit nếu bất kỳ lệnh nào
   fail.
4. **Commit** — 1 commit checkpoint rõ ràng nếu dirty tree là 1 chuỗi thay đổi coherent đã verify
   cùng nhau; message mô tả đúng diff thật (không claim "N exact universities" nếu N trường không
   phải tất cả đều exact — dùng số trường trong registry, tách riêng số method exact). Review scope
   staging trước khi commit (không `git add -A` mù không xem lại danh sách file).
5. **Push** — remote branch production hiện tại (thường `main`). **Không force push.** Kiểm tra
   `git fetch`/divergence trước khi push để tránh push đè.
6. **Verify GitHub CI** — sau push, đọc kết quả workflow (`gh run list`/`gh run watch`). CI đỏ thì
   sửa nguyên nhân, verify local lại, commit fix, push lại — không coi local pass là đủ nếu CI đỏ.
7. **Verify deployment provider** nếu accessible (vd `gh api repos/<owner>/<repo>/commits/<sha>/status`
   đọc Vercel commit status) — không invent deployment status nếu không xem được; nói rõ "chưa
   verify trực tiếp" thay vì đoán.
8. **Production smoke test** nếu deployment accessible — landing load được, vài route trường mới +
   cũ trả 200/render đúng, `/compare` render được, refresh 1 deep route không 404. Không cần full
   QA, không cần thêm E2E mới trong lúc release.
9. **Process cleanup** — nếu có mở dev server/browser automation để smoke test, tự đóng trước khi
   báo cáo xong (xem CLAUDE.md mục process cleanup). Không kill process không do chính task tạo.
10. **Xác nhận working tree sạch** sau push (`git status` → "nothing to commit, working tree
    clean") — nếu còn file cố ý không commit, giải thích rõ lý do.

## Code

- Exact calculators: xem `AdmissionMethodDescriptor.capabilities.exactCalculator` per method
  (`schools/<id>/methods.ts`) — đây là nguồn sự thật duy nhất, danh sách hard-code ở tài liệu cũ
  luôn có nguy cơ lệch theo thời gian nên đã bỏ khỏi file này (xem `docs/architecture.md` mục golden/
  domain conformance để hiểu tại sao 1 method exact luôn có golden coverage kèm theo, tự audit được).
- Conditional-exact (semantics: phạm vi verified hẹp hơn "cả method") áp dụng cho nhiều trường —
  đọc `schools/<id>/knowledgeGaps.ts` của từng trường để biết giới hạn cụ thể, không suy đoán từ tên
  trường.
- No derived school score is stored in `ApplicantProfile`.
- No prediction, ranking, recommendation, login, backend, database, or crawler is part of this
  release.

## Data

- Admission sources live in school source registries.
- Score-affecting rule evidence resolves through `sourceId`.
- `npm run audit:data` must finish with zero errors.
- Known warnings/info are allowed only when they describe honest official-rule gaps
  (`schools/<id>/knowledgeGaps.ts`), not silent omissions.

## Tests

- Run `npm run lint`.
- Run `npm run audit:data`.
- Run `npm run test`.
- Run `npm run build`.
- Smoke `/`, `/compare`, và một vài route trường (ít nhất 1 trường cũ có exact calculator + 1
  trường mới nhất vừa thêm) — danh sách route cụ thể thay đổi theo registry, không hard-code ở đây.

## UX

- Landing explains: nhập điểm một lần, nhiều trường đọc, mỗi trường áp dụng rule riêng, kết quả kèm
  nguồn.
- `/compare` separates exact, partial, and unavailable results.
- Partial schools never show a final cutoff gap.
- Evidence details must not expose raw enum values or empty placeholders.

## Production

- Canonical domain: `https://uniscorevn.vercel.app`.
- `vercel.json` rewrites all SPA routes to `index.html` — mọi route `/<schoolId>` tự hoạt động khi
  thêm trường mới, không cần sửa `vercel.json`/routing hook (`src/hooks/useRoute.ts` generic).
- Direct navigation + refresh vào bất kỳ `/<schoolId>` nào trong `schoolRegistry` phải trả về app
  shell (không 404).

## Known Limitations

Không liệt kê tay ở đây — mỗi trường tự khai gap trong `schools/<id>/knowledgeGaps.ts`, đọc trực
tiếp ở đó (hoặc README.md mục "Trường đang hỗ trợ") để có bức tranh current-state chính xác, tránh
2 nguồn liệt kê có thể lệch nhau.
