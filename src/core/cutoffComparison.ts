import { finalCutoffsSortedDesc, getCutoffAvailability, nearestPreviousFinalCutoff, type CutoffAvailability } from './admissionHistory';
import { round2 } from './round2';

export interface ComparableCutoffRecord {
  year: number;
  programId?: string;
  method?: string;
  methodId?: string;
  campusId?: string;
  applicantTypeId?: string;
  combinationId?: string;
  score: number;
  scoreScale?: number;
  status?: 'final' | 'superseded';
  comparableToPrevious?: boolean;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface CutoffComparison {
  cutoff: number;
  cutoffScale?: number;
  applicantScore: number;
  applicantScale: number;
  difference?: number;
  year: number;
  comparable: boolean;
  reasonNotComparable?: string;
  source?: {
    label?: string;
    url?: string;
  };
  availability: CutoffAvailability;
  referenceType: 'current' | 'historical' | 'none';
}

function compareScoreToCutoff(input: {
  applicantScore: number;
  applicantScale: number;
  cutoff: ComparableCutoffRecord;
  referenceType: 'current' | 'historical';
  availability: CutoffAvailability;
  contextComparable?: boolean;
  reasonNotComparable?: string;
}): CutoffComparison {
  const cutoffScale = input.cutoff.scoreScale ?? input.applicantScale;
  const base = {
    cutoff: input.cutoff.score,
    cutoffScale,
    applicantScore: input.applicantScore,
    applicantScale: input.applicantScale,
    year: input.cutoff.year,
    source: { label: input.cutoff.sourceLabel, url: input.cutoff.sourceUrl },
    availability: input.availability,
    referenceType: input.referenceType,
  };

  if (input.contextComparable === false) {
    return { ...base, comparable: false, reasonNotComparable: input.reasonNotComparable ?? 'Không cùng ngữ cảnh xét tuyển.' };
  }
  if (cutoffScale !== input.applicantScale) {
    return { ...base, comparable: false, reasonNotComparable: 'Không cùng thang điểm nên không thể tính chênh lệch.' };
  }
  if (input.referenceType === 'historical' && input.cutoff.comparableToPrevious === false) {
    return {
      ...base,
      comparable: false,
      reasonNotComparable: 'Mốc lịch sử không được đánh dấu có thể so sánh trực tiếp.',
    };
  }

  return { ...base, comparable: true, difference: round2(input.applicantScore - input.cutoff.score) };
}

function getMissingCutoffReason(availability: CutoffAvailability): string {
  if (availability === 'not-published') {
    return 'Năm hiện tại đã kiểm tra và chưa công bố điểm chuẩn cùng ngữ cảnh.';
  }
  if (availability === 'superseded') {
    return 'Điểm chuẩn năm hiện tại có bản đã bị thay thế, nhưng chưa có bản final thay thế đủ xác minh.';
  }
  return 'UniscoreVN chưa có dữ liệu điểm chuẩn xác minh cùng ngữ cảnh.';
}

interface CutoffSelection {
  programId?: string;
  methodId?: string;
  campusId?: string;
  applicantTypeId?: string;
  combinationId?: string;
}

function filterCutoffRecords(records: ComparableCutoffRecord[], selection?: CutoffSelection): ComparableCutoffRecord[] {
  return records.filter((record) => {
    if (record.programId !== undefined && record.programId !== selection?.programId) return false;
    const recordMethodId = record.methodId ?? record.method;
    if (recordMethodId !== undefined && recordMethodId !== selection?.methodId) return false;
    if (record.campusId !== undefined && record.campusId !== selection?.campusId) return false;
    if (record.applicantTypeId !== undefined && record.applicantTypeId !== selection?.applicantTypeId) return false;
    if (record.combinationId !== undefined && record.combinationId !== selection?.combinationId) return false;
    return true;
  });
}

export function findCutoffComparison(input: {
  records: ComparableCutoffRecord[];
  targetYear: number;
  applicantScore: number;
  applicantScale: number;
  selection?: CutoffSelection;
  notPublishedChecks?: { year: number }[];
  contextComparable?: boolean;
  reasonNotComparable?: string;
}): CutoffComparison {
  const records = filterCutoffRecords(input.records, input.selection);
  const availability = getCutoffAvailability(records, input.targetYear, input.notPublishedChecks ?? []);
  const current = records.find((record) => (record.status ?? 'final') === 'final' && record.year === input.targetYear);
  if (current) {
    return compareScoreToCutoff({
      applicantScore: input.applicantScore,
      applicantScale: input.applicantScale,
      cutoff: current,
      referenceType: 'current',
      availability,
      contextComparable: input.contextComparable,
      reasonNotComparable: input.reasonNotComparable,
    });
  }

  const previous = nearestPreviousFinalCutoff(records, input.targetYear);
  if (previous) {
    return compareScoreToCutoff({
      applicantScore: input.applicantScore,
      applicantScale: input.applicantScale,
      cutoff: previous,
      referenceType: 'historical',
      availability,
      contextComparable: input.contextComparable,
      reasonNotComparable: input.reasonNotComparable,
    });
  }

  return {
    cutoff: Number.NaN,
    applicantScore: input.applicantScore,
    applicantScale: input.applicantScale,
    year: input.targetYear,
    comparable: false,
    reasonNotComparable: getMissingCutoffReason(availability),
    availability,
    referenceType: 'none',
  };
}

/**
 * Giống `findCutoffComparison` nhưng trả về NHIỀU năm gần nhất (mặc định 2) thay vì chỉ 1 —
 * dùng cho UI Compare hiện "điểm chuẩn 2 năm gần nhất" thay vì chỉ năm hiện tại/1 mốc lịch sử.
 * Không thay `findCutoffComparison` (vẫn còn nơi khác cần đúng 1 kết quả) — hàm này CHỈ khác ở
 * số lượng năm trả về, cùng logic lọc/so sánh (`filterCutoffRecords`/`compareScoreToCutoff`).
 */
export function findRecentCutoffComparisons(input: {
  records: ComparableCutoffRecord[];
  targetYear: number;
  applicantScore: number;
  applicantScale: number;
  selection?: CutoffSelection;
  notPublishedChecks?: { year: number }[];
  contextComparable?: boolean;
  reasonNotComparable?: string;
  maxYears?: number;
}): CutoffComparison[] {
  const records = filterCutoffRecords(input.records, input.selection);
  const availability = getCutoffAvailability(records, input.targetYear, input.notPublishedChecks ?? []);
  const maxYears = input.maxYears ?? 2;

  const seenYears = new Set<number>();
  const recentDistinctYears = finalCutoffsSortedDesc(records)
    .filter((record) => record.year <= input.targetYear)
    .filter((record) => {
      if (seenYears.has(record.year)) return false;
      seenYears.add(record.year);
      return true;
    })
    .slice(0, maxYears);

  if (recentDistinctYears.length === 0) {
    return [
      {
        cutoff: Number.NaN,
        applicantScore: input.applicantScore,
        applicantScale: input.applicantScale,
        year: input.targetYear,
        comparable: false,
        reasonNotComparable: getMissingCutoffReason(availability),
        availability,
        referenceType: 'none',
      },
    ];
  }

  return recentDistinctYears.map((record) =>
    compareScoreToCutoff({
      applicantScore: input.applicantScore,
      applicantScale: input.applicantScale,
      cutoff: record,
      referenceType: record.year === input.targetYear ? 'current' : 'historical',
      availability,
      contextComparable: input.contextComparable,
      reasonNotComparable: input.reasonNotComparable,
    })
  );
}
