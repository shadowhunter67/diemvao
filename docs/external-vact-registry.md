# Registry các trường ngoài ĐHQG-HCM dùng V-ACT (ĐGNL ĐHQG-HCM)

Khởi tạo 2026-08-11. Đây là **registry theo dõi tiến độ research**, không phải kết quả research
đầy đủ — hầu hết các trường dưới đây **CHƯA được research chi tiết** trong batch này (chỉ trừ 4
trường ĐHQG-HCM đã có mục riêng: HCMUT, UIT, UEL đã implement; HCMUS/USSH đã research nhưng
blocked, xem `admission-research-2026.md`).

Không dùng cột `status: supported/unsupported` — mỗi trường có thể đạt các mức capability khác
nhau độc lập với nhau (xem `core/schoolModule.ts` phần ghi chú hướng capability model).

## Nguồn tổng hợp ưu tiên

Trung tâm Khảo thí & Đánh giá Chất lượng Đào tạo — ĐHQG-HCM là nguồn công bố danh sách chính thức
các cơ sở sử dụng kết quả V-ACT. Ghi nhận nội bộ (chưa re-verify trong batch này, cần admin
cập nhật khi có nguồn mới):

> Khoảng 118 cơ sở ĐH/CĐ trên cả nước sử dụng V-ACT 2026 (khoảng 99 ngoài hệ thống ĐHQG-HCM);
> trong phạm vi TP.HCM + Đông Nam Bộ + ĐBSCL, khoảng 50 cơ sở đã được lọc sơ bộ. Con số này
> KHÔNG phải invariant — admin cần cập nhật khi có công bố mới, không hard-code vào UI.

## Bảng theo dõi (10 trường ưu tiên nghiên cứu tiếp)

| # | Trường | usesVact | formulaStatus | cutoffStatus | eligibilityStatus | sourceQuality | calculatorWorthBuilding | primarySources | blockers |
|---|--------|----------|----------------|--------------|--------------------|----------------|--------------------------|-----------------|----------|
| 1 | ĐH Mở TP.HCM (OU) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | ou.edu.vn (chưa fetch) | Chưa bắt đầu research |
| 2 | ĐH Kinh tế TP.HCM (UEH) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | ueh.edu.vn (chưa fetch) | Chưa bắt đầu research |
| 3 | ĐH Công nghiệp TP.HCM (IUH) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | iuh.edu.vn (chưa fetch) | Chưa bắt đầu research |
| 4 | ĐH Nông Lâm TP.HCM (HCMUAF) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | hcmuaf.edu.vn (chưa fetch) | Chưa bắt đầu research |
| 5 | ĐH Kinh tế - Tài chính TP.HCM (EIU/UEF — cần làm rõ viết tắt) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | (chưa xác định domain chính thức) | Chưa bắt đầu research, cần làm rõ trường viết tắt EIU hay UEF trước |
| 6 | ĐH Công nghệ TP.HCM (HUTECH) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | hutech.edu.vn (chưa fetch) | Chưa bắt đầu research |
| 7 | ĐH Nguyễn Tất Thành (NTTU) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | ntt.edu.vn (chưa fetch) | Chưa bắt đầu research |
| 8 | ĐH Tài chính - Marketing (UFM) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | ufm.edu.vn (chưa fetch) | Chưa bắt đầu research |
| 9 | ĐH Tôn Đức Thắng (TDTU) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | tdtu.edu.vn (chưa fetch) | Chưa bắt đầu research |
| 10 | ĐH Sư phạm Kỹ thuật TP.HCM (HCM-UTE) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | hcmute.edu.vn (chưa fetch) | Chưa bắt đầu research |

Ghi chú: `SGU` và "các trường Đông Nam Bộ/ĐBSCL còn lại" (mục 21 trong yêu cầu batch gốc) chưa
đưa vào bảng theo dõi — cần một vòng research/liệt kê riêng trước khi thêm dòng, để tránh bảng
registry có tên trường nhưng không ai theo dõi tiến độ.

## Quy trình khi research một trường trong bảng trên

1. Xác nhận `usesVact` từ nguồn chính thức của trường (không chỉ dựa vào danh sách tổng hợp của
   Trung tâm Khảo thí — cross-check với thông báo tuyển sinh riêng của trường).
2. Research đủ 15 câu hỏi như đã áp dụng cho UEL/HCMUS/USSH (xem đầu file
   `admission-research-2026.md`): thành phần, quy đổi, môn hệ số, điểm cộng, ưu tiên, chứng chỉ
   quốc tế, thang điểm, ngưỡng/cutoff theo ngành.
3. Điền đủ 7 cột trong bảng trên, KHÔNG để trống `blockers` nếu formula/cutoff chưa đủ.
4. Chỉ implement calculator khi `formulaStatus` + `cutoffStatus` đều đủ nguồn — matching nguyên
   tắc "đúng dữ liệu > nhiều calculator" xuyên suốt dự án.
