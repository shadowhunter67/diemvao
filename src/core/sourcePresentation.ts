import type { FreshnessStatus, LifecycleStatus } from './freshness';
import type { SourceType } from './admissionHistory';

const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  'official-school': 'Nguồn chính thức của trường',
  'official-admission': 'Nguồn tuyển sinh chính thức',
  vnuhcm: 'Nguồn ĐHQG-HCM',
  government: 'Nguồn cơ quan quản lý',
  secondary: 'Nguồn đối chiếu',
};

const LIFECYCLE_LABELS: Record<LifecycleStatus, string> = {
  current: 'Đang áp dụng',
  historical: 'Dữ liệu lịch sử',
  superseded: 'Đã được thay thế',
};

const FRESHNESS_LABELS: Record<FreshnessStatus, string> = {
  current: 'Đang áp dụng',
  historical: 'Dữ liệu lịch sử',
  superseded: 'Đã được thay thế',
  'needs-review': 'Cần kiểm tra lại',
  stale: 'Cần kiểm tra lại',
  unknown: 'Chưa xác minh',
};

export function sourceTypeLabel(sourceType?: SourceType): string | undefined {
  return sourceType ? SOURCE_TYPE_LABELS[sourceType] : undefined;
}

export function lifecycleStatusLabel(status?: LifecycleStatus): string | undefined {
  return status ? LIFECYCLE_LABELS[status] : undefined;
}

export function freshnessStatusLabel(status?: FreshnessStatus): string | undefined {
  return status ? FRESHNESS_LABELS[status] : undefined;
}

export function formatSourceDate(value?: string): string | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}
