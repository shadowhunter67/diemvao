import type { ApplicantProfile } from '../../core/applicantProfile';

export interface DavConversionBand {
  source: 'ielts' | 'toeflIbt' | 'sat' | 'act';
  min: number;
  max?: number;
  convertedScore: number;
  scale: 10 | 20;
  sourceId: 'dav-admission-info-pdf-2026';
  page: number;
}

export const DAV_LANGUAGE_CONVERSION_BANDS: readonly DavConversionBand[] = [
  { source: 'ielts', min: 6.0, convertedScore: 8.0, scale: 10, sourceId: 'dav-admission-info-pdf-2026', page: 14 },
  { source: 'ielts', min: 6.5, convertedScore: 8.5, scale: 10, sourceId: 'dav-admission-info-pdf-2026', page: 14 },
  { source: 'ielts', min: 7.0, convertedScore: 9.0, scale: 10, sourceId: 'dav-admission-info-pdf-2026', page: 14 },
  { source: 'ielts', min: 7.5, convertedScore: 9.5, scale: 10, sourceId: 'dav-admission-info-pdf-2026', page: 14 },
  { source: 'ielts', min: 8.0, max: 9.0, convertedScore: 10, scale: 10, sourceId: 'dav-admission-info-pdf-2026', page: 14 },
  { source: 'toeflIbt', min: 60, max: 78, convertedScore: 8.0, scale: 10, sourceId: 'dav-admission-info-pdf-2026', page: 14 },
  { source: 'toeflIbt', min: 79, max: 93, convertedScore: 8.5, scale: 10, sourceId: 'dav-admission-info-pdf-2026', page: 14 },
  { source: 'toeflIbt', min: 94, max: 101, convertedScore: 9.0, scale: 10, sourceId: 'dav-admission-info-pdf-2026', page: 14 },
  { source: 'toeflIbt', min: 102, max: 109, convertedScore: 9.5, scale: 10, sourceId: 'dav-admission-info-pdf-2026', page: 14 },
  { source: 'toeflIbt', min: 110, max: 120, convertedScore: 10, scale: 10, sourceId: 'dav-admission-info-pdf-2026', page: 14 },
];

export const DAV_INTERNATIONAL_TEST_CONVERSION_BANDS: readonly DavConversionBand[] = [
  { source: 'sat', min: 1330, max: 1350, convertedScore: 17.0, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'sat', min: 1360, max: 1380, convertedScore: 17.5, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'sat', min: 1390, max: 1410, convertedScore: 18.0, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'sat', min: 1420, max: 1440, convertedScore: 18.5, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'sat', min: 1450, max: 1480, convertedScore: 19.0, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'sat', min: 1490, max: 1520, convertedScore: 19.5, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'sat', min: 1530, max: 1560, convertedScore: 19.75, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'sat', min: 1570, max: 1600, convertedScore: 20, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'act', min: 29, convertedScore: 17.0, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'act', min: 30, convertedScore: 17.5, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'act', min: 31, convertedScore: 18.0, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'act', min: 32, convertedScore: 18.5, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'act', min: 33, convertedScore: 19.0, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'act', min: 34, convertedScore: 19.5, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'act', min: 35, convertedScore: 19.75, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
  { source: 'act', min: 36, convertedScore: 20, scale: 20, sourceId: 'dav-admission-info-pdf-2026', page: 15 },
];

function convertByBand(score: number | undefined, bands: readonly DavConversionBand[]) {
  if (score === undefined) return undefined;
  return bands
    .filter((band) => score >= band.min && (band.max === undefined || score <= band.max))
    .sort((a, b) => b.min - a.min)[0];
}

export function getBestDavLanguageConversion(profile: ApplicantProfile) {
  const candidates = [
    convertByBand(profile.certificates?.ielts, DAV_LANGUAGE_CONVERSION_BANDS.filter((band) => band.source === 'ielts')),
    convertByBand(profile.certificates?.toeflIbt, DAV_LANGUAGE_CONVERSION_BANDS.filter((band) => band.source === 'toeflIbt')),
  ].filter((band): band is DavConversionBand => band !== undefined);

  return candidates.sort((a, b) => b.convertedScore - a.convertedScore)[0];
}

export function getBestDavInternationalTestConversion(profile: ApplicantProfile) {
  const candidates = [
    convertByBand(profile.certificates?.sat, DAV_INTERNATIONAL_TEST_CONVERSION_BANDS.filter((band) => band.source === 'sat')),
    convertByBand(profile.certificates?.act, DAV_INTERNATIONAL_TEST_CONVERSION_BANDS.filter((band) => band.source === 'act')),
  ].filter((band): band is DavConversionBand => band !== undefined);

  return candidates.sort((a, b) => b.convertedScore - a.convertedScore)[0];
}
