# HCMUT Score Calculator

Công cụ tính điểm xét tuyển Đại học Bách khoa – ĐHQG TP.HCM, phương thức Xét tuyển Tổng hợp 2026 (thí sinh có kết quả ĐGNL ĐHQG-HCM 2026). Tính hoàn toàn phía client (không backend, không database, không đăng nhập), realtime khi người dùng nhập điểm gốc.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm run test
```

## Deploy

Có thể import repository trực tiếp vào Vercel (framework preset: Vite).

## Cấu trúc project

```text
src/
├── components/     # UI thuần, không chứa công thức tính điểm
├── config/         # Trọng số + tham số công thức theo từng năm tuyển sinh
├── data/           # Dataset tĩnh: ngành + điểm chuẩn tham khảo, có validateAdmissionDataset()
├── lib/            # calculator.ts, targetCalculator.ts, programs.ts, validation.ts, urlState.ts
├── types/          # admission.ts (business), form.ts (form state), programs.ts (ngành/điểm chuẩn)
├── App.tsx         # State + localStorage
└── main.tsx
```

## Cập nhật công thức tuyển sinh

Toàn bộ trọng số, hệ số môn Toán, thang điểm tối đa từng thành phần, ngưỡng giảm điểm ưu tiên... nằm ở [src/config/admission-2026.ts](src/config/admission-2026.ts) — không hard-code trong component hay trong `calculator.ts`. Để thêm năm tuyển sinh mới, tạo file `src/config/admission-<năm>.ts` theo cùng cấu trúc `AdmissionConfig` rồi trỏ `activeAdmissionConfig` sang file mới.

Logic tính điểm nằm ở [src/lib/calculator.ts](src/lib/calculator.ts) — toàn bộ là pure function (`convertDgnlScore`, `convertThptScore`, `convertTranscriptScore`, `calculateAcademicScore`, `calculateBonus`, `calculatePriority`, `calculateAdmissionScore`), không phụ thuộc React, không đọc localStorage. Có test ở [src/lib/calculator.test.ts](src/lib/calculator.test.ts) (Vitest).

## Quy trình tính điểm

```text
Điểm gốc (ĐGNL 4 phần thi, THPT 3 môn, học bạ 9 ô điểm 3 năm)
  → chuẩn hóa từng thành phần về thang 100
  → điểm học lực = 70% ĐGNL + 20% THPT + 10% học bạ
  → điểm cộng = thưởng + xét thưởng + khuyến khích (tối đa 10)
  → điểm ưu tiên KV/ĐT quy đổi từ thang 30, giảm dần khi (học lực + điểm cộng) ≥ 75
  → điểm xét tuyển = học lực + điểm cộng + ưu tiên thực nhận (tối đa 100)
```

## Mục tiêu & mô phỏng (Phase 3)

- **Mục tiêu của bạn**: nhập điểm xét tuyển mục tiêu (0-100), app tính ngược ĐGNL chuẩn hóa cần đạt bằng binary search trên [src/lib/targetCalculator.ts](src/lib/targetCalculator.ts) (`calculateRequiredDgnl`), tái sử dụng nguyên `calculateAdmissionScore` ở mỗi bước — không giải bằng công thức đại số vì điểm ưu tiên thực nhận phụ thuộc phi tuyến vào baseScoreForPriority.
- **Mô phỏng điểm ĐGNL**: slider thử một mức ĐGNL giả định (0-1500 sau hệ số), có state riêng, không đổi dữ liệu form gốc.
- **Chia sẻ kết quả**: serialize input hợp lệ (không rỗng, không lỗi) ra query params ngắn (`dg_v`, `th_m`, `tr10_m`, `bn_r`, `pr`, `tg`...) qua [src/lib/urlState.ts](src/lib/urlState.ts). Mở URL sẽ populate form; field lỗi/thiếu bị bỏ qua, không crash app. URL có precedence cao hơn localStorage.

## Ngành mục tiêu & điểm chuẩn tham khảo (Phase 4)

- **Dataset**: [src/data/hcmut-programs.ts](src/data/hcmut-programs.ts) (29 ngành/chương trình) + [src/data/hcmut-cutoffs.ts](src/data/hcmut-cutoffs.ts) (điểm chuẩn "Xét tuyển Tổng hợp", thang 100). Mỗi cutoff bắt buộc có `sourceLabel`/`sourceUrl`/`accessedAt`. **Dữ liệu chưa đầy đủ**: HCMUT tuyển 70+ ngành, dataset mới có 29 chương trình xác minh được qua báo chí dẫn nguồn công bố chính thức của trường (bảng điểm gốc trên hcmut.edu.vn nhúng dưới dạng ảnh, không fetch được bằng text). Xem chi tiết nguồn ở comment đầu file `hcmut-cutoffs.ts`.
- **Không gọi là "xác suất đậu"**: toàn bộ UI dùng từ "tham khảo"/"chênh lệch"/"cao hơn"/"thấp hơn", không dùng "đậu/rớt/tỉ lệ đậu".
- **Ngành mục tiêu**: tìm + chọn ngành, xem điểm chuẩn gần nhất, chênh lệch với điểm hiện tại, bảng lịch sử theo từng năm có dữ liệu thật (không nội suy/bịa năm thiếu).
- **Dùng làm mục tiêu**: nút trên mỗi cutoff/biên mục tiêu gọi thẳng `setTargetScore`, TargetSection (Phase 3) tự tính lại `calculateRequiredDgnl`.
- **Biên mục tiêu**: cộng thêm 0/0.5/1/2 điểm vào cutoff để mô phỏng, có disclaimer không phải mức "an toàn tuyệt đối".
- **So sánh ngành**: pin tối đa 3 ngành ([src/lib/programs.ts](src/lib/programs.ts) `addProgramToComparison`), có sort theo điểm/tên.
- **Share URL**: mở rộng `urlState.ts` với `program`, `buffer`, `compare` (id không tồn tại bị bỏ qua, không crash).

## Giới hạn hiện tại

- Điểm ưu tiên khu vực/đối tượng đang nhập trực tiếp theo thang 30 (`priorityRaw30Scale`, 0 → 2.75) thay vì chọn Khu vực/Đối tượng ưu tiên qua dropdown, vì project chưa có bảng mapping đối tượng ưu tiên chính xác từ HCMUT.
- Học bạ chưa xử lý trường hợp thí sinh đổi môn trong tổ hợp giữa lớp 10/11/12 (hiển thị note nhắc thí sinh đối chiếu quy định riêng).
- localStorage dùng key `hcmut-score-input-v2` + `hcmut-score-target-v1` + `hcmut-score-program-v1`; dữ liệu từ schema cũ (MVP, key `hcmut-score-calculator:input:v1`) không được migrate tự động.
- Dataset ngành/điểm chuẩn mới có 29/70+ chương trình, chỉ 4 ngành có đủ 2025+2026 để so sánh lịch sử có ý nghĩa; các chương trình tiên tiến/chuyển tiếp quốc tế có note vì tiêu chí xét tuyển có thể khác chuẩn 3 thành phần.
- Chưa có: database ngành động, biểu đồ, AI recommendation, xác suất trúng tuyển, login, server, analytics.
