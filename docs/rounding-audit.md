# Rounding policy audit (2026-08-12)

Audit toàn bộ `round2()` trong `src/schools/hcmut/calculator/{calculator,targetCalculator}.ts` và
`src/schools/ueh/dgnlConversion.ts`. Xem model tại `src/core/roundingPolicy.ts`, danh sách rule cụ
thể của HCMUT tại `src/schools/hcmut/roundingPolicy.ts`.

## Kết luận chính

**Đề án tuyển sinh HCMUT 2026 không nói rõ cách làm tròn ở bất kỳ bước trung gian nào** (chỉ biết
điểm xét tuyển hiển thị thang 100, 2 chữ số thập phân). Vì vậy toàn bộ `round2()` ở các bước
`dgnl.normalizedScore` / `thpt.normalizedScore` / `transcript.normalizedScore` /
`academic.*Contribution` / `priority.*` trong code hiện tại là **assumption của developer, không
phải quy định chính thức**.

## Rủi ro đã đo được (không phải giả định)

Fuzz test 200,000 tổ hợp input ngẫu nhiên so sánh:
- **A. Code hiện tại** — làm tròn 2 chữ số ở từng bước trung gian trước khi cộng/nhân trọng số.
- **B. Không làm tròn trung gian** — chỉ làm tròn 1 lần duy nhất ở `finalScore`.

→ Lệch tối đa quan sát được giữa A và B: **~0.03 điểm / thang 100**. Case cụ thể đã khóa lại thành
regression test ở `calculator.rounding.test.ts`.

0.03 điểm là nhỏ nhưng **không phải zero** — trên biên xét tuyển (cutoff cách nhau 0.01-0.05 điểm
là chuyện thường ở nhiều ngành), một thí sinh lý thuyết có thể đổi kết luận "đậu/không đậu tham
khảo" tùy cách làm tròn được chọn.

## Vì sao KHÔNG sửa thuật toán trong đợt này

Không có nguồn nào nói bước nào (A hay B) đúng theo quy định thật của trường. Đổi sang B là một
lựa chọn KHÁC, không phải một bản sửa lỗi đã chứng minh — tự ý đổi sẽ vi phạm đúng nguyên tắc
"không nói mạnh hơn bằng chứng" mà toàn bộ audit này phục vụ. Quyết định: **giữ nguyên A (behavior
hiện tại)**, khóa lại bằng regression test, document rõ đây là assumption có rủi ro nhỏ đã đo được.

## UEH

`convertDgnlToThpt` không làm tròn (trả float thô, nội suy tuyến tính đúng bảng nguồn) — không có
rounding assumption nào ở tầng domain, làm tròn (nếu có) chỉ xảy ra ở tầng hiển thị UI.

## Việc cần làm nếu sau này tìm được nguồn chính thức về rounding

Nếu có: cập nhật `authority` từ `'assumption'` → `'official'` trong `roundingPolicy.ts`, viết lại
thuật toán nếu quy định khác A, và cập nhật/xóa regression test tương ứng — không giữ test cũ nếu
đã chứng minh nó phản ánh behavior sai.
