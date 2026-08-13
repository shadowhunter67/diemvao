import { getCutoffAvailability, nearestPreviousFinalCutoff, type CutoffAvailability } from './admissionHistory';
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

export function findCutoffComparison(input: {
  records: ComparableCutoffRecord[];
  targetYear: number;
  applicantScore: number;
  applicantScale: number;
  selection?: {
    programId?: string;
    methodId?: string;
    campusId?: string;
    applicantTypeId?: string;
    combinationId?: string;
  };
  notPublishedChecks?: { year: number }[];
  contextComparable?: boolean;
  reasonNotComparable?: string;
}): CutoffComparison {
  const records = input.records.filter((record) => {
    if (record.programId !== undefined && record.programId !== input.selection?.programId) return false;
    const recordMethodId = record.methodId ?? record.method;
    if (recordMethodId !== undefined && recordMethodId !== input.selection?.methodId) return false;
    if (record.campusId !== undefined && record.campusId !== input.selection?.campusId) return false;
    if (record.applicantTypeId !== undefined && record.applicantTypeId !== input.selection?.applicantTypeId) return false;
    if (record.combinationId !== undefined && record.combinationId !== input.selection?.combinationId) return false;
    return true;
  });
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
    reasonNotComparable:
      availability === 'not-published'
        ? 'Năm hiện tại đã kiểm tra và chưa công bố điểm chuẩn cùng ngữ cảnh.'
        : 'UniscoreVN chưa có dữ liệu điểm chuẩn xác minh cùng ngữ cảnh.',
    availability,
    referenceType: 'none',
  };
}
