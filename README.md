# HCMUT Score Calculator

Công cụ tính điểm xét tuyển Đại học Bách khoa – ĐHQG TP.HCM. Tính hoàn toàn phía client (không backend, không database, không đăng nhập), realtime khi người dùng nhập điểm.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Có thể import repository trực tiếp vào Vercel (framework preset: Vite).

## Cấu trúc project

```text
src/
├── components/     # UI thuần, không chứa công thức tính điểm
├── config/         # Trọng số công thức theo từng năm tuyển sinh
├── lib/            # calculator.ts (tính điểm), validation.ts (kiểm tra input)
├── types/          # Định nghĩa kiểu dữ liệu dùng chung
├── App.tsx         # State + localStorage
└── main.tsx
```

## Cập nhật công thức tuyển sinh

Trọng số và giới hạn điểm cộng/ưu tiên nằm ở [src/config/admission-2026.ts](src/config/admission-2026.ts). Để thêm năm tuyển sinh mới, tạo file `src/config/admission-<năm>.ts` theo cùng cấu trúc `AdmissionConfig` rồi trỏ `activeAdmissionConfig` sang file mới — không cần sửa UI hay logic tính toán.

Logic tính điểm nằm ở [src/lib/calculator.ts](src/lib/calculator.ts), nhận `ScoreInput` (điểm đã quy đổi về thang 100) và `AdmissionConfig`, trả về breakdown đầy đủ từng thành phần.

## Giới hạn hiện tại (MVP)

Điểm ĐGNL, THPT, học bạ nhập vào là điểm **đã được quy đổi về thang 100**. Công thức quy đổi chi tiết từ điểm gốc (ví dụ điểm ĐGNL thô, điểm thi THPT thô) chưa được triển khai vì chưa có nguồn chính thức từ HCMUT — sẽ bổ sung dưới dạng các hàm `convertDgnlScore`, `convertThptScore`, `convertTranscriptScore` trong `src/lib/` khi có công thức chính thức, mà không cần thay đổi kiến trúc.
