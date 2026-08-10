import { describe, expect, it } from 'vitest';
import { activeAdmissionConfig } from './config/admission-2026';
import { defaultAdmissionFormState } from './types/form';
import type { HcmutProgram } from './types/programs';
import {
  applySearchParamsToForm,
  parseApplicantTypeFromSearchParams,
  parseProgramStateFromSearchParams,
  parseTargetFromSearchParams,
  serializeApplicantTypeToSearchParams,
  serializeProgramStateToSearchParams,
  serializeStateToSearchParams,
} from './urlState';

const config = activeAdmissionConfig;

const testPrograms: HcmutProgram[] = [
  { id: 'a', name: 'Ngành A' },
  { id: 'b', name: 'Ngành B' },
  { id: 'c', name: 'Ngành C' },
];

describe('serializeStateToSearchParams', () => {
  it('only includes non-empty, valid fields', () => {
    const form = {
      ...defaultAdmissionFormState,
      dgnl: { ...defaultAdmissionFormState.dgnl, vietnamese: '250', math: '999' }, // math invalid (>300)
      thpt: { ...defaultAdmissionFormState.thpt, math: '9' },
    };
    const params = serializeStateToSearchParams(form, '85', config);

    expect(params.get('dg_v')).toBe('250');
    expect(params.has('dg_m')).toBe(false); // out-of-range, not shared
    expect(params.get('th_m')).toBe('9');
    expect(params.get('tg')).toBe('85');
    expect(params.has('dg_e')).toBe(false); // empty, not shared
  });

  it('drops an out-of-range target instead of serializing an error state', () => {
    const params = serializeStateToSearchParams(defaultAdmissionFormState, '150', config);
    expect(params.has('tg')).toBe(false);
  });
});

describe('applySearchParamsToForm', () => {
  it('overrides only the fields present and valid in the URL, keeps the rest from base', () => {
    const base = {
      ...defaultAdmissionFormState,
      dgnl: { ...defaultAdmissionFormState.dgnl, vietnamese: '100', english: '100' },
    };
    const params = new URLSearchParams({ dg_v: '250' });
    const { formState, hasAnyField } = applySearchParamsToForm(base, params, config);

    expect(hasAnyField).toBe(true);
    expect(formState.dgnl.vietnamese).toBe('250'); // overridden by URL
    expect(formState.dgnl.english).toBe('100'); // kept from base
  });

  it('does not crash and ignores malformed/out-of-range params', () => {
    const params = new URLSearchParams({ dg_v: 'not-a-number', th_m: '999', unknown_key: 'x' });
    const { formState, hasAnyField } = applySearchParamsToForm(defaultAdmissionFormState, params, config);

    expect(hasAnyField).toBe(false);
    expect(formState).toEqual(defaultAdmissionFormState);
  });
});

describe('parseTargetFromSearchParams', () => {
  it('returns the target when valid', () => {
    const params = new URLSearchParams({ tg: '85' });
    expect(parseTargetFromSearchParams(params, config)).toBe('85');
  });

  it('returns null for an out-of-range or missing target', () => {
    expect(parseTargetFromSearchParams(new URLSearchParams({ tg: '150' }), config)).toBeNull();
    expect(parseTargetFromSearchParams(new URLSearchParams(), config)).toBeNull();
  });
});

describe('program state serialize/parse round trip', () => {
  it('case 7: serialize then parse gives back the same program/buffer/compare state', () => {
    const params = new URLSearchParams();
    serializeProgramStateToSearchParams(
      params,
      { programId: 'a', buffer: 1, comparisonProgramIds: ['a', 'b', 'c'] },
      testPrograms
    );

    expect(params.get('program')).toBe('a');
    expect(params.get('buffer')).toBe('1');
    expect(params.get('compare')).toBe('a,b,c');

    const parsed = parseProgramStateFromSearchParams(params, testPrograms);
    expect(parsed).toEqual({ programId: 'a', buffer: 1, comparisonProgramIds: ['a', 'b', 'c'] });
  });

  it('does not serialize buffer 0 (default) or an unknown program id', () => {
    const params = new URLSearchParams();
    serializeProgramStateToSearchParams(params, { programId: 'z', buffer: 0, comparisonProgramIds: [] }, testPrograms);

    expect(params.has('program')).toBe(false);
    expect(params.has('buffer')).toBe(false);
  });

  it('case 8: unknown program id in the URL is ignored, not crashed', () => {
    const params = new URLSearchParams({ program: 'khong-ton-tai', buffer: '1', compare: 'a,khong-ton-tai,b' });
    const parsed = parseProgramStateFromSearchParams(params, testPrograms);

    expect(parsed.programId).toBeNull();
    expect(parsed.buffer).toBe(1);
    expect(parsed.comparisonProgramIds).toEqual(['a', 'b']);
  });

  it('clamps compare to at most 3 ids and drops duplicates', () => {
    const fourPrograms: HcmutProgram[] = [...testPrograms, { id: 'd', name: 'Ngành D' }];
    const params = new URLSearchParams({ compare: 'a,a,b,c,d' });
    const parsed = parseProgramStateFromSearchParams(params, fourPrograms);

    expect(parsed.comparisonProgramIds).toEqual(['a', 'b', 'c']);
  });

  it('falls back to buffer 0 for a value outside BUFFER_OPTIONS', () => {
    const params = new URLSearchParams({ buffer: '999' });
    expect(parseProgramStateFromSearchParams(params, testPrograms).buffer).toBe(0);
  });
});

describe('applicant type (at=)', () => {
  it('falls back to dgnl when "at" is missing (link cũ không có at)', () => {
    const params = new URLSearchParams();
    expect(parseApplicantTypeFromSearchParams(params)).toBe('dgnl');
  });

  it('falls back to dgnl when "at" has an unknown value', () => {
    const params = new URLSearchParams({ at: 'something-invalid' });
    expect(parseApplicantTypeFromSearchParams(params)).toBe('dgnl');
  });

  it('parses a known applicant type from "at"', () => {
    const params = new URLSearchParams({ at: 'no-dgnl' });
    expect(parseApplicantTypeFromSearchParams(params)).toBe('no-dgnl');
  });

  it('does not write "at" to the URL when applicant type is the default (dgnl)', () => {
    const params = new URLSearchParams();
    serializeApplicantTypeToSearchParams(params, 'dgnl');
    expect(params.has('at')).toBe(false);
  });

  it('writes "at" to the URL when applicant type is not the default', () => {
    const params = new URLSearchParams();
    serializeApplicantTypeToSearchParams(params, 'no-dgnl');
    expect(params.get('at')).toBe('no-dgnl');
  });
});
