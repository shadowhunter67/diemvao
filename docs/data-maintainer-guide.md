# Ghi chú cho admin / data maintainer

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

## `lastReviewedAt`

- Chỉ set khi admin/data-maintainer thật sự mở lại nguồn gốc và xác nhận vẫn đúng — không
  backfill hàng loạt cho có. Field trống nghĩa là "chưa ai review lại kể từ lúc nhập ban đầu",
  không phải "đã kiểm tra và ổn".
- Có thể coi record "review-needed" nếu `lastReviewedAt` trống hoặc quá cũ so với thời điểm mùa
  tuyển sinh đang diễn ra — chưa có tooling tự động phân loại `fresh`/`review-needed`/`outdated`
  trong phase này, chỉ có data model sẵn sàng cho việc đó sau.

## Legal/data safety

- UniScore không phải nguồn gốc dữ liệu — chỉ tổng hợp, chuẩn hóa, tính toán, đối chiếu, giải
  thích. Ưu tiên lưu factual values, paraphrase wording, dẫn source chính thức thay vì copy
  nguyên bài/ảnh/PDF.
- Không dùng logo trường theo cách khiến người dùng tưởng UniScore là sản phẩm chính thức của
  trường.
