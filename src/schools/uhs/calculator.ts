import { round2 } from '../../core/round2';

export const UHS_THPT_WEIGHT_RANGE = { min: 0.3, max: 0.35 } as const;
export const UHS_DGNL_WEIGHT_RANGE = { min: 0.45, max: 0.5 } as const;
export const UHS_TRANSCRIPT_WEIGHT = 0.2;
export const UHS_MISSING_DGNL_FROM_THPT_FACTOR = 0.87;
export const UHS_MISSING_THPT_FROM_DGNL_FACTOR = 1.15;

export interface UhsComponentInput {
  thptTotal30?: number;
  dgnlRaw1200?: number;
  transcriptTotal30?: number;
  graduationYear?: number;
}

export interface UhsNormalizedComponents {
  thpt100?: number;
  dgnl100?: number;
  transcript100?: number;
  inferredDgnlFromThpt?: boolean;
  inferredThptFromDgnl?: boolean;
}

export function normalizeUhsThptTo100(thptTotal30: number): number {
  return round2((thptTotal30 * 100) / 30);
}

export function normalizeUhsDgnlTo100(dgnlRaw1200: number): number {
  return round2((dgnlRaw1200 * 100) / 1200);
}

export function normalizeUhsTranscriptTo100(transcriptTotal30: number): number {
  return round2((transcriptTotal30 * 100) / 30);
}

export function inferUhsDgnlFromThpt100(thpt100: number): number {
  return round2(thpt100 * UHS_MISSING_DGNL_FROM_THPT_FACTOR);
}

export function inferUhsThptFromDgnl100(dgnl100: number): number {
  return round2(dgnl100 * UHS_MISSING_THPT_FROM_DGNL_FACTOR);
}

export function calculateUhsNormalizedComponents(input: UhsComponentInput): UhsNormalizedComponents {
  const thpt100 = input.thptTotal30 !== undefined ? normalizeUhsThptTo100(input.thptTotal30) : undefined;
  const dgnl100 = input.dgnlRaw1200 !== undefined ? normalizeUhsDgnlTo100(input.dgnlRaw1200) : undefined;
  const transcript100 = input.transcriptTotal30 !== undefined ? normalizeUhsTranscriptTo100(input.transcriptTotal30) : undefined;

  if (thpt100 !== undefined && dgnl100 === undefined && input.graduationYear === 2026) {
    return { thpt100, dgnl100: inferUhsDgnlFromThpt100(thpt100), transcript100, inferredDgnlFromThpt: true };
  }

  if (dgnl100 !== undefined && thpt100 === undefined && input.graduationYear !== undefined && input.graduationYear < 2026) {
    return { thpt100: inferUhsThptFromDgnl100(dgnl100), dgnl100, transcript100, inferredThptFromDgnl: true };
  }

  return { thpt100, dgnl100, transcript100 };
}
