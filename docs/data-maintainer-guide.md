# Ghi chú cho admin / data maintainer

## Quy trình research + implement 1 trường mới

Trước khi viết code, research theo thứ tự (dừng lại và ghi blocker nếu bất kỳ bước nào không đọc
được — không đoán):

1. Tìm trang tuyển sinh chính thức 2026 của trường (domain `<truong>.edu.vn`/`tuyensinh.<truong>.edu.vn`).
2. Tìm thông báo/PDF mới nhất — không dùng kết quả research batch trước làm authority, tự mở lại
   nguồn (xem "Freshness rule" bên dưới).
3. Inventory toàn bộ phương thức xét tuyển + applicant type áp dụng.
4. Công thức từng phương thức + thang điểm.
5. Bảng điểm cộng/xét thưởng (bonus/certificate).
6. Điểm ưu tiên khu vực/đối tượng + công thức giảm.
7. Ngưỡng đầu vào (threshold) — phân biệt rõ với điểm chuẩn trúng tuyển (cutoff), xem
   `docs/architecture.md` mục "Quy tắc kiến trúc bắt buộc".
8. Danh mục ngành/chương trình + tổ hợp môn.
9. Dữ liệu điểm chuẩn hiện có (nếu có, lưu tách khỏi threshold).
10. Nhánh đặc thù (ngành riêng, đối tượng riêng, điều kiện phụ).
11. Source lifecycle (ngày đăng, năm áp dụng, có bị supersede không).
12. Ghi `KnowledgeGap` cho mọi phần đã tìm kỹ nhưng không có nguồn — không suy diễn công thức chỉ để
    tăng coverage.

Trang là SPA/JS render → cần browser/devtools thật để đọc (fetch tool thô không thấy nội dung).
PDF → đọc qua text layer/table nếu tool hỗ trợ; nếu không đọc được, ghi blocker rõ, không đoán số.

Sau khi đã có đủ dữ liệu, implement theo cấu trúc `schools/<id>/` chuẩn (xem
`docs/architecture.md` mục "Quy tắc kiến trúc bắt buộc" + trường gần nhất làm ví dụ, vd
`schools/hutech/` hoặc `schools/ufm/`): module, methods, sources, evidence, knowledgeGaps, evaluator
nếu có, comparison adapter nếu evaluator meaningful, rồi wire vào registry + audit script + test,
cộng golden coverage nếu có method exact. Không tạo module identity-only chỉ để tăng số trường đếm
được.

## Nhập bảng lớn (danh mục ngành/điểm chuẩn/phụ lục)

Không nhập tay mù hàng trăm dòng dữ liệu. Với bảng lớn:

- Ưu tiên deterministic parser/import nếu nguồn machine-readable (HTML table, CSV, JSON).
- Nếu phải nhập tay, chỉ nhập 1 subset có ranh giới rõ ràng (vd "chỉ 2 ngành có ngưỡng riêng"), ghi
  rõ trong knowledgeGaps phần còn lại chưa import — không âm thầm bỏ sót.
- Validate tối thiểu khi import: duplicate program code/stable ID, tên ngành trống, threshold/scale
  vô lý (âm, NaN, ngoài range hợp lý), method không tồn tại trong registry, source provenance thiếu,
  row count có hợp lý so với con số trường tự công bố không.
- Stable ID bắt buộc cho mọi program/threshold group — dùng mã ngành chính thức nếu có; nếu không,
  tự đặt id ổn định (kebab-case). KHÔNG dispatch business rule bằng cách so khớp substring tên hiển
  thị (vd `.includes('Y khoa')`) — xem HUTECH/UFM `HutechThresholdGroup`/`UfmThresholdGroup` làm ví
  dụ enum ổn định thay vì string matching.

## Ưu tiên mở rộng trường tiếp theo (ROI)

Khi chọn trường kế tiếp để research/implement, ưu tiên theo:

```text
source clarity (nguồn rõ, không mâu thuẫn) + user value (nhiều thí sinh quan tâm)
-------------------------------------------------------------------------------
implementation complexity (công thức phức tạp, cần mở rộng data model)
```

Không chọn chỉ vì trường nổi tiếng/lớn. Một module eligibility-only đúng với nguồn sạch còn tốt hơn
một exact calculator suy diễn từ nguồn mơ hồ. Nếu nghiên cứu sơ bộ phát hiện nguồn mâu thuẫn nhau
(vd 2 bài báo nói khác nhau về cùng 1 hệ số) và không tìm được nguồn chính thức trực tiếp giải quyết
— đó là tín hiệu nên hạ mức implement (partial/eligibility-only) thay vì đoán 1 trong 2 nguồn đúng.

## Release candidate merge checklist

Before merging admission-data changes:

1. Update the school source registry first.
2. Link score-affecting rule evidence by `sourceId`.
3. Keep known official gaps as `KnowledgeGap` entries instead of guessing.
4. Run `npm run audit:data`.
5. Run `npm run test` and `npm run build`.

## Batch 13 — freshness / lifecycle

`VerificationLevel` trả lời "nguồn này đáng tin đến đâu"; `FreshnessStatus` trả lời "nguồn/rule đó còn phù hợp với admission year hiện hành không". Một nguồn có thể vừa `verification: 'verified'` vừa `freshness: 'superseded'`; khi đó không được dùng để power current-year exact evaluation.

Hai lớp regression thật đã xảy ra, cả hai đều bắt buộc audit lại trước khi giữ 1 knowledge gap hay
dùng 1 nguồn:

- **Stale pending gap**: nguồn cũ tự nói "sẽ công bố sau"/"cập nhật sau"/"sau kỳ thi"/"theo thông
  báo sau" — batch trước dừng lại ở đó, nhưng có thể trường ĐÃ công bố rồi (HCMUTE, HUFLIT từng gặp
  đúng lớp này). Trước khi giữ gap loại này, PHẢI search announcement mới hơn tới ngày hiện tại.
- **Old-source trap**: tìm được 1 trang có vẻ đủ dữ liệu, nhưng hóa ra thuộc admission year CŨ (vd
  trang batch UFM ban đầu tìm được ghi ngày 23/7/2025, không phải 2026) — nội dung "giống" không có
  nghĩa là cùng năm. Luôn kiểm tra `publishedAt`/admission year/lifecycle/supersession của trang
  trước khi dùng, không chỉ đọc nội dung rồi tin.

Các model chính:

- `CURRENT_ADMISSION_YEAR` ở `src/core/admissionYear.ts`: domain config, không derive từ ngày hệ thống.
- `FreshnessStatus = 'current' | 'needs-review' | 'stale' | 'superseded' | 'historical' | 'unknown'`.
- `RuleLifecycle` / `SourceLifecycle`: `effectiveYear`, `publishedAt`, `lastReviewedAt`, `status`, `supersededBy`.
- `CutoffPublicationStatus = 'published' | 'not-published' | 'unknown' | 'superseded'`.
- `criticality: 'score-affecting' | 'informational'`: chỉ score-affecting evidence mới có quyền block/downgrade exact score.

Quy tắc bảo trì:

- Thêm current-year rule: gắn `effectiveYear = CURRENT_ADMISSION_YEAR`, giữ `verification` đúng mức bằng chứng, và chỉ gắn lifecycle khi có metadata thật.
- Supersede source/rule: không xóa bản cũ; đặt `status: 'superseded'` và `supersededBy`, rồi thêm bản replacement verified/current nếu có.
- Historical cutoff không phải stale. Nó vẫn là mốc tham khảo hợp lệ nếu `status: 'final'`, `year < CURRENT_ADMISSION_YEAR`, cùng context/scale/method và `comparableToPrevious !== false`.
- `not-published` chỉ dùng khi có `NotPublishedCheck`; thiếu record mà chưa kiểm tra đủ là `unknown`.
- Không có policy "30 ngày là stale". Calendar age chỉ là hint cho maintainer khi có basis sản phẩm rõ ràng.

`auditAdmissionDataFreshness()` ở `src/core/dataFreshnessAudit.ts` là helper pure/dev-facing. Tests dùng helper này để bắt method runtime sai năm, current final cutoff thiếu nguồn, duplicate current cutoff conflict, và score-affecting rule evidence bị superseded.

## Batch 14 — maintainer workflow before deploy

Before editing admission data:

1. Identify the official source and decide whether it is primary evidence or only a secondary cross-check.
2. Record factual metadata only when known: `publishedAt` is the source/document publication date; `lastReviewedAt` is when UniScoreVN maintainers checked the source; `effectiveYear` is the admission cycle the rule applies to.
3. Do not use git commit dates as publication dates, and do not use `lastReviewedAt` as proof that a source is still current.

After editing:

```bash
npm run audit:data
npm run lint
npm run test
npm run build
```

`npm run audit:data` is deterministic and offline. Exit code policy:

- `error` -> exit 1: duplicate current cutoff conflict, current final cutoff missing source, current exact method using superseded/non-current evidence, exact method still claiming unresolved score-affecting gaps.
- `warning` -> exit 0: known official-but-unparsed rule such as UIT's percentile-conversion table, or maintainer-visible metadata concerns that do not corrupt current exact comparison.
- `info` -> exit 0: known incomplete product gaps for non-exact methods.

## Batch 15 — source-first rule provenance

For score-affecting admission rules, maintain provenance in this order:

1. Add or update the canonical source registry entry in `src/schools/<id>/sources.ts`.
2. Set factual metadata there: `sourceType`, `verification`, `publishedAt`, `lastReviewedAt`, and `lifecycle` when known.
3. Link `RuleEvidence` by `sourceId`; avoid copying title/url/date metadata into each evidence object.
4. Add or update the school-local rule/evaluator that consumes that evidence.
5. Run `npm run audit:data -- --school=<id>`.
6. Run `npm run lint`, `npm run test`, and `npm run build`.

Synthetic superseded example:

```ts
{
  id: 'uel-rule-2026-old',
  sourceType: 'official-admission',
  lifecycle: { status: 'superseded', effectiveYear: 2026, supersededBy: 'uel-rule-2026-current' },
}
```

Official-but-unparsed example (UIT, current as of 2026-08-17 — see `schools/uit/knowledgeGaps.ts`):
keep the source registry entry for the official percentile/conversion pages, link each `KnowledgeGap`
with its `sourceId`, and keep `exactCalculator: false` until every score-affecting table is parsed
into deterministic rules. (Historical note: UEL had a similar Google-Drive-PDF-unparsed gap for its
certificate bonus table — `sourceId: 'uel-admission-pdf-2026-unparsed'` is still `verification:
'incomplete'` in `schools/uel/sources.ts` — but the SAME bonus data became independently readable
from a public HTML page on the school's site, `uel-certificate-bonus-html-2026`, which resolved the
gap without needing the PDF. UEL's `exactCalculator` has been `true` since the 2026-08-15 re-audit —
a gap tied to one unparsed artifact doesn't block the exact gate if another verified source proves
the same rule.)

For table-based exact rules, use this workflow:

1. Read the official table artifact directly, not a secondary summary.
2. Encode only rows actually present in the table.
3. Keep row data school-specific unless another school explicitly shares the same official table.
4. Link the rule/table to one canonical `sourceId`; store page/appendix/table in evidence location.
5. Add boundary tests for every score band and certificate type.
6. Flip the exact gate only after every score-affecting gap is resolved.

Examples:

- New current rule: add `RuleEvidence` with `effectiveYear = CURRENT_ADMISSION_YEAR`; add lifecycle only if there is a real lifecycle fact.
- Superseded notice: keep the old item, mark lifecycle/status `superseded`, set `supersededBy`, and add the replacement as current/final when verified.
- Historical cutoff: keep `status: 'final'`; do not call it stale if it is only a previous-year reference.
- Unknown current cutoff: do not add a fake record and do not say "not-published" without `NotPublishedCheck`.
- Official-but-unparsed document: keep a `KnowledgeGap` with `status: 'official-but-unparsed'`; do not unblock exact calculator until the table/rule is parsed.

Admission-year rollover checklist:

1. Update `CURRENT_ADMISSION_YEAR`.
2. Run `npm run audit:data`.
3. Let method-year mismatch errors reveal 2026 methods that still need real 2027 sources/rules.
4. Add new current sources/rules with true metadata.
5. Never silently relabel a 2026 rule as 2027.

Dữ liệu tuyển sinh (ngưỡng đầu vào, công thức, quy đổi, điểm cộng, ưu tiên, danh sách ngành,
điểm chuẩn) có thể thay đổi nhiều lần trong cùng một mùa tuyển sinh. Trước khi dùng dữ liệu để
tính điểm hoặc hiển thị, luôn ưu tiên thông báo chính thức mới nhất — không cache "sự thật" quá
lâu trong đầu.

## Model dùng chung (`src/core/admissionHistory.ts`)

- `CutoffStatus = 'final' | 'superseded'`. Record không set `status` mặc định coi là `'final'`
  (tương thích dữ liệu cũ chưa migrate).
- `SourceType = 'official-school' | 'official-admission' | 'vnuhcm' | 'government' | 'secondary'`.
- Mỗi cutoff nên có `sourceType`, `verification` (`VerificationLevel` ở `core/trust.ts`), và có
  thể có `lastReviewedAt` khi thật sự được admin xác nhận lại.

## Quy tắc khi có source mới thay thế source cũ

1. **Không xóa record cũ.** Thêm record mới với `status: 'final'`, đổi record cũ (nếu cùng năm +
   cùng ngành) sang `status: 'superseded'`.
2. `validateAdmissionDataset()` / `validateUitDataset()` sẽ báo lỗi `multiple-final-year-program`
   nếu có >1 bản `'final'` cho cùng (năm, ngành) — đó là tín hiệu quên đánh dấu `superseded`.
3. UI công khai chỉ hiển thị bản `'final'` (qua `getCutoffsForProgram`/`finalCutoffsSortedDesc`).
   Bản `superseded` vẫn nằm trong file dữ liệu, phục vụ audit/lịch sử — chưa có admin view riêng
   trong phase này (xem "Không làm trong phase này" ở CLAUDE.md/docs khác).

## Khi năm hiện tại chưa công bố cutoff

- **Không** dùng `0`, điểm năm trước, hay số dự đoán để giả làm cutoff năm hiện tại.
- Đơn giản là **không thêm record** cho (năm hiện tại, ngành) đó — `isYearPublished` /
  `isCurrentYearCutoffPublished` sẽ tự trả `false`, UI (`ProgramHistoryCompare`) tự hiển thị dòng
  "Chưa công bố" thay vì fake số.
- Calculator vẫn chạy được nếu công thức năm đó đã verified — không cần chờ cutoff. Mốc tham
  khảo gần nhất dùng `getNearestPreviousCutoff` (tự lùi về năm gần nhất CÓ dữ liệu, không mặc
  định là năm liền trước).

## Comparability giữa các năm

- Nếu công thức/thang điểm/phương thức năm nay khác đáng kể năm trước, set
  `comparableToPrevious: false` trên record năm đó. UI sẽ tự hiện cảnh báo, không vẽ gap như thể
  cùng thang.
- Mặc định (không set) coi là `true` — chỉ set `false` khi thật sự xác nhận có thay đổi phương
  thức/thang điểm.

## Ưu tiên nguồn

- Không dùng `secondary` (báo chí, trang tổng hợp điểm chuẩn bên thứ ba) nếu đã có
  `official-school`/`official-admission`/`vnuhcm` cho cùng fact.
- `secondary` chỉ dùng để cross-check hoặc khi chưa có nguồn chính thức đọc được (vd bảng điểm
  chỉ tồn tại dạng ảnh trên trang trường — xem cách HCMUT/UIT đối chiếu chéo trong
  `docs/admission-research-2026.md`).
- Chưa đủ nguồn chính thức cho một fact → đánh dấu `verification: 'incomplete'`, KHÔNG suy đoán
  số liệu để lấp khoảng trống.
- Nếu official source/artifact có tồn tại nhưng chưa đọc được bảng số liệu an toàn (vd UEL Phụ lục
  2 trong Google Drive PDF chỉ load được shell Drive qua fetch), dùng `KnowledgeStatus:
  'official-but-unparsed'` cho gap và vẫn giữ calculator blocked cho rule đó.

## `lastReviewedAt`

- Chỉ set khi admin/data-maintainer thật sự mở lại nguồn gốc và xác nhận vẫn đúng — không
  backfill hàng loạt cho có. Field trống nghĩa là "chưa ai review lại kể từ lúc nhập ban đầu",
  không phải "đã kiểm tra và ổn".
- Có thể coi record "review-needed" nếu `lastReviewedAt` trống hoặc quá cũ so với thời điểm mùa
  tuyển sinh đang diễn ra — chưa có tooling tự động phân loại `fresh`/`review-needed`/`outdated`
  trong phase này, chỉ có data model sẵn sàng cho việc đó sau.

## Provenance ở mức RULE, không chỉ dataset (batch 2)

`core/evidence.ts` (`RuleEvidence`/`SourcedRule<T>`) và `core/knowledgeStatus.ts`
(`KnowledgeStatus`/`KnowledgeGap`) bổ sung cho model ở trên khi cần gắn nguồn vào MỘT hằng số cụ
thể trong công thức (vd hệ số 0.75, ngưỡng 75) thay vì chỉ ở mức dataset/cutoff. Xem
`schools/hcmut/evidence.ts`, `schools/ueh/evidence.ts` để biết cách dùng thật, và
`docs/architecture.md` cho tổng quan đầy đủ các model mới. Khi thêm 1 hằng số quan trọng mới vào
`AdmissionConfig` của bất kỳ trường nào, cân nhắc thêm luôn evidence tương ứng thay vì chỉ ghi
comment tự do — comment dễ đọc nhưng không machine-readable, evidence thì có thể lắp vào
`CalculationStep`/`AdmissionEvaluation` (xem `schools/hcmut/evaluate.ts`) để hiển thị "vì sao" cho
người dùng cuối sau này.

## Method-level capability (batch 6)

- `schools/<id>/methods.ts` (`AdmissionMethodDescriptor[]`) là nguồn sự thật cho "trường/phương
  thức này tính được đến đâu" — `SchoolModule.capabilities` (school-level) derive từ đây qua
  `aggregateSchoolCapabilities()` (`core/admissionMethod.ts`), không hard-code song song nữa.
- Khi bật thêm 1 capability (vd unblock `priority`/`bonus`/`exactCalculator` sau khi có evidence
  mới): sửa `capabilities` trong `methods.ts` — `SchoolModule.capabilities` tự cập nhật theo, không
  cần sửa 2 chỗ.
- `knowledgeGaps` trong `methods.ts` nên trỏ về CÙNG file `schools/<id>/knowledgeGaps.ts` mà UI
  dùng để render "chưa tính được: ..." — không tạo 2 danh sách gap khác nhau cho cùng 1 trường.

## Legal/data safety

- UniscoreVN không phải nguồn gốc dữ liệu — chỉ tổng hợp, chuẩn hóa, tính toán, đối chiếu, giải
  thích. Ưu tiên lưu factual values, paraphrase wording, dẫn source chính thức thay vì copy
  nguyên bài/ảnh/PDF.
- Không dùng logo trường theo cách khiến người dùng tưởng UniscoreVN là sản phẩm chính thức của
  trường.
