import { describe, expect, it } from 'vitest';
import { activeAdmissionConfig } from '../config/admission-2026';
import { defaultAdmissionFormState } from '../types/form';
import { applySearchParamsToForm, parseTargetFromSearchParams, serializeStateToSearchParams } from './urlState';

const config = activeAdmissionConfig;

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
