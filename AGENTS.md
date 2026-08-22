# AGENTS.md — score-calculator (UniscoreVN)

Hướng dẫn đầy đủ cho AI agent làm việc trong project này nằm ở [CLAUDE.md](CLAUDE.md) (cùng thư mục) — đọc file đó trước khi sửa code. File này chỉ là bản tóm tắt ngắn cho agent/tool không đọc `CLAUDE.md`.

## Tóm tắt

Uniscore**VN** — web tĩnh 100% client-side (Vite + React 19 + TypeScript), tính & mô phỏng điểm xét tuyển đại học Việt Nam. Không backend/database/auth.

- Production: https://uniscorevn.vercel.app
- Repo: https://github.com/shadowhunter67/uniscorevn (đổi tên từ `uniscore` 2026-08-18)
- Kiến trúc multi-school: `src/core/` generic (round2, rangeValidation, `SchoolModule`/`ApplicantProfile`/`AdmissionMethodDescriptor` contract), `src/schools/<id>/` chứa business logic riêng từng trường — **không** ép universal formula engine.
- Trạng thái trường (kiểm chứng lại qua `AdmissionMethodDescriptor.capabilities.exactCalculator` trước khi giả định danh sách này còn đúng — xem `docs/architecture.md` mục golden/domain conformance, hoặc README.md mục "Trường đang hỗ trợ" cho danh sách đầy đủ hiện tại): HCMUT/UEH/UEL/HCMUS/USSH/IU/TDTU/HUFLIT/HUTECH/UFM/IUH/HCMULAW/UMP/FTU = exact calculator (USSH/IU/TDTU/HUFLIT/HUTECH/UFM chỉ trong phạm vi verified — xem `docs/release-checklist.md`); UIT = info/eligibility, chưa exact; AGU/UHS/HCMUE/HCMUTE/VLU/PTIT/NEU/HUB/HUIT/NTTU/HSU/UEF/CTU/TDMU/HIU/OU/SGU/HNUE/VinhUni/UTC mới ở mức eligibility/research.
- **Quy tắc vận hành đầy đủ** (kiến trúc/invariant, research workflow, release cadence + checkpoint, process cleanup, evidence-first, git safety) nằm ở [CLAUDE.md](CLAUDE.md) mục "Quy tắc vận hành bắt buộc" — đọc trước khi research trường mới hoặc làm release checkpoint, không cần user nhắc lại từng lần.

## Lệnh hay dùng

```bash
npm install
npm run dev      # dev server
npm run test     # vitest
npm run lint     # oxlint
npm run build    # tsc -b + vite build
```

## Quy tắc quan trọng khi sửa code

- **Storage key**: có chain migration nhiều đời (`hcmut-score-*` → `uniscore-*-v1` → `uniscore:*` → `uniscorevn:*` hiện tại). Đổi/thêm key phải qua `readWithMigration` (`src/core/storage.ts`), không tự ý đổi key cũ hay bỏ chain.
- **Missing ≠ 0**: field điểm chưa nhập phải là `undefined`/absent trong `ApplicantProfile`, không phải `0`. Boundary form→calculator (tolerant, có default) khác với boundary form→`ApplicantProfile` mapper (phải bảo toàn missingness).
- **`ApplicantProfile`** là shared factual runtime state dùng chung HCMUT/UEH/UEL — chỉ chứa input gốc (factual), **không** chứa điểm đã quy đổi/điểm cuối của từng trường.
- Không rename brand string tràn lan — legacy identifier (`uniscore:*`, `diemvao`, URL repo cũ...) chỉ giữ khi phục vụ migration/backward-compat/lịch sử, xem chi tiết nguyên tắc rebrand trong `docs/CHANGELOG.md` mục Batch 7.
- Full changelog Phase 1–16 + Batch 6–7 (quyết định, lý do, file bị đụng) nằm trong `docs/CHANGELOG.md` — đọc trước khi giả định kiến trúc hoặc quyết định đã có sẵn hay chưa.


