import { Check, Circle } from 'lucide-react';
import type { AdmissionMethodDescriptor } from '../core/admissionMethod';

/** Nhãn hiển thị cho user — không expose tên field/enum nội bộ (`eligibility`, `exactCalculator`...). */
const CAPABILITY_LABELS: { key: keyof AdmissionMethodDescriptor['capabilities']; label: string }[] = [
  { key: 'eligibility', label: 'Kiểm tra điều kiện/ngưỡng đầu vào' },
  { key: 'scoreConversion', label: 'Quy đổi điểm' },
  { key: 'bonus', label: 'Điểm cộng' },
  { key: 'priority', label: 'Điểm ưu tiên' },
  { key: 'exactCalculator', label: 'Tính điểm xét tuyển cuối cùng' },
];

/**
 * Batch 6, workstream H — tóm tắt "phương thức này hiện tính được đến đâu" ở mức method, đọc
 * thẳng từ `AdmissionMethodDescriptor` (không hard-code lại danh sách capability trong từng
 * trang). Chỉ hiện các dòng ✓ (đã hỗ trợ) — dòng ○ dựa vào `knowledgeGaps` (cụ thể hơn "chưa tính
 * được điểm cuối" chung chung) nên nằm ở block cảnh báo riêng của từng trang, không lặp ở đây để
 * tránh 2 nguồn liệt kê gap không đồng bộ.
 */
export function MethodCapabilitySummary({ method }: { method: AdmissionMethodDescriptor }) {
  const supported = CAPABILITY_LABELS.filter(({ key }) => method.capabilities[key]);
  const notSupported = CAPABILITY_LABELS.filter(({ key }) => !method.capabilities[key]);

  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
      {supported.map(({ key, label }) => (
        <span key={key} className="flex items-center gap-1 text-success">
          <Check size={13} aria-hidden="true" />
          {label}
        </span>
      ))}
      {notSupported.map(({ key, label }) => (
        <span key={key} className="flex items-center gap-1 text-muted">
          <Circle size={10} aria-hidden="true" />
          {label}
        </span>
      ))}
    </div>
  );
}
