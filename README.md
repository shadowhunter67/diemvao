# UniscoreVN

Công cụ tính & so sánh điểm xét tuyển đại học Việt Nam — nhập điểm một lần, xem kết quả ở nhiều trường cùng lúc.

**[uniscorevn.vercel.app](https://uniscorevn.vercel.app)** · [GitHub](https://github.com/shadowhunter67/uniscorevn) · [Báo lỗi & góp ý](https://github.com/shadowhunter67/uniscorevn/issues)

> UniscoreVN là công cụ độc lập, không thuộc trường đại học nào. Kết quả chỉ mang tính tham khảo, không đảm bảo trúng tuyển.

## Giới thiệu

UniscoreVN tính điểm xét tuyển theo đúng công thức từng trường, đặt mục tiêu điểm số, mô phỏng kịch bản, và so sánh với điểm chuẩn tham khảo — chạy hoàn toàn trên trình duyệt, không backend, không cần đăng nhập.

Mỗi công thức đều gắn nguồn dữ liệu chính thức cụ thể. Phần nào chưa đủ nguồn được ghi rõ là "chưa tính được" thay vì đoán số.

## Tính năng

- Tính điểm xét tuyển realtime từ điểm ĐGNL, THPT, học bạ, điểm cộng, điểm ưu tiên
- So sánh cùng một hồ sơ trên nhiều trường qua [`/compare`](https://uniscorevn.vercel.app/compare)
- Quy đổi chứng chỉ ngoại ngữ quốc tế (IELTS/TOEFL/TOEIC...) sang điểm thi THPT
- Đặt mục tiêu điểm số, tính ngược ĐGNL cần đạt; mô phỏng kịch bản điểm giả định
- So sánh với điểm chuẩn tham khảo nhiều ngành, nhiều năm
- Nhập điểm một lần, dùng lại cho nhiều trường; chia sẻ kết quả qua URL, không cần tài khoản
- Tự lưu điểm đã nhập trên trình duyệt (không gửi lên server)

## Tiến độ tích hợp trường đại học toàn quốc

```
███░░░░░░░░░░░░░░░░░░░░░░░░░░  27 / 238 (~11%)
```

Mẫu số 238 là số cơ sở giáo dục đại học cả nước theo báo cáo Bộ GD&ĐT, tính đến 09/2025 ([nguồn](https://veci.edu.vn/nam-2025-ca-nuoc-co-238-co-so-giao-duc-dai-hoc-gan-1-200-co-so-giao-duc-nghe-nghiep/)) — số liệu tổng hợp thứ cấp, có thể lệch nhẹ so với con số mới nhất, không tính 20 trường cao đẳng sư phạm riêng.

**Chưa bao gồm cao đẳng.** Thống kê công khai chỉ có "~1.163 cơ sở giáo dục nghề nghiệp" gộp chung cao đẳng/trung cấp/trung tâm, không tách được số trường cao đẳng cụ thể để đặt mẫu số đáng tin cậy — xem `docs/vietnam-schools-directory.md` mục 5 (danh sách cao đẳng tự biết là chưa đầy đủ).

## Trường đang hỗ trợ (27)

| Trường | Trạng thái |
|---|---|
| HCMUT, UEH, UEL, HCMUS, USSH, IU, TDTU, HUFLIT, UMP, UFM, IUH, FTU | ✅ Tính điểm chính xác |
| HUTECH, HCMULAW | ✅ Chính xác một phần phương thức, phần còn lại đang bổ sung |
| UIT, UHS, AGU, HCMUE, HCMUTE, VLU, PTIT, NEU, HUB, HUIT, NTTU, HSU, UEF | 🟡 Kiểm tra điều kiện/ngưỡng, chưa có calculator chính xác |

"Chính xác" nghĩa là công thức, ngưỡng, điểm cộng và điểm ưu tiên đều có nguồn chính thức xác minh trong phạm vi đã công bố — một số trường chỉ chính xác trong phạm vi cụ thể (ví dụ thí sinh không có thành tích cộng điểm). Chi tiết từng trường, nguồn dữ liệu, và giới hạn hiện tại xem [docs/admission-research-2026.md](docs/admission-research-2026.md).

## Bắt đầu

```bash
npm install
npm run dev        # dev server
npm run test       # chạy test
npm run lint       # lint
npm run build      # build production
npm run audit:data # kiểm tra tính nhất quán/nguồn dữ liệu tuyển sinh
```

Trên Windows có thể double-click [start-dev.bat](start-dev.bat) — tự cài dependency nếu thiếu rồi mở dev server.

## Kiến trúc

Mỗi trường có công thức, thang điểm, và điều kiện xét tuyển riêng, sống độc lập trong `src/schools/<id>/` — không có "công thức chung" ép buộc. `src/core/` chỉ chứa phần thật sự dùng chung: hồ sơ điểm gốc của thí sinh, kiểu dữ liệu, và tiện ích tính toán. Thêm một trường mới không cần đụng vào phần lõi hay các trường khác.

Chi tiết cấu trúc thư mục, nguyên tắc thêm trường mới, và các quy tắc bắt buộc (nguồn dữ liệu, độ chính xác, kiểm thử) nằm ở [docs/architecture.md](docs/architecture.md).

## Deploy

Deploy qua Vercel (framework preset: Vite), domain canonical `uniscorevn.vercel.app`.

## Tài liệu thêm

- [docs/architecture.md](docs/architecture.md) — kiến trúc, model dữ liệu, quy tắc kỹ thuật bắt buộc
- [docs/admission-research-2026.md](docs/admission-research-2026.md) — research công thức từng trường
- [docs/data-maintainer-guide.md](docs/data-maintainer-guide.md) — quy trình thêm/cập nhật dữ liệu tuyển sinh
- [docs/release-checklist.md](docs/release-checklist.md) — quy trình release

