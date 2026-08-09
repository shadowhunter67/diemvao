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
├── lib/            # calculator.ts (tính điểm), validation.ts (kiểm tra input)
├── types/          # admission.ts (kiểu dữ liệu business), form.ts (state form dạng string)
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

## Giới hạn hiện tại

- Điểm ưu tiên khu vực/đối tượng đang nhập trực tiếp theo thang 30 (`priorityRaw30Scale`, 0 → 2.75) thay vì chọn Khu vực/Đối tượng ưu tiên qua dropdown, vì project chưa có bảng mapping đối tượng ưu tiên chính xác từ HCMUT.
- Học bạ chưa xử lý trường hợp thí sinh đổi môn trong tổ hợp giữa lớp 10/11/12 (hiển thị note nhắc thí sinh đối chiếu quy định riêng).
- localStorage dùng key `hcmut-score-input-v2`; dữ liệu từ schema cũ (MVP, key `hcmut-score-calculator:input:v1`) không được migrate tự động.
- Chưa có: điểm chuẩn các ngành, tính ngược mục tiêu, so sánh ngành, chart.
