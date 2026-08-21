# Danh mục trường đại học/cao đẳng Việt Nam (tham khảo mở rộng)

> **Đây là danh sách THAM KHẢO/backlog, không phải cam kết implement.** Dùng để tra cứu nhanh khi
> cân nhắc mở rộng UniscoreVN sang trường mới, thay vì tìm lại từ đầu mỗi lần. Danh sách này
> **KHÔNG thay thế** quy trình research 12 bước ở `docs/data-maintainer-guide.md` khi thực sự bắt
> tay research/implement 1 trường — mọi mã trường, domain, công thức ở đây đều cần verify lại qua
> nguồn chính thức trước khi đưa vào code.

## 0. Đã implement trong UniscoreVN (27 trường — KHÔNG phải backlog)

Các trường dưới đây đã có module thật trong `src/schools/<id>/`, đăng ký ở
`src/schools/index.ts`. Liệt kê lại ở đây chỉ để tránh nhầm lẫn khi đọc phần backlog bên dưới.

| Tên trường | id | Module |
|---|---|---|
| Đại học Bách khoa – ĐHQG-HCM | hcmut | `src/schools/hcmut/` |
| Đại học Công nghệ Thông tin – ĐHQG-HCM | uit | `src/schools/uit/` |
| Đại học Kinh tế – Luật – ĐHQG-HCM | uel | `src/schools/uel/` |
| Đại học Kinh tế TP.HCM | ueh | `src/schools/ueh/` |
| Đại học Khoa học Tự nhiên – ĐHQG-HCM | hcmus | `src/schools/hcmus/` |
| Đại học Khoa học Xã hội và Nhân văn – ĐHQG-HCM | ussh | `src/schools/ussh/` |
| Đại học Khoa học Sức khỏe – ĐHQG-HCM | uhs | `src/schools/uhs/` |
| Đại học Quốc tế – ĐHQG-HCM | iu | `src/schools/iu/` |
| Đại học An Giang – ĐHQG-HCM | agu | `src/schools/agu/` |
| Đại học Sư phạm TP.HCM | hcmue | `src/schools/hcmue/` |
| Đại học Sư phạm Kỹ thuật TP.HCM | hcmute | `src/schools/hcmute/` |
| Đại học Tôn Đức Thắng | tdtu | `src/schools/tdtu/` |
| Đại học Ngoại ngữ – Tin học TP.HCM | huflit | `src/schools/huflit/` |
| Đại học Công nghệ TP.HCM | hutech | `src/schools/hutech/` |
| Đại học Tài chính – Marketing | ufm | `src/schools/ufm/` |
| Đại học Ngân hàng TP.HCM | hub | `src/schools/hub/` |
| Đại học Công Thương TP.HCM | huit | `src/schools/huit/` |
| Đại học Nguyễn Tất Thành | nttu | `src/schools/nttu/` |
| Đại học Hoa Sen | hsu | `src/schools/hsu/` |
| Đại học Kinh tế – Tài chính TP.HCM | uef | `src/schools/uef/` |

| Đại học Ngân hàng TP.HCM | hub | `src/schools/hub/` |
| Đại học Ngoại thương | ftu | `src/schools/ftu/` |
| Đại học Kinh tế Quốc dân | neu | `src/schools/neu/` |
| Học viện Công nghệ Bưu chính Viễn thông | ptit | `src/schools/ptit/` |
| Đại học Công nghiệp TP.HCM | iuh | `src/schools/iuh/` |
| Đại học Luật TP.HCM | hcmulaw | `src/schools/hcmulaw/` |
| Đại học Y Dược TP.HCM | ump | `src/schools/ump/` |
| Đại học Văn Lang | vlu | `src/schools/vlu/` |

`src/schools/index.ts` vẫn là nguồn sự thật đầy đủ nếu bảng này lệch — cập nhật thủ công, có thể trễ.

Toàn bộ 8 trường thành viên của ĐHQG-HCM (Bách khoa, CNTT, Kinh tế-Luật, KHTN, KHXH&NV, Khoa học
Sức khỏe, Quốc tế, An Giang) đã được implement — không còn backlog "trường ĐHQG-HCM còn thiếu".

---

## 1. Tier 1 — Ưu tiên cao (TP.HCM / Đông Nam Bộ, chưa implement)

Tiêu chí theo `docs/data-maintainer-guide.md` mục ROI: **source clarity + user value**, không phải
độ nổi tiếng. Các trường dưới đây được xếp Tier 1 vì cùng khu vực địa lý/hệ sinh thái tuyển sinh
với 15 trường đã có (nhiều khả năng đề án tuyển sinh công khai rõ ràng, quy đổi điểm tương tự các
trường đã làm), và có quy mô tuyển sinh/độ quan tâm lớn. **Mã trường trong bảng lấy từ nguồn tổng
hợp thứ cấp (tuyensinh247), CHƯA cross-check với thông báo tuyển sinh chính thức của từng
trường/Bộ GD&ĐT — bắt buộc verify lại khi thực sự research.**

| Tên trường | Viết tắt | Mã trường* | Tỉnh/TP | Domain tuyển sinh (chưa verify) | Loại hình |
|---|---|---|---|---|---|
| Đại học Sài Gòn | SGU | SGD | TP.HCM | sgu.edu.vn | Công lập (trực thuộc TP.HCM) |
| Đại học Gia Định | GDU | GDU | TP.HCM | tuyensinh.giadinh.edu.vn | Tư thục |
| Đại học Quốc tế Hồng Bàng | HIU | HIU | TP.HCM | tuyensinh.hiu.vn | Tư thục |
| Đại học Công nghệ Sài Gòn | STU | DSG | TP.HCM | stu.edu.vn | Tư thục |
| Đại học Y khoa Phạm Ngọc Thạch | PNTU | TYS | TP.HCM | pnt.edu.vn | Công lập (trực thuộc TP.HCM) |
| Đại học Thủ Dầu Một | TDMU | TDM | Bình Dương | tuyensinh.tdmu.edu.vn | Công lập (trực thuộc tỉnh) |
| Đại học Bình Dương | BDU | DBD | Bình Dương | tuyensinh.bdu.edu.vn | Tư thục |
| Đại học Lạc Hồng | LHU | DLH | Đồng Nai | tuyensinh.lhu.edu.vn | Tư thục |
| Đại học Nông Lâm TP.HCM | NLU | NLS | TP.HCM | tuyensinh.hcmuaf.edu.vn | Công lập (Bộ NN&MT) |
| Đại học Kiến trúc TP.HCM | UAH | KTS | TP.HCM | uah.edu.vn | Công lập (Bộ Xây dựng) |
| Đại học Giao thông vận tải TP.HCM | UT-HCMC | UTH | TP.HCM | tuyensinh.ut.edu.vn | Công lập (Bộ Xây dựng) |
| Học viện Hàng không Việt Nam | VAA | HHK | TP.HCM | vaa.edu.vn | Công lập (Bộ Xây dựng) |
| Đại học Tài nguyên và Môi trường TP.HCM | HCMUNRE | DTM | TP.HCM | hcmunre.edu.vn | Công lập (Bộ NN&MT) |
| Đại học Mở TP.HCM | OU / HUTECH-OU | MBS | TP.HCM | tuyensinh.ou.edu.vn | Công lập (Bộ GD&ĐT) |

\* Mã trường: xem lưu ý ở đầu mục — cần verify lại trước khi dùng.

---

## 2. Tier 2 — Miền Bắc (chưa implement, chưa xếp ưu tiên gần)

Nhóm theo cụm cơ sở giáo dục lớn (ĐHQG Hà Nội, đại học vùng, đại học trực thuộc bộ ngành, tư
thục). Domain phần lớn chưa tra — cần research khi chọn implement.

| Tên trường | Khu vực | Ghi chú |
|---|---|---|
| ĐHQG Hà Nội — ĐH Công nghệ, ĐH Kinh tế, ĐH Khoa học Tự nhiên, ĐH KHXH&NV, ĐH Ngoại ngữ, ĐH Giáo dục, ĐH Y Dược, ĐH Việt Nhật, ĐH Luật, Trường Quản trị và Kinh doanh, Trường Quốc tế | Hà Nội | 12 đơn vị thành viên/trực thuộc |
| Đại học Bách khoa Hà Nội | Hà Nội | Đại học liên ngành (multi-school) |
| Đại học Kinh tế Quốc dân | Hà Nội | |
| Đại học Ngoại thương | Hà Nội | Bộ GD&ĐT |
| Đại học Thương mại | Hà Nội | Bộ GD&ĐT |
| Đại học Xây dựng Hà Nội | Hà Nội | Bộ GD&ĐT |
| Đại học Giao thông Vận tải (Hà Nội) | Hà Nội | Bộ GD&ĐT |
| Đại học Mỏ – Địa chất | Hà Nội | Bộ GD&ĐT |
| Đại học Mở Hà Nội | Hà Nội | Bộ GD&ĐT |
| Đại học Hà Nội (HANU) | Hà Nội | Bộ GD&ĐT, đào tạo ngoại ngữ |
| Đại học Công nghiệp Hà Nội | Hà Nội | Đại học liên ngành |
| Đại học Sư phạm Hà Nội | Hà Nội | Bộ GD&ĐT |
| Đại học Sư phạm Hà Nội 2 | Phú Thọ | Bộ GD&ĐT |
| Học viện Tài chính | Hà Nội | Bộ Tài chính |
| Học viện Ngân hàng | Hà Nội | NHNN |
| Học viện Nông nghiệp Việt Nam | Hà Nội | Bộ NN&MT |
| Học viện Công nghệ Bưu chính Viễn thông | Hà Nội | |
| Học viện Ngoại giao | Hà Nội | |
| Học viện Báo chí và Tuyên truyền | Hà Nội | |
| Đại học Luật Hà Nội | Hà Nội | |
| Đại học Y Hà Nội | Hà Nội | Bộ Y tế |
| Đại học Dược Hà Nội | Hà Nội | Bộ Y tế |
| Đại học Thủy lợi | Hà Nội | Bộ NN&MT |
| Đại học Lâm nghiệp | Hà Nội | Bộ NN&MT |
| Đại học Thăng Long | Hà Nội | Tư thục |
| Đại học FPT | Hà Nội (đa cơ sở) | Tư thục |
| Đại học VinUni | Hà Nội | Tư thục |
| Đại học Kinh doanh và Công nghệ Hà Nội | Hà Nội | Tư thục |
| Đại học Đại Nam | Hà Nội | Tư thục |
| Đại học Phenikaa | Hà Nội | Tư thục, đại học liên ngành |
| Đại học Thái Nguyên (đại học vùng) | Thái Nguyên | 7+ trường thành viên |
| Đại học Hải Phòng | Hải Phòng | Trực thuộc TP |
| Đại học Hàng hải Việt Nam | Hải Phòng | Bộ Xây dựng |
| Đại học Y Dược Hải Phòng | Hải Phòng | Bộ Y tế |
| Đại học Hồng Đức | Thanh Hóa | Trực thuộc tỉnh |
| Đại học Vinh | Nghệ An | Bộ GD&ĐT |
| Đại học Hà Tĩnh | Hà Tĩnh | Trực thuộc tỉnh |
| Đại học Hạ Long | Quảng Ninh | Trực thuộc tỉnh |
| Đại học Tân Trào | Tuyên Quang | Trực thuộc tỉnh |
| Đại học Hùng Vương | Phú Thọ | Trực thuộc tỉnh |

*(Danh sách miền Bắc chưa liệt kê hết — còn nhiều trường tư thục/địa phương nhỏ hơn không nêu ở
đây, xem nguồn Wikipedia mục cuối file.)*

## 3. Tier 2 — Miền Trung & Tây Nguyên

| Tên trường | Khu vực | Ghi chú |
|---|---|---|
| Đại học Huế (đại học vùng) | Huế | 8+ trường/khoa thành viên (Khoa học, Kinh tế, Luật, Nông Lâm, Sư phạm, Y Dược, Ngoại ngữ, Du lịch...) |
| Đại học Đà Nẵng (đại học vùng) | Đà Nẵng | Bách khoa, Kinh tế, Sư phạm, Ngoại ngữ, Sư phạm Kỹ thuật, CNTT-TT Việt-Hàn... |
| Đại học Duy Tân | Đà Nẵng | Tư thục |
| Đại học Đông Á | Đà Nẵng | Tư thục |
| Đại học Nha Trang | Khánh Hòa | Bộ GD&ĐT |
| Đại học Đà Lạt | Lâm Đồng | Bộ GD&ĐT |
| Đại học Quy Nhơn | Gia Lai (Bình Định cũ) | Bộ GD&ĐT |
| Đại học Tây Nguyên | Đắk Lắk | Bộ GD&ĐT |
| Đại học Quảng Nam | Đà Nẵng (Quảng Nam cũ) | Trực thuộc tỉnh |
| Đại học Quảng Bình | Quảng Trị (Quảng Bình cũ) | Trực thuộc tỉnh |
| Đại học Phạm Văn Đồng | Quảng Ngãi | Trực thuộc tỉnh |
| Đại học Phú Yên | Đắk Lắk (Phú Yên cũ) | Trực thuộc tỉnh |
| Đại học Khánh Hòa | Khánh Hòa | Trực thuộc tỉnh |
| Đại học Xây dựng Miền Trung | Đắk Lắk (Phú Yên cũ) | Bộ Xây dựng |
| Đại học Y Dược Buôn Ma Thuột | Đắk Lắk | Tư thục |
| Đại học Kỹ thuật Y Dược Đà Nẵng | Đà Nẵng | Bộ Y tế |
| Đại học Phan Châu Trinh | Đà Nẵng | Tư thục |
| Đại học Yersin Đà Lạt | Lâm Đồng | Tư thục |
| Đại học Phan Thiết | Lâm Đồng (Bình Thuận cũ) | Tư thục |

## 4. Tier 2 — Miền Nam khác (ngoài TP.HCM, ngoài Tier 1)

| Tên trường | Khu vực | Ghi chú |
|---|---|---|
| Đại học Cần Thơ (đại học vùng) | Cần Thơ | Kinh tế, Nông nghiệp, Bách khoa, CNTT-TT, Thủy sản, Sư phạm, KHTN + cơ sở Hậu Giang/Sóc Trăng |
| Đại học Y Dược Cần Thơ | Cần Thơ | Bộ Y tế |
| Đại học Kỹ thuật – Công nghệ Cần Thơ | Cần Thơ | Trực thuộc TP |
| Đại học Nam Cần Thơ | Cần Thơ | Tư thục |
| Đại học Tây Đô | Cần Thơ | Tư thục |
| Đại học Trà Vinh | Trà Vinh | Đại học liên ngành |
| Đại học Đồng Tháp | Đồng Tháp | Bộ GD&ĐT |
| Đại học Tiền Giang | Đồng Tháp (Tiền Giang cũ) | Trực thuộc tỉnh |
| Đại học Kiên Giang | An Giang (Kiên Giang cũ) | Bộ GD&ĐT |
| Đại học Bạc Liêu | Cà Mau (Bạc Liêu cũ) | Trực thuộc tỉnh |
| Đại học Đồng Nai | Đồng Nai | Trực thuộc tỉnh |
| Đại học Bà Rịa – Vũng Tàu | Bà Rịa – Vũng Tàu (nay TP.HCM/Đồng Nai theo sáp nhập) | Tư thục |
| Đại học Cửu Long | Vĩnh Long | Tư thục |
| Đại học Tân Tạo | Tây Ninh (Long An cũ) | Tư thục |
| Đại học Kinh tế Công nghiệp Long An | Tây Ninh (Long An cũ) | Tư thục |
| Đại học Dầu khí Việt Nam | TP.HCM/Bà Rịa-Vũng Tàu | |

*(Ranh giới tỉnh/thành ghi theo đơn vị hành chính cũ ở một số dòng vì nguồn gốc chưa cập nhật sáp
nhập 2025 — cần verify lại địa giới hiện hành khi dùng.)*

---

## 5. Cao đẳng (danh sách RÚT GỌN, chưa đầy đủ)

**Lưu ý quan trọng: danh sách cao đẳng dưới đây CHƯA ĐẦY ĐỦ.** Việt Nam có hàng trăm trường cao
đẳng (bao gồm cao đẳng nghề, cao đẳng sư phạm, cao đẳng y tế... ở hầu hết các tỉnh); các nguồn tổng
hợp tìm được (reviewedu.net, trangedu.com, thongtintuyensinh.vn) không đủ độ tin cậy/độ phủ để
liệt kê hết mà không có rủi ro bịa thêm cho đủ số. Danh sách dưới đây chỉ gồm các trường cao đẳng
phổ biến, được nhắc tới nhất quán qua nhiều nguồn — dùng để biết tồn tại, KHÔNG dùng để tra domain
chính xác (chưa verify).

**Miền Bắc:**
- Cao đẳng FPT Polytechnic (Hà Nội, đa cơ sở)
- Cao đẳng Du lịch Hà Nội
- Cao đẳng nghề Công nghiệp Hà Nội
- Cao đẳng Y tế Hà Nội
- Cao đẳng Kinh tế Công nghiệp Hà Nội

**Miền Trung & Tây Nguyên:**
- Cao đẳng Công nghệ Y Dược Việt Nam (cơ sở Đà Nẵng)
- Cao đẳng Đại Việt Đà Nẵng
- Cao đẳng Du lịch Huế
- Cao đẳng Công nghiệp Huế

**Miền Nam:**
- Cao đẳng Kinh tế Đối ngoại (TP.HCM)
- Cao đẳng Kỹ thuật Cao Thắng (TP.HCM)
- Cao đẳng Công Thương TP.HCM
- Cao đẳng Đại Việt Sài Gòn (TP.HCM)
- Cao đẳng Viễn Đông (TP.HCM)
- Cao đẳng FPT Polytechnic TP.HCM
- Cao đẳng Bách khoa Sài Gòn (TP.HCM)
- Cao đẳng Cần Thơ

Nguồn cho mục cao đẳng: reviewedu.net "Danh sách các trường Cao Đẳng Việt Nam", trangedu.com,
thongtintuyensinh.vn (các trang tổng hợp theo khu vực) — không phải nguồn Bộ GD&ĐT chính thức.

---

## Ghi chú compile

- **Ngày compile:** 2026-08-19.
- **Nguồn chính:**
  - Wikipedia tiếng Việt — "Danh sách trường đại học, học viện và cao đẳng tại Việt Nam"
    (https://vi.wikipedia.org/wiki/Danh_sách_trường_đại_học,_học_viện_và_cao_đẳng_tại_Việt_Nam) —
    dùng cho cấu trúc phân nhóm đại học theo cơ quan chủ quản/khu vực (mục 1–4).
  - tuyensinh247.com "Mã trường Đại học - Mã ngành - Tổ hợp xét tuyển" — dùng cho mã trường 3 ký tự
    ở Tier 1 (TP.HCM), **chưa cross-check với Bộ GD&ĐT/website từng trường**.
  - reviewedu.net, trangedu.com, thongtintuyensinh.vn — dùng tham khảo mục cao đẳng (rút gọn, chưa
    đầy đủ, xem lưu ý mục 5).
  - Không truy cập trực tiếp được moet.gov.vn trong lần compile này (không tìm ra trang danh mục mã
    trường công khai ổn định) — nếu cần mã trường chính xác tuyệt đối, tra lại trực tiếp qua Cổng
    thông tin tuyển sinh của Bộ GD&ĐT hoặc website tuyển sinh chính thức của từng trường tại thời
    điểm research.
- **Phạm vi:** ~140 trường đại học/học viện được nêu tên (mục 0–4, kể cả các trường thành viên của
  ĐHQG/đại học vùng/đại học liên ngành), ~13 trường cao đẳng tiêu biểu (mục 5, KHÔNG đầy đủ).
- **Chưa đầy đủ / cần lưu ý khi dùng:**
  - Mã trường 3 ký tự ở Tier 1 lấy từ nguồn tổng hợp thứ cấp, có rủi ro sai — bắt buộc verify khi
    research thật.
  - Domain tuyển sinh ở Tier 1 là suy đoán theo pattern phổ biến (`tuyensinh.<domain-chính>`),
    **CHƯA fetch/verify từng domain** — một số có thể sai hoặc đã đổi.
  - Ranh giới tỉnh/thành ở một số dòng ghi theo đơn vị hành chính trước sáp nhập 2025, vì nguồn gốc
    Wikipedia chưa cập nhật đầy đủ.
  - Danh sách trường quân đội, công an, dự bị đại học, trường nước ngoài tại Việt Nam KHÔNG đưa vào
    file này (nằm ngoài phạm vi UniscoreVN — không xét tuyển theo phương thức dân sự thông thường).
  - Danh sách cao đẳng chưa đầy đủ như đã ghi rõ ở mục 5.
- **Cách dùng:** khi muốn mở rộng UniscoreVN sang 1 trường trong danh sách này, coi đây là điểm
  khởi đầu tra cứu nhanh, sau đó BẮT BUỘC chạy lại quy trình research 12 bước ở
  `docs/data-maintainer-guide.md` (source clarity, verification level, formula evidence...) trước
  khi viết bất kỳ code nào.
