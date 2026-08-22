# Research tuyển sinh 2026 — UniscoreVN

Research phục vụ quyết định trường/công thức nào đủ điều kiện implement calculator trong UniscoreVN. Nguyên tắc: **research trước, code sau; không suy đoán công thức; official source luôn ưu tiên cao nhất**. Ngày research: 2026-08-10.

Thứ tự ưu tiên nguồn: (1) website tuyển sinh chính thức của trường → (2) website chính thức trường → (3) website ĐHQG-HCM → (4) đề án tuyển sinh chính thức → (5) thông báo tuyển sinh/điểm chuẩn chính thức → (6) PDF/ảnh từ trường → (7) báo chí uy tín (chỉ cross-check hoặc đọc bảng khó truy cập, không dùng làm nguồn chính duy nhất). Không dùng: blog SEO, forum, Facebook cá nhân, trang tổng hợp không dẫn nguồn, Google snippet không có link xác minh được.

## Phần A — HCMUT: mở rộng nhóm thí sinh

HCMUT 2026 định nghĩa **8 "đối tượng" (2.1–2.8)** trong phương thức Xét tuyển Tổng hợp, gộp thành 5 nhóm UI trong UniscoreVN:

| Đối tượng HCMUT | Nhóm UI UniscoreVN | Công thức | Trạng thái |
|---|---|---|---|
| 2.1 — có ĐGNL ĐHQG-HCM 2026 | `dgnl` | Điểm năng lực = ĐGNL chuẩn hóa (không đổi, hành vi cũ) | ✅ Supported |
| 2.2 — không có ĐGNL | `no-dgnl` | Điểm năng lực = Điểm THPT quy đổi × **0.75** | ✅ Supported (mới) |
| 2.4 — có chứng chỉ quốc tế (SAT/ACT/IB/A-Level) | `international-certificate` | Có "Bảng quy đổi chứng chỉ tuyển sinh quốc tế, thang 100" theo đề án, nhưng chưa lấy được bảng số liệu cụ thể | ⏳ Chưa hỗ trợ |
| 2.3 — tốt nghiệp THPT nước ngoài | `foreign-high-school` | Chưa tìm được công thức | ⏳ Chưa hỗ trợ |
| 2.5–2.8 — chương trình đặc thù/TNE/chuyển tiếp quốc tế | `special-program` | Công thức riêng theo chương trình, chưa research | ⏳ Chưa hỗ trợ |

### Nguồn — Đối tượng 2.2 (không ĐGNL)

- **Công thức**: `Điểm năng lực = Điểm TNTHPT quy đổi × 0.75`, trong đó `Điểm TNTHPT quy đổi = (Toán×2 + Môn2 + Môn3) / 4 × 10` — **giống hệt** công thức "THPT chuẩn hóa" (thành phần 20%) đã có sẵn trong `calculator.ts` (`convertThptScore`), nên chỉ cần nhân thêm hệ số 0.75, không cần logic mới.
- Điểm học lực tổng thể **không đổi trọng số** (vẫn Điểm năng lực×70% + THPT×20% + Học bạ×10%) — đúng yêu cầu "không tự đổi trọng số/chia lại" của đề bài.
- **Nguồn đã dùng**:
  - Cross-check 1: VnExpress, "Cách tính điểm xét tuyển mới năm 2026 vào Trường Đại học Bách khoa TPHCM" (dantri.com.vn, xác nhận công thức tổng "Điểm năng lực×70%+THPT×20%+Học bạ×10%" và có nhắc quy đổi SAT nhưng không có bảng).
  - Cross-check 2: `diemthi.tuyensinh247.com/de-an-tuyen-sinh/dai-hoc-bach-khoa-hcm-QSB.html` — trang republish PDF Đề án tuyển sinh 2026 của HCMUT (link file gốc `images.tuyensinh247.com/picture/2026/0227/...`), xác nhận nguyên văn "Đối tượng 2.2: Thí sinh KHÔNG CÓ kết quả thi ĐGNL ĐHQG-HCM năm 2026" + công thức `[Điểm năng lực] = [Điểm TNTHPT quy đổi] × 0.75`.
  - **Hạn chế đã biết**: chưa fetch trực tiếp được PDF gốc trên `hcmut.edu.vn` (2 lần timeout khi WebFetch trang `hcmut.edu.vn/tintuc/cong-bo-thong-tin-tuyen-sinh-dai-hoc-chinh-quy-nam-2026`) — độ tin cậy dựa trên 2 nguồn độc lập cùng khớp số liệu 0.75, không phải đọc trực tiếp file PDF trường. Nếu có ai đọc được bản gốc, nên đối chiếu lại.
- **Chứng chỉ quốc tế (2.4)**: đề án có nhắc "Bảng quy đổi [Điểm chứng chỉ tuyển sinh quốc tế quy đổi], thang 100" với SAT/ACT/IB/A-Level nhưng research chưa lấy được giá trị bảng cụ thể — **không implement**, tránh suy đoán.
- **2.3, 2.5–2.8**: chỉ xác nhận được tên/mô tả nhóm, chưa có công thức — **không implement**, UI hiển thị "chưa hỗ trợ".

## Phần B — 8 trường thành viên ĐHQG-HCM

| Trường | Dùng ĐGNL? | Xét không ĐGNL? | Xét tổng hợp? | Trọng số (khi có ĐGNL) | Formula verified | Trạng thái UniscoreVN |
|---|---|---|---|---|---|---|
| **HCMUT** | Có | Có (0.75×THPT) | Có | ĐGNL 70% + THPT 20% + Học bạ 10% | ✅ true | **Supported** |
| **UIT** | Có | Có (THPT, kể cả quy đổi IB/A-Level) | Có | THPT 47,5% + ĐGNL 47,5% + Học bạ 5% | ✅ true (2 nguồn độc lập khớp) | Researching — ứng viên #1 |
| **UEL** | Có | Có (90% THPT+10% học bạ) | Có | ĐGNL 55% + THPT 35% + Học bạ 10% (đổi theo nhóm đối tượng) | ✅ true | Researching — ứng viên #2 |
| **HCMUS** | Có | Có (thay thế trực tiếp) | Có | 80% (THPT hoặc ĐGNL, chọn cao hơn) + 20% học bạ | ✅ true | Researching — ứng viên #3 |
| **USSH** | Có | Có (90% THPT+10% học bạ) | Có | 3 công thức theo đối tượng: 45/45/10, 90/10 (THPT), 90/10 (ĐGNL) | ✅ true (thiếu bảng điểm cộng/ưu tiên chi tiết) | Researching |
| **IU** | Có | Không xác định | Có | Cấu trúc `k1×THPT+k2×ĐGNL+k3×Học bạ` xác nhận được, **giá trị k1/k2/k3 mâu thuẫn giữa nguồn thứ cấp** | ❌ false | Formula-incomplete |
| **AGU** | Có | Có (chọn phương án có lợi) | Có | Cấu trúc `b1×THPT+b2×ĐGNL+b3×Học bạ` xác nhận, **giá trị cụ thể chỉ có ở nguồn thứ cấp** (tuyensinh247, không phải ưu tiên cao) | ❌ false | Formula-incomplete |
| **UHS** | Có | Không xác định | Có (phương thức duy nhất 2026) | Trọng số ghi rõ là **"dự kiến, chưa chính thức"** trên chính trang trường | ❌ false | Formula-incomplete |

Chi tiết đầy đủ 15 câu hỏi/trường (thành phần, quy đổi, môn hệ số, điểm cộng, ưu tiên, chứng chỉ quốc tế, IELTS/TOEFL, thang điểm, điều kiện/cutoff theo ngành) — xem log research gốc, tóm tắt trọng tâm:

- **UIT**: `Hs1(THPT) 47,5% + Hs2(ĐGNL) 47,5% + Hs3(học bạ) 5%`, thang 100. Điểm cộng ≤10/100 (huy chương Olympic/giải quốc gia). Có ngưỡng SAT≥1170-1200/ACT≥26/IB≥30/A-Level 70% PUM. Ngưỡng riêng ngành Thiết kế vi mạch cao hơn. Nguồn: `tuyensinh.uit.edu.vn` (thông báo ngưỡng chính thức) + Cổng TTĐT Chính phủ (cross-check trọng số, khớp VnExpress). **Research bổ sung 2026-08-10** (đọc trực tiếp toàn bộ 6 thông báo chính thức UIT do user cung cấp URL, xem `schools/uit/`):
  - Cấu trúc công thức đầy đủ hơn (Cổng TTĐT Chính phủ, đọc nguyên văn): `THPT = Max(THPT_ĐT, THPT_QĐ, THPT_QT)`, `ĐGNL = Max(ĐGNL_ĐT, ĐGNL_QĐ, ĐGNL_QT)`. Quy đổi THPT↔ĐGNL theo "phương pháp bách phân vị" — **có nêu tên phương pháp, KHÔNG có bảng/công thức cụ thể** → vẫn blocked cho exact calculator.
  - **Bảng điểm cộng đầy đủ** (thông báo 20/05/2026, đọc nguyên văn text — không phải ảnh): 4 nhóm, mỗi nhóm mức trần cố định 10/5/5/5, tổng cap 10/100. Nhóm 1 (Olympic quốc tế/HSG quốc gia/HSG Tỉnh-Thành) có bảng môn↔ngành loại trừ (KTMT + TKVM không Văn; TTĐPT không Hóa, có thêm Sử/Địa; 4 ngành Khoa học Dữ liệu/Mạng máy tính/HTTT/HTTT-tiên tiến có thêm Sinh; CNTT Việt Nhật có thêm Nhật). Nhóm 2 (OLP/VOAI), nhóm 3 (chứng chỉ ngoại ngữ IELTS≥5.0/TOEFL≥50/TOEIC 650+250/JLPT≥N3), nhóm 4 (149 trường THPT ưu tiên ĐHQG-HCM). Nguồn nói mỗi nhóm không có thang trượt theo hạng — đạt điều kiện là nhận trọn mức trần → ban đầu implement như bonus calculator trả thẳng điểm cộng (`schools/uit/bonus.ts`).
    - **2026-08-11 — hạ cấp xuống Bonus Eligibility Checker** (`calculateUitBonusEligibility`, xem `schools/uit/bonus.ts`): quyết định policy thận trọng, KHÔNG phải bằng chứng mới phủ định research trên. `maxPoints` từng nhóm nay chỉ dùng như upper bound hiển thị, không trả `awardedPoints`/tổng điểm cộng suy ra. Lý do: hồ sơ xét duyệt thật (minh chứng, hội đồng) có thể có bước xác nhận/điều chỉnh ngoài phạm vi 1 thông báo web đã đọc, nên UniscoreVN chọn under-claim thay vì hiển thị một con số cuối cùng có thể sai. Nếu sau này có thêm nguồn xác nhận quy trình xét duyệt không có bước điều chỉnh nào khác, có thể cân nhắc phục hồi lại exact bonus calculator.
  - **Ngưỡng chứng chỉ quốc tế: 2 tầng riêng biệt, khác mục đích** — ngưỡng đăng ký minh chứng (thông báo 20/05/2026, thấp hơn: SAT≥1080/ACT≥21/A-Level PUM≥67%/IB≥29) và ngưỡng đảm bảo chất lượng đầu vào (thông báo 08/07/2026, cao hơn: SAT≥1170/ACT≥26/A-Level≥70%/IB≥30) — đã implement `schools/uit/eligibility.ts` phân biệt rõ 2 kết quả, không gộp.
  - **Tuyển thẳng (Điều 8)**: route tuyển sinh tách biệt hoàn toàn khỏi combined-score, có bảng điều kiện môn/ngành riêng (thông báo 20/05/2026) — đã implement `schools/uit/data/directAdmission.ts`, hiển thị info-only, không cộng vào công thức.
  - **Điểm chuẩn 19 ngành**: đối chiếu lại dữ liệu đã lưu từ phase trước với nguồn gốc — khớp 100%, không sửa.
  - **Vẫn KHÔNG tìm được**: công thức bách phân vị cụ thể, cách tính điểm học bạ, cách ĐGNL_QT (SAT/ACT→ĐGNL) và THPT_QT (IB/A-Level→THPT) được tính — exact final-score calculator UIT tiếp tục không bật.
- **UEL**: `ĐGNL 55% + THPT 35% + Học bạ 10%` (nhóm đủ cả 2 loại điểm); nhóm chỉ 1 loại: 90%/10%. Bảng ưu tiên KV/ĐT đầy đủ trên thang 100 (KV1=9,17/KV2NT=8,33/KV2=7,5/KV3=6,67). Điểm cộng IELTS/TOEFL "theo Phụ lục 2" — chưa đọc được bảng. Có Phương thức 5 riêng cho SAT/ACT/IB/A-Level. Nguồn: `uel.edu.vn` + `tuyensinh.uel.edu.vn` (chính thức).
  - **Research bổ sung 2026-08-11** (đọc trực tiếp `tuyensinh.uel.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026/` + ảnh công bố điểm chuẩn gốc, xem `schools/uel/`):
    - Công thức đầy đủ theo Đối tượng: ĐT1 (có ĐGNL) = `X·β1 + Y·β2 + Z·β3`; ĐT2 (không ĐGNL) = `(Y·α)·β1 + Y·β2 + Z·β3` (α=100% → rút gọn = 90%Y + 10%Z); ĐT3 (chỉ ĐGNL, tự do) = `X·β1 + X·β2 + Z·β3` (= 90%X + 10%Z); ĐT4 = chứng chỉ quốc tế (SAT/ACT/IB/A-Level) quy đổi — **chưa có công thức quy đổi cụ thể, KHÔNG implement**.
    - Quy đổi thang 100: `X (ĐGNL) = raw × 100/1200`; `Y (THPT) = tổng 3 môn tổ hợp × 100/30`; `Z (học bạ) = tổng điểm TB 3 môn tổ hợp (mỗi môn = TB cả năm lớp 10+11+12) × 100/30`. **Đây là công thức normalization RÕ RÀNG HƠN UIT** (UIT chỉ nêu tên "phương pháp bách phân vị", không có công thức) — đã implement `schools/uel/eligibility.ts` (ngưỡng THPT ≥50/100) nhưng KHÔNG mở exact final-score calculator vì bảng điểm cộng ngoại ngữ còn thiếu vẫn có thể làm sai điểm cuối.
    - Ngưỡng đầu vào: tổng 3 môn THPT tổ hợp quy đổi thang 100 ≥ 50.
    - Điểm cộng: cap tổng 10/100 (xác nhận). Nhóm 149 trường THPT ưu tiên ĐHQG-HCM: **+5/100 cố định** (verified) — đã implement như bonus eligibility category (`schools/uel/data/bonus.ts`, cùng chính sách eligibility-only với UIT, không trả awarded score). Nhóm chứng chỉ ngoại ngữ quốc tế (IELTS≥5.0 tương đương): biết khoảng 2–5/100 (qua VnExpress dẫn "Phụ lục 2"), nhưng bảng chi tiết theo từng mức chứng chỉ nằm trong ảnh lazy-load không trích xuất được qua fetch tool — **KHÔNG implement như category có số cụ thể**, chỉ ghi chú blocked.
    - Điểm ưu tiên khu vực thang 100 (KV1=9,17/KV2-NT=8,33/KV2=7,5/KV3=6,67): verified. Batch 6 đã fetch lại trang chính thức và xác nhận quy tắc giảm dần khi tổng điểm học lực + điểm cộng ≥75/100; hiện có tool riêng `priorityReduction.ts`, nhưng vẫn KHÔNG cộng vào một điểm cuối cùng vì bảng điểm cộng ngoại ngữ chưa đủ.
    - **Điểm chuẩn 38 ngành/chuyên ngành 2026**: đọc trực tiếp ảnh gốc full-resolution `UEL_Cong-bo-diem-chuan-2026-724x1024.png` (tải về, đọc bằng công cụ đọc ảnh, đối chiếu số lượng 38/38 và khoảng điểm 65,01–90,01 khớp báo chí cùng ngày) — đã implement `schools/uel/data/cutoffs.ts`, đủ chuẩn tương đương cách HCMUT/UIT đọc ảnh gốc.
    - **Kết luận**: implement Admission Explorer thật (info + cutoff đầy đủ + ngưỡng đầu vào + bonus eligibility + bảng ưu tiên/tool giảm dần + source), `status: 'researching'`, exact calculator tiếp tục blocked cho tới khi có bảng điểm cộng ngoại ngữ chi tiết.
  - **Research bổ sung 2026-08-13 (batch 6, workstream T)** — targeted, fetch trực tiếp
    `tuyensinh.uel.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026/` (khác lần trước, fetch lại
    đúng trang chính thức thay vì chỉ qua báo chí):
    - **Quy tắc giảm điểm ưu tiên: UNBLOCKED** — trang chính thức nêu nguyên văn khi tổng (điểm học
      lực + điểm cộng) ≥75/100: `(100 – Điểm học lực – Điểm cộng)/25 × Điểm ưu tiên quy đổi, làm
      tròn đến 0.01` — đúng cấu trúc công thức chuẩn quốc gia (ngưỡng 75, chia 25) mà HCMUT cũng
      dùng (`admission-2026.ts`: `reductionThreshold: 75, reductionDivisor: 25`), không phải trùng
      hợp riêng UEL. Implement `schools/uel/priorityReduction.ts` (`calculateUelEffectivePriority`,
      pure function, 5 test) + UI "nâng cao" trong `UelExplorerPage.tsx`. `AdmissionMethodCapabilities.priority`
      đổi `false → true`.
    - **Bảng điểm cộng ngoại ngữ: VẪN blocked** — trang chính thức chỉ có 1 ví dụ minh họa rời
      rạc trong phần tính điểm mẫu ("Điểm cộng (IELTS 5.5) + 3,50"), bảng đầy đủ ("Phụ lục 2") nằm
      trong file đính kèm dạng Google Drive PDF, không đọc được qua fetch tự động (chặn đăng nhập/
      chưa render). Cross-check báo chí (VnExpress, batch 5) nói "IELTS≥5.0 tối đa 5/100" — 2 nguồn
      không đủ chi tiết để dựng bảng nhiều mức, và có chênh nhẹ về ngưỡng tối thiểu (5.0 vs ví dụ
      5.5) — chuyển gap sang `official-but-unparsed`, KHÔNG suy đoán các mức còn lại. `exactCalculator`
      tiếp tục `false`.
  - **Research/implementation bổ sung 2026-08-13 (batch 8)**:
    - Targeted search lại official UEL/UEL tuyển sinh/Drive PDF không lấy được bảng Phụ lục 2 dạng
      parseable. Kết luận exact calculator vẫn bị chặn bởi **1 unknown rule**: bảng điểm cộng chứng
      chỉ ngoại ngữ quốc tế đầy đủ theo từng mức và tương tác điểm cộng thực nhận từ bảng đó với cap
      10/100.
    - THPT factual reuse đã có consumer thật ở UEL: `UelExplorerPage.tsx` cho user chọn tổ hợp
      A00/A01/B00/D01, đọc `ApplicantProfile.thpt.scores` theo `SubjectId`, chỉ yêu cầu môn còn
      thiếu, và write-back điểm thi THPT raw mới nhập. Tổ hợp là school context, không lưu vào
      `ApplicantProfile`; điểm THPT quy đổi thang 100 không write-back.
  - **Targeted attempt 2026-08-13 (batch 9)**:
    - Thử direct-download official Google Drive artifact `1yJayo1846puqpgQYtZTAs4AZCHeT5XRk` bằng
      `drive.google.com/uc?export=download` trong sandbox và ngoài sandbox; cả hai lần timeout
      trước khi lấy được PDF thật. Không có bảng Phụ lục 2 parseable mới, nên UEL exact tiếp tục
      blocked. Không research tiếp qua nguồn SEO/blog để tránh kéo dài vô hạn.
  - **Research bổ sung Batch 16 (2026-08-13) — Outcome B, exact chưa unlock**:
    - Reconstruct exact-rule checklist trong `schools/uel/exactness.ts`: ĐGNL/THPT normalization,
      trọng số 2026, bảng ưu tiên, quy tắc giảm ưu tiên và cap đã có nguồn chính thức; bảng điểm cộng
      chứng chỉ ngoại ngữ quốc tế và final rounding/aggregation rule đủ tổng quát vẫn chưa đủ để mở
      exact calculator.
    - Canonical source trước tiên: `uel-admission-pdf-2026-unparsed`, link Drive chính thức từ dòng
      "Xem file thông tin tuyển sinh năm 2026" trên trang UEL. Web viewer qua fetch chỉ trả `Loading…`.
      Direct download `drive.google.com/uc?export=download&id=...` và `drive.usercontent.google.com`
      chỉ trả HTML Google Drive báo owner không cho download file. Search mirror official UEL/UEL
      admissions không tìm thấy bản PDF UEL-hosted parseable.
    - Trang UEL chính thức vẫn chỉ có rule dẫn tới Phụ lục 2 và ví dụ rời rạc `IELTS 5.5 -> +3.50`;
      nguồn thứ cấp có nhắc khoảng IELTS >=5.0/tối đa 5 nhưng không đủ làm source exact. Vì vậy
      `uel-certificate-bonus-table` giữ `official-but-unparsed`, `impact:
      exact-final-score-blocking`, và `exactCalculator=false`.
- **HCMUS**: `0.8×(THPT hoặc ĐGNL, chọn cao hơn) + 0.2×Học bạ`, tính trên thang 30 rồi quy đổi ×100/30 để công bố. Điểm cộng ≤1,5/30. Ưu tiên theo khung chuẩn quốc gia (giống cách HCMUT/UniscoreVN đã làm). Điều kiện riêng theo ngành (vd Thiết kế vi mạch yêu cầu Toán nhóm 20% cao nhất). Nguồn: `tuyensinh.hcmus.edu.vn` (chính thức, 3 trang khác nhau).
  - **Research bổ sung 2026-08-11** (đọc trực tiếp `tuyensinh.hcmus.edu.vn/2026-thong-bao-ve-phuong-thuc-xet-tuyen-2/`):
    - Xác nhận chính xác: `w1=w3=0.8`, `w2=w4=0.2`. `Điểm học lực = max(w1×THPT + w2×Học bạ, w3×ĐGNL_quy_đổi + w4×Học bạ)` — về mặt toán học tương đương `0.8×max(THPT, ĐGNL_quy_đổi) + 0.2×Học bạ` (vì Học bạ giống nhau ở cả 2 nhánh).
    - Học bạ = tổng điểm TB 3 năm (lớp 10+11+12) của 3 môn thuộc tổ hợp có giá trị LỚN NHẤT trong các tổ hợp ngành đăng ký — rõ ràng, có thể implement nếu biết danh sách tổ hợp từng ngành.
    - **BLOCKER thật (khác UIT/UEL)**: Điểm quy đổi ĐGNL dùng công thức nội suy `A2 + (A1-A2)×(Điểm ĐGNL – X2)/(X1-X2)` dựa trên "khung quy đổi tương đương điểm ĐGNL với điểm THPT 2026" — đây LÀ MỘT BẢNG (các cặp A1/X1/A2/X2 theo mốc điểm), không phải công thức đóng. Chưa trích xuất được bảng này (không thấy trong nội dung text đã fetch, có thể chỉ tồn tại dạng ảnh/PDF riêng) → không thể tính ĐGNL_quy_đổi chính xác, tương tự tình trạng "phương pháp bách phân vị" của UIT.
    - **BLOCKER thứ 2**: Điểm cộng có công thức tỉ lệ (không phải mức trần cố định như HCMUT/UIT/UEL): khi tổng điểm ≥28,5/30, `Điểm cộng = [(30 – Tổng điểm)/1.5] × Điểm cộng cơ sở` — nhưng "Điểm cộng cơ sở" theo từng loại giải/thành tích (vd giải Nhất/Nhì/Ba HSG quốc gia) CHƯA có bảng giá trị cụ thể trong nguồn đã đọc.
    - Điểm ưu tiên: xác nhận công thức giảm dần theo chuẩn quốc gia, có số liệu đầy đủ — khi tổng điểm ≥22,5/30: `Điểm ưu tiên = [(30 – Tổng điểm)/7,5] × Mức điểm ưu tiên KV/ĐT`. Đây LÀ xác nhận rõ ràng cho quy tắc giảm dần mà UEL research KHÔNG tìm thấy (khác trường, không suy ra UEL cũng áp dụng y hệt).
    - Điều kiện riêng ngành: Thiết kế vi mạch/Công nghệ bán dẫn (Toán ≥20% + tổ hợp ≥25% toàn quốc theo phổ điểm), Kỹ thuật hạt nhân (Toán+Lý ≥7,5 THPT hoặc ĐGNL thành phần Toán ≥225).
    - **Điểm chuẩn 2026**: công bố theo TỪNG TỔ HỢP MÔN riêng biệt cho cùng 1 ngành (khác cấu trúc HCMUT/UIT/UEL vốn 1 cutoff/ngành) — thang 30 (21,50–29,32), quy đổi thang 100 (71,67–97,73). Ngành/tổ hợp điểm cao nhất: Chương trình Tiên tiến KHMT (29,32/30).
    - **Kết luận: KHÔNG implement trong batch này.** 2 lý do: (1) thiếu bảng quy đổi ĐGNL và bảng điểm cộng cơ sở — 2 blocker thật giống UIT; (2) cutoff theo (ngành × tổ hợp) cần schema khác `AdmissionCutoff`/`UitCutoff`/`UelCutoff` hiện có (chỉ key theo năm+ngành) — quyết định mở rộng schema này cần cân nhắc riêng, không vội trong batch đang chạy nhanh. Để lại cho phase sau, ưu tiên fetch được bảng quy đổi ĐGNL + bảng điểm cộng cơ sở trước khi code.
    - **Hướng schema đề xuất khi implement (chưa code)**: KHÔNG ép về `{programId, year, score}` như 3 trường kia vì mất thông tin tổ hợp. Hướng khả dĩ: thêm 1 field optional `combinationId?: string` (mã tổ hợp, vd 'A00'/'A01') vào một type `HcmusCutoff` RIÊNG (không sửa `AdmissionCutoff`/`UitCutoff`/`UelCutoff` — 3 trường đó không có khái niệm này, ép field optional vào là nhiễu). `getCutoffAvailability`/`isYearPublished`/... ở `core/admissionHistory.ts` vẫn dùng được nguyên vì chỉ cần `{year, status}`, không quan tâm cutoff có thêm chiều gì. Quyết định cuối để dành khi thật sự bắt tay implement HCMUS, có đủ bảng quy đổi ĐGNL trong tay để biết chắc còn cần field nào khác không.
- **USSH**: 3 công thức theo đối tượng: ĐHL1 = 45%THPT+45%ĐGNL+10%học bạ; ĐHL2 = 90%THPT+10%học bạ; ĐHL3 = 90%ĐGNL+10%học bạ. Nguồn: `hcmussh.edu.vn` (chính thức). **Thiếu**: bảng điểm cộng/ưu tiên chi tiết — cần đọc thêm trước khi code.
  - **Research bổ sung 2026-08-11** (đọc trực tiếp `hcmussh.edu.vn/bai-viet/cong-bo-thong-tin-tuyen-sinh-nam-2026-cua-truong-dh-khxh-nv-dhqg-hcm` — lưu ý: đây là USSH **ĐHQG-HCM**, không phải USSH ĐHQGHN, hai trường trùng tên viết tắt khác nhau, kết quả tìm kiếm ban đầu có lẫn cả hai, đã lọc kỹ trước khi trích dẫn):
    - Xác nhận lại nguyên văn 3 công thức trên — khớp research trước, không đổi.
    - Điểm cộng: nguồn chỉ liệt kê các LOẠI thành tích được xét ("học tập, hoạt động xã hội, văn hóa, thể dục thể thao, văn nghệ; chứng chỉ ngoại ngữ quốc tế") — **không có mức điểm cụ thể hay cap**, khác hẳn HCMUT/UIT/UEL đã có bảng rõ. Blocker thật.
    - Điểm ưu tiên: nguồn không nêu công thức. Blocker thật.
    - Ngưỡng đảm bảo chất lượng đầu vào: KHÔNG có trong trang thông tin tuyển sinh chính đã đọc. Có tín hiệu qua tìm kiếm tổng hợp (chưa fetch trực tiếp để xác minh) rằng trường công bố ngưỡng riêng ngày 10/7/2026 (THPT+học bạ ≥17, ĐGNL ≥620) — verification mức `cross-checked` không phải `verified`, chưa đủ tin cậy để code, cần fetch lại trang thông báo ngưỡng gốc trước khi dùng.
    - **Điểm chuẩn 2026: CHƯA CÔNG BỐ tại thời điểm research (2026-08-11)** — theo kế hoạch chung Bộ GD&ĐT, trường dự kiến công bố trước 17h ngày 13/8/2026. Đây là ví dụ thật của trạng thái `not-published` (xem `core/admissionHistory.ts`, `NotPublishedCheck`) — không suy đoán/nội suy số liệu 2025 để giả làm 2026. Đã ghi record thật ở `src/data/notPublishedCutoffChecks.ts` (`schoolId: 'ussh'`, `checkedAt: '2026-08-11'`) để phân biệt rõ với "chưa research"/"research chưa đủ nguồn" — 2 trạng thái đó KHÔNG cần record (đơn giản là absence).
    - **Kết luận: KHÔNG implement trong batch này.** Không phải vì thiếu công thức chính (đã có, verified), mà vì (1) chưa có bảng điểm cộng/ưu tiên (blocker thật), (2) cutoff năm hiện tại chưa tồn tại để hiển thị — một Explorer không có bảng điểm chuẩn thì giá trị rất thấp. Đề xuất: quay lại sau ngày 13/8/2026 khi trường công bố điểm chuẩn, đồng thời fetch trực tiếp thông báo ngưỡng đầu vào 10/7/2026 để nâng verification lên 'verified'.
- **IU/AGU/UHS**: xem lý do `false` ở cột trên — cần xác minh thêm bằng cách truy cập trực tiếp (site IU chặn crawler tự động; AGU chỉ có số liệu ở nguồn thứ cấp; UHS tự ghi "dự kiến chưa chính thức").

## Phần C — Trường ngoài ĐHQG-HCM dùng ĐGNL 2026

Bối cảnh: 118 trường ĐH/CĐ đăng ký dùng kết quả ĐGNL ĐHQG-HCM 2026 (nguồn: tuoitre.vn dẫn số liệu ĐHQG-HCM). Từ 2026, Thông tư 06/2026/TT-BGDĐT yêu cầu các trường công bố "bảng quy đổi tương đương" điểm ĐGNL sang thang điểm chung.

| Trường | Dùng ĐGNL? | officialSource | calculatorWorthBuilding |
|---|---|---|---|
| **FTU — Ngoại thương** | Có | thongtintuyensinh.ftu.edu.vn/admissions-methods | ✅ **true** — công thức tuyến tính đơn giản, đã xác minh |
| **UEH — Kinh tế TP.HCM** | Có | tuyensinh.ueh.edu.vn | ✅ true — **đã lấy đủ bảng, đã implement Explorer + tool quy đổi thật** (xem ghi chú dưới, `schools/ueh/`) |
| NEU — Kinh tế Quốc dân | Có | neu.edu.vn (PDF) | ⚠️ chưa chắc — cần đọc PDF đề án gốc |
| HCMUTE — Công nghệ Kỹ thuật TP.HCM | Có | tuyensinh.hcmute.edu.vn | ✅ true — đã implement (`schools/hcmute/`), hệ số tương quan a=0,8/b=0,8 công bố chính thức 07/7/2026 (số 2092/TB-ĐHCNKT), xem README mục "Trường đang hỗ trợ" |
| IUH — Công nghiệp TP.HCM | Có | tuyensinh.iuh.edu.vn (PDF, lỗi SSL khi fetch) | ❌ false (tạm thời) |
| PTIT | Có (ngưỡng thuần, theo hướng dẫn chung Bộ GD-ĐT) | — | ❌ false |
| TDTU — Tôn Đức Thắng | Có (PT2, cộng với PT1 xét tổng hợp có ĐGNL không bắt buộc) | admission.tdtu.edu.vn | ✅ true — đã implement (`schools/tdtu/`), trường thứ 12; PT1 (thang 100, Đối tượng 1.1) + PT2/ĐGNL (thang 1200) đều exact, xem README mục "Trường đang hỗ trợ" |
| HUTECH — Công nghệ TP.HCM | Có (1 trong 4 phương thức độc lập) | hutech.edu.vn | ✅ true — đã implement (`schools/hutech/`), trường thứ 14; xét THPT (thang 30) + xét ĐGNL (thang 1200) đều exact trong phạm vi ĐC=0, xem README mục "Trường đang hỗ trợ" |
| UFM — Tài chính - Marketing | Có (1 trong 5 phương thức độc lập) | ufm.edu.vn | ✅ true — đã implement (`schools/ufm/`), trường thứ 15; xét THPT (thang 30, chương trình Chuẩn) + xét ĐGNL (thang 1200) đều exact trong phạm vi ĐC=0, xem README mục "Trường đang hỗ trợ" |
| Văn Lang | Có (phương thức độc lập, không có công thức chi tiết công khai) | — | ❌ false |

**FTU** — công thức xác nhận: `Điểm quy đổi thang 30 = 27 + (Điểm ĐGNL − 850) × 3/350`, ngưỡng tối thiểu 850/1200, cộng thêm điểm ưu tiên/khuyến khích tối đa 3/30. Nguồn: `thongtintuyensinh.ftu.edu.vn/admissions-methods` (chính thức).

**UEH** — công thức: `Điểm xét tuyển (thang 100) = Điểm thi quy đổi×60% + ĐTB THPT quy đổi×40% + điểm cộng + điểm ưu tiên`; ĐGNL quy đổi bằng nội suy tuyến tính (ví dụ: 950 điểm ĐGNL → 25.55/30). Ngưỡng: 65/100 (UEH TP.HCM) / 60/100 (UEH Mekong). Nguồn: `tuyensinh.ueh.edu.vn` (chính thức).
  - **Research bổ sung + IMPLEMENT 2026-08-11** (xem `schools/ueh/`): lấy được ĐẦY ĐỦ bảng 12 khoảng quy đổi ĐGNL→THPT (đọc trực tiếp trang, không phải ảnh — hiếm, tốt hơn hẳn UIT/HCMUS) + công thức học bạ chính xác `(ĐTB10×1+ĐTB11×2+ĐTB12×3)/6` + ngưỡng 65/60 + điểm chuẩn 97 chương trình (82 KSA + 15 KSV, đọc bảng HTML qua fetch tool, verification `cross-checked` — KHÔNG đối chiếu 2 lần độc lập như cách đọc ảnh của HCMUT/UIT/UEL, nên nếu phát hiện sai số ưu tiên kiểm tra lại trực tiếp). Implement `convertDgnlToThpt()` như tool thật (`scoreConversion: true`) — LẦN ĐẦU TIÊN một trường ngoài HCMUT có capability này. Exact final calculator vẫn blocked: bước quy đổi cuối (điểm thi thang 30 + học bạ → thang 100) không đủ rõ, và bảng điểm cộng/ưu tiên chỉ có ví dụ minh họa (IELTS 6.0→5 điểm), không phải bảng đầy đủ.
- **HUTECH (Đại học Công nghệ TP.HCM)** — research + implement 2026-08-18 (`schools/hutech/`, trường thứ 14): 4 phương thức (thi TN THPT/học bạ 6 học kỳ/V-SAT/ĐGNL ĐHQG-HCM), ngưỡng đảm bảo chất lượng đầu vào 2026 verbatim từ Thông báo 04/7/2026 (4 nhóm ngành × 4 phương thức, KHÔNG còn "sẽ công bố sau"). **Phân biệt quan trọng**: ngưỡng đảm bảo chất lượng (dùng làm eligibility) ≠ điểm chuẩn trúng tuyển thật (công bố sau, cao hơn — HUTECH có cả 2 loại thông báo riêng biệt, dùng nhầm loại nào cũng sai). Exact 2/4 phương thức (thi THPT + ĐGNL, phạm vi ĐC=0); học bạ dừng ở `unavailable` (công thức cần dữ liệu theo học kỳ, hồ sơ dùng chung chỉ có TB năm — data-model gap, không phải thiếu nguồn); V-SAT dừng ở eligibility-only (2 trang chính thức cho số liệu ngưỡng V-SAT không nhất quán, không tự suy đoán). Lưu ý phụ: số hiệu "Phương thức 3"/"Phương thức 4" bị đảo ngược giữa 2 trang đã đọc — module dùng tên mô tả (thpt/hocba/vsat/dgnl) thay vì số hiệu để tránh gán nhầm.
- **UFM (Đại học Tài chính – Marketing)** — research + implement 2026-08-18 (`schools/ufm/`, trường thứ 15): 5 phương thức (301 xét thẳng/200 học bạ/402 ĐGNL/416 V-SAT/100 thi TN THPT), ngưỡng đảm bảo chất lượng đầu vào 2026 verbatim từ Thông báo 10/7/2026 (2 nhóm ngành chuẩn/Luật kinh tế × 4 phương thức tính điểm, KHÔNG còn "sẽ công bố sau"). Exact 2/4 (thi THPT chương trình Chuẩn + ĐGNL, phạm vi ĐC=0). **2 mâu thuẫn nguồn thứ cấp phát hiện, CHƯA giải quyết được bằng nguồn chính thức**: (1) hệ số Toán×2 áp dụng "tất cả tổ hợp" (vnexpress) hay "chỉ chương trình Tiếng Anh toàn phần" (hocmai.vn) — module chọn diễn giải an toàn hơn (hệ số 1, chương trình Chuẩn) và không implement nhánh Tiếng Anh toàn phần; (2) công thức học bạ dùng điểm "đến HK1 lớp 12" (nguồn thứ cấp) — khác granularity hồ sơ dùng chung (TB năm), nên dừng ở `unavailable`. Trang thông báo quy đổi tương đương tìm được ban đầu hóa ra thuộc chu kỳ **2025** (ngày đăng 23/7/2025) — đã loại khỏi nguồn 2026, không dùng nhầm.
- **OU (Đại học Mở TP.HCM)** — research 2026-08-11: dùng ĐGNL như 1 trong 6 phương thức ĐỘC LẬP (không phải trọng số trong công thức kết hợp) — điểm ĐGNL raw dùng trực tiếp làm điểm xét. Điểm cộng có 2 mục biết mức (khuyến khích ngoại ngữ, xét thưởng học bạ 0,5–1,0, thưởng HSG 0,5–1,5) nhưng KHÔNG có ngưỡng sàn ĐGNL, KHÔNG có cutoff, KHÔNG có danh sách ngành trong nguồn đã đọc. **KHÔNG implement** — Explorer không có cutoff/danh sách ngành thì giá trị quá thấp. Nguồn: `ou.edu.vn`, `tuyensinh.ou.edu.vn` (chính thức, đã fetch trực tiếp).
- **IUH (Đại học Công nghiệp TP.HCM)** — research 2026-08-11: có công cụ tính điểm CHÍNH THỨC (`tuyensinh.iuh.edu.vn/thiSinh/fTinhDiem_2026`, nhận input ĐGNL/ưu tiên/thành tích/IELTS-TOEIC-VSTEP) và biết trường dùng bảng bách phân vị quốc gia (Phụ lục 2, Thông tư 06/2026/TT-BGDĐT) để quy đổi ĐGNL. Nhưng theo đúng rule "không coi UI tool = verified formula nếu chưa đối chiếu văn bản gốc" — CHƯA tìm được văn bản/quy chế liệt kê trọng số cụ thể đằng sau tool, nên KHÔNG gọi formula verified. Cutoff 2026 biết range chung 17–26/30 (không phải per-ngành). **KHÔNG implement.**
  - **Lead quan trọng phát hiện khi research IUH**: bảng bách phân vị quốc gia (ĐHQG-HCM công bố 6/7/2026, 5 tổ hợp A00/A01/B00/C00/D01, theo Thông tư 06/2026 Phụ lục 2) RẤT CÓ THỂ là đúng bảng mà UIT ("phương pháp bách phân vị") và HCMUS (nội suy A1/A2/X1/X2) đều thiếu — xem `docs/external-vact-registry.md` mục lead. Chưa lấy được bảng 2026 thật (trang `vnuhcm.edu.vn` render JS, WebFetch không đọc được; bản tìm thấy trên `chinhphu.vn` là năm 2025, không dùng được).

## Shortlist ưu tiên implement tiếp theo (deliverable bắt buộc)

Xếp theo độ ưu tiên đề xuất (không implement ngay trong phase này — xem lý do bên dưới):

1. **UIT** — trọng số xác nhận từ 2 nguồn độc lập khớp nhau, có cả bảng ngưỡng chứng chỉ quốc tế công khai, dữ liệu đầy đủ nhất.
2. **UEL** — trọng số + bảng ưu tiên KV/ĐT đầy đủ chi tiết (chỉ thiếu bảng quy đổi IELTS/TOEFL phụ trợ).
3. **HCMUS** — công thức đơn giản nhất (0.8/0.2, chọn max giữa THPT/ĐGNL), rủi ro thấp nhất khi implement, phù hợp làm "trường thứ hai" đầu tiên.
4. Dự phòng: **FTU** (ngoài ĐHQG-HCM, công thức tuyến tính rất đơn giản) nếu muốn test kiến trúc multi-school với một trường KHÔNG dùng kiểu "xét tuyển tổng hợp".

**Quyết định phase này: CHƯA implement calculator cho trường thứ hai.** Lý do: phase này đã ưu tiên (a) mở rộng đúng đắn HCMUT cho nhóm không-ĐGNL, (b) dựng kiến trúc school registry/selector, và (c) đảm bảo không phá calculator HCMUT đang chạy production. Thêm một calculator engine mới (dù đã có formula verified trên giấy) đòi hỏi tự viết test + validate kỹ theo đúng tinh thần "KHÔNG expose calculator production nếu formula chưa verify [bằng thực nghiệm]" — ưu tiên correctness hơn tốc độ, nên để dành phase kế tiếp làm cẩn thận cho **HCMUS** (rủi ro thấp nhất, công thức đơn giản nhất trong 3 ứng viên đầu).

## Ghi chú phương pháp

- Một số trang chính thức không fetch được trực tiếp (timeout hoặc chặn crawler): `hcmut.edu.vn` (2 lần timeout — dùng cross-check qua 2 nguồn khác), `hcmiu.edu.vn` (IU, trả về rỗng), một phần `tuyensinh.iuh.edu.vn` (lỗi SSL). Các trường hợp này đều được ghi rõ "formulaVerified = false" hoặc "độ tin cậy trung bình", không tự suy đoán số liệu thay thế.
- Không dùng bất kỳ trang tổng hợp điểm chuẩn không dẫn nguồn hoặc snippet Google không kèm link xác minh được làm nguồn chính cho bất kỳ khẳng định số liệu nào.
## Research bổ sung 2026-08-21 — FTU/PTIT/NEU

Thực hiện lại workflow 12 bước cho 3 trường Tier 1 ngoài nhóm đã có module, ưu tiên nguồn chính thức parse được:

- **FTU (Trường Đại học Ngoại thương)** — nguồn chính thức `thongtintuyensinh.ftu.edu.vn/admissions-methods`, truy cập lại 2026-08-21. Inventory: 4 nhóm phương thức chính; module chỉ claim Phương thức 4 route ĐGNL/ĐGTD trong nước độc lập. Công thức verified: HSA `27 + (raw-100)*3/50`, V-ACT `27 + (raw-850)*3/350`, TSA `27 + (raw-70)*3/30`; nhóm tích hợp Khoa học máy tính/AI/Khoa học dữ liệu quy đổi sang thang 40 bằng `base30*4/3`. Điều kiện sàn đã đọc: HSA≥100, V-ACT≥850, TSA≥70. Điểm thưởng/cap và công thức giảm ưu tiên thang 30/40 có trên cùng nguồn. Chưa import danh mục chương trình để tự chọn nhóm thang 30/40, điểm chuẩn 2026, và các nhánh kết hợp chứng chỉ ngoại ngữ quốc tế. Implement `schools/ftu/`, `exactCalculator:true` cho route nội địa độc lập, có Tier C golden coverage.
- **PTIT (Học viện Công nghệ Bưu chính Viễn thông)** — nguồn chính thức `tuyensinh.ptit.edu.vn`, thông báo ngày 03/04/2026. Inventory: 5 phương thức; module hiện chỉ dùng Phương thức 3 ĐGNL/ĐGTD trong nước. Ngưỡng verified: TSA≥50, HSA≥75, V-ACT≥600, SPT≥15. Công thức nguồn nêu `ĐXT = điểm ĐGNL/ĐGTD + điểm cộng + điểm ưu tiên`, nhưng chính văn bản ghi điểm xét tuyển ở phần C là trước quy đổi tương đương theo Bộ GD&ĐT; chưa tìm được bảng/công thức quy đổi tương đương final-score riêng PTIT. Implement `schools/ptit/` eligibility/raw-formula checker, `exactCalculator:false`.
- **NEU (Đại học Kinh tế Quốc dân)** — nguồn chính thức `neu.edu.vn`, Thông báo 1613/TB-ĐHKTQD ngày 03/07/2026 và PDF thông tin tuyển sinh 2026. Inventory hiện dùng phần ngưỡng + bảng quy đổi tương đương. Ngưỡng ĐBCL: A00/A01/D01/D07 đều 22/30, áp dụng cho thi TN THPT và phương thức kết hợp TN THPT với chứng chỉ tiếng Anh quốc tế. Bảng quy đổi tương đương verified theo khoảng: THPT 22-24 ↔ V-ACT 700-752; 24-26 ↔ 752-882; 26-28 ↔ 882-1004; 28-30 ↔ 1004-1200 (cùng HSA/SAT/TSA trong PDF). PDF chỉ công bố khoảng và trỏ thí sinh đến AI tool để tra cứu chi tiết, nên không suy diễn hàm nội suy trong khoảng. Implement `schools/neu/` band checker, `exactCalculator:false`.

## Research bổ sung 2026-08-22 — OU/SGU/HNUE/VinhUni/UTC

Thêm 5 module threshold-only theo yêu cầu mở rộng +5 trường. Nguyên tắc batch này: chỉ claim phần
đã đọc được từ nguồn chính thức; bảng ngành/phụ lục lớn chưa nhập thì giữ `KnowledgeGap` để Claude
hoặc maintainer tiếp tục xử lý, không suy diễn thành calculator chính xác.

- **OU (Trường Đại học Mở TP.HCM)** — nguồn chính thức `tuyensinh.ou.edu.vn`, thông báo ngưỡng đầu
  vào 10/07/2026 và thông báo quy tắc quy đổi tương đương cùng ngày. Đọc được quy tắc nguồn xét
  tuyển tối thiểu 15/30 và phụ lục điểm sàn theo mã xét tuyển (nhiều chương trình 16-17/30, lĩnh
  vực pháp luật có quy định riêng). Chưa nhập bảng điểm sàn từng mã, bảng quy đổi V-SAT/ĐGNL/học
  bạ/SAT và điểm cộng/ưu tiên. Implement `schools/ou/`, evaluator chỉ loại chắc hồ sơ dưới 15/30.
- **SGU (Trường Đại học Sài Gòn)** — nguồn chính thức `tuyensinh.sgu.edu.vn`, thông báo "Ngưỡng đầu
  vào, quy tắc quy đổi tương đương..." ngày 10/07/2026 và thông tin tuyển sinh chính thức ngày
  02/06/2026. Xác minh ngưỡng theo ngành/chương trình khoảng 16-23/30 (cao nhất nhóm sư phạm).
  Chưa nhập bảng 47 ngành, phụ lục quy đổi chứng chỉ/V-SAT/ĐGNL, bảng điểm cộng và điểm chuẩn 2026
  dạng ảnh/file. Implement `schools/sgu/`, evaluator chỉ loại chắc hồ sơ dưới 16/30.
- **HNUE (Trường Đại học Sư phạm Hà Nội)** — nguồn chính thức `tuyensinh.hnue.edu.vn/thong-bao/667`,
  ngưỡng đầu vào 2026 theo ngành/chương trình. Đọc được nhiều ngưỡng 18-22/30 và các nhánh năng
  khiếu có điều kiện phụ theo 1 hoặc 2 môn văn hóa. Chưa nhập bảng ngành đầy đủ, điều kiện phụ cho
  ngành năng khiếu và quy đổi PT2/SPT2026. Implement `schools/hnue/`, evaluator chỉ loại chắc hồ sơ
  dưới 18/30.
- **VinhUni (Trường Đại học Vinh)** — nguồn chính thức `tuyensinh.vinhuni.edu.vn`, thông báo ngưỡng
  đầu vào + quy tắc quy đổi 09/07/2026 và thông báo điều chỉnh 27/06/2026. Đọc được điều kiện
  phương thức 100: đạt ngưỡng ngành/chương trình, không có môn thi nào từ 1,0 trở xuống; nguồn xét
  tuyển phổ thông tối thiểu 15/30. Chưa nhập bảng ngành, học bạ, quy đổi tương đương, điều kiện
  riêng nhóm ngôn ngữ/sức khỏe/pháp luật và phương thức năng khiếu. Implement `schools/vinhuni/`.
- **UTC (Trường Đại học Giao thông vận tải)** — nguồn chính thức `tuyensinh.utc.edu.vn`, thông báo
  ngưỡng đầu vào 07/07/2026. Đọc được công thức tổng điểm THPT có nhánh Toán x2 và nhánh riêng
  Ngôn ngữ Anh, bảng ngưỡng theo cơ sở Hà Nội/Phân hiệu TP.HCM (nhiều ngành 17-18/30, một số ngành
  19-21/30) và các cột HSA/TSA/ĐGNL. Chưa nhập bảng ngành/cơ sở đầy đủ, context Toán x2/ngành
  Ngôn ngữ Anh và bảng quy đổi HSA/TSA/ĐGNL. Implement `schools/utc/`, evaluator chỉ loại chắc hồ
  sơ dưới 17/30.

