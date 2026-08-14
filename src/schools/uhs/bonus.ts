import { round2 } from '../../core/round2';

export type UhsForeignCertificateType = 'ielts' | 'toeflIbt' | 'toeflItp' | 'toeic' | 'vstep';

export interface UhsForeignCertificateInput {
  type: UhsForeignCertificateType;
  score?: number;
  toeicListeningReading?: number;
  toeicSpeakingWriting?: number;
  vstepLevel?: number;
  issuedWithinTwoYears?: boolean;
}

export interface UhsBonusInput {
  foreignCertificate?: UhsForeignCertificateInput;
  satScore?: number;
  satIssuedWithinTwoYears?: boolean;
  preferredSchool?: {
    studiedAtLeastTwoYears?: boolean;
    threeYearPerformanceGoodOrBetter?: boolean;
    averageAcademicScore10?: number;
  };
}

export interface UhsBonusResult {
  foreignLanguageBonus?: number;
  satBonus?: number;
  certificateSatBonus?: number;
  preferredSchoolBonus?: number;
  totalBonus: number;
  notes: string[];
}

export function isUhsForeignCertificateEligible(input: UhsForeignCertificateInput | undefined): boolean {
  if (!input?.issuedWithinTwoYears) return false;
  if (input.type === 'ielts') return (input.score ?? 0) >= 6 && (input.score ?? 0) <= 9;
  if (input.type === 'toeflIbt') return (input.score ?? 0) >= 79 && (input.score ?? 0) <= 120;
  if (input.type === 'toeflItp') return (input.score ?? 0) >= 550 && (input.score ?? 0) <= 677;
  if (input.type === 'toeic') return (input.toeicListeningReading ?? 0) >= 671 && (input.toeicSpeakingWriting ?? 0) >= 271;
  if (input.type === 'vstep') return (input.vstepLevel ?? 0) >= 4 && (input.vstepLevel ?? 0) <= 6;
  return false;
}

export function getUhsForeignCertificateScore(input: UhsForeignCertificateInput | undefined): number | undefined {
  if (!isUhsForeignCertificateEligible(input)) return undefined;
  if (input?.type === 'toeic') return input.toeicListeningReading;
  if (input?.type === 'vstep') return input.vstepLevel;
  return input?.score;
}

export function getUhsForeignCertificateMaxScore(type: UhsForeignCertificateType): number {
  if (type === 'ielts') return 9;
  if (type === 'toeflIbt') return 120;
  if (type === 'toeflItp') return 677;
  if (type === 'toeic') return 990;
  return 6;
}

export function isUhsSatEligible(score: number | undefined, issuedWithinTwoYears: boolean | undefined): boolean {
  return issuedWithinTwoYears === true && score !== undefined && score >= 1280 && score <= 1600;
}

export function isUhsPreferredSchoolEligible(input: UhsBonusInput['preferredSchool']): boolean {
  return input?.studiedAtLeastTwoYears === true && input.threeYearPerformanceGoodOrBetter === true && input.averageAcademicScore10 !== undefined;
}

export function calculateUhsBonus(input: UhsBonusInput): UhsBonusResult {
  const notes: string[] = [];
  const certificateScore = getUhsForeignCertificateScore(input.foreignCertificate);
  const foreignLanguageBonus =
    certificateScore !== undefined && input.foreignCertificate
      ? round2((5 * certificateScore) / getUhsForeignCertificateMaxScore(input.foreignCertificate.type))
      : undefined;
  const satBonus = isUhsSatEligible(input.satScore, input.satIssuedWithinTwoYears) ? round2((5 * input.satScore!) / 1600) : undefined;
  const certificateSatBonus = Math.min(5, (foreignLanguageBonus ?? 0) + (satBonus ?? 0));
  if ((foreignLanguageBonus ?? 0) + (satBonus ?? 0) > certificateSatBonus) {
    notes.push('Điểm cộng từ chứng chỉ ngoại ngữ/kết quả SAT được giới hạn tối đa 5 điểm theo nhóm này.');
  }

  const preferredSchoolBonus = isUhsPreferredSchoolEligible(input.preferredSchool)
    ? round2((5 * input.preferredSchool!.averageAcademicScore10!) / 10)
    : undefined;

  return {
    foreignLanguageBonus,
    satBonus,
    certificateSatBonus: certificateSatBonus > 0 ? certificateSatBonus : undefined,
    preferredSchoolBonus,
    totalBonus: round2(certificateSatBonus + (preferredSchoolBonus ?? 0)),
    notes,
  };
}
