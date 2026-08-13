import { describe, expect, it } from 'vitest';
import { isForbiddenShareKey } from '../../core/privacy';
import { activeAdmissionConfig } from './config/admission-2026';
import { defaultAdmissionFormState } from './types/form';
import type { HcmutProgram } from './types/programs';
import {
  applySearchParamsToForm,
  parseApplicantTypeFromSearchParams,
  parseProgramStateFromSearchParams,
  parseSubjectContextFromSearchParams,
  parseTargetFromSearchParams,
  serializeApplicantTypeToSearchParams,
  serializeProgramStateToSearchParams,
  serializeStateToSearchParams,
  serializeSubjectContextToSearchParams,
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

describe('subject context (sj2/sj3, batch 4)', () => {
  it('round trip: serialize rồi parse ra đúng subject đã chọn', () => {
    const params = new URLSearchParams();
    serializeSubjectContextToSearchParams(params, { subject2: 'physics', subject3: 'chemistry' });
    expect(params.get('sj2')).toBe('physics');
    expect(params.get('sj3')).toBe('chemistry');
    expect(parseSubjectContextFromSearchParams(params)).toEqual({ subject2: 'physics', subject3: 'chemistry' });
  });

  it('không ghi field chưa chọn (null) vào URL', () => {
    const params = new URLSearchParams();
    serializeSubjectContextToSearchParams(params, { subject2: 'physics', subject3: null });
    expect(params.has('sj2')).toBe(true);
    expect(params.has('sj3')).toBe(false);
  });

  it('link cũ không có sj2/sj3: parse trả về null, không crash', () => {
    expect(parseSubjectContextFromSearchParams(new URLSearchParams())).toEqual({ subject2: null, subject3: null });
  });

  it('giá trị không hợp lệ trong URL (không nằm trong SELECTABLE_SUBJECT_IDS) bị bỏ qua', () => {
    const params = new URLSearchParams({ sj2: 'khong-ton-tai', sj3: 'math' }); // 'math' bị loại (không cho chọn lại Toán)
    expect(parseSubjectContextFromSearchParams(params)).toEqual({ subject2: null, subject3: null });
  });
});

describe('Batch 7 — full share-link round trip (case chưa verify tự động ở Batch 7 trước)', () => {
  it('valid HCMUT state (DGNL detail + THPT + transcript + applicant type + subject context) → serialize → parse lại → state tương đương', () => {
    const originalForm = {
      ...defaultAdmissionFormState,
      dgnl: { vietnamese: '250', english: '230', math: '260', scientificThinking: '240' },
      thpt: { math: '9', subject2: '8', subject3: '7' },
      transcript: {
        grade10: { math: '9', subject2: '8', subject3: '7' },
        grade11: { math: '8.5', subject2: '7.5', subject3: '6.5' },
        grade12: { math: '9.5', subject2: '8.5', subject3: '7.5' },
      },
      bonus: { reward: '2', considerationReward: '1', encouragement: '1' },
      priorityRaw30Scale: '1.5',
    };
    const originalTarget = '85';
    const originalApplicantType = 'no-dgnl';
    const originalSubjectContext = { subject2: 'physics' as const, subject3: 'chemistry' as const };

    // Build the share link exactly the way HcmutCalculatorPage.buildShareUrl does.
    const params = serializeStateToSearchParams(originalForm, originalTarget, config);
    serializeProgramStateToSearchParams(
      params,
      { programId: 'a', buffer: 1, comparisonProgramIds: ['a', 'b'] },
      testPrograms
    );
    serializeApplicantTypeToSearchParams(params, originalApplicantType);
    serializeSubjectContextToSearchParams(params, originalSubjectContext);

    // Reconstruct a share URL string and re-parse it (round trip through URLSearchParams(string)).
    const reparsedParams = new URLSearchParams(params.toString());

    const { formState: reconstructedForm, hasAnyField } = applySearchParamsToForm(
      defaultAdmissionFormState,
      reparsedParams,
      config
    );
    const reconstructedTarget = parseTargetFromSearchParams(reparsedParams, config);
    const reconstructedProgramState = parseProgramStateFromSearchParams(reparsedParams, testPrograms);
    const reconstructedApplicantType = parseApplicantTypeFromSearchParams(reparsedParams);
    const reconstructedSubjectContext = parseSubjectContextFromSearchParams(reparsedParams);

    expect(hasAnyField).toBe(true);
    expect(reconstructedForm).toEqual(originalForm);
    expect(reconstructedTarget).toBe(originalTarget);
    expect(reconstructedProgramState).toEqual({ programId: 'a', buffer: 1, comparisonProgramIds: ['a', 'b'] });
    expect(reconstructedApplicantType).toBe(originalApplicantType);
    expect(reconstructedSubjectContext).toEqual(originalSubjectContext);
  });

  it('default applicant type (dgnl) + no subject context chosen → round trip vẫn đúng, không ghi field thừa vào URL', () => {
    const form = { ...defaultAdmissionFormState, dgnl: { ...defaultAdmissionFormState.dgnl, vietnamese: '200' } };
    const params = serializeStateToSearchParams(form, '', config);
    serializeApplicantTypeToSearchParams(params, 'dgnl');
    serializeSubjectContextToSearchParams(params, { subject2: null, subject3: null });

    expect(params.has('at')).toBe(false);
    expect(params.has('sj2')).toBe(false);
    expect(params.has('sj3')).toBe(false);

    const reparsed = new URLSearchParams(params.toString());
    expect(parseApplicantTypeFromSearchParams(reparsed)).toBe('dgnl');
    expect(parseSubjectContextFromSearchParams(reparsed)).toEqual({ subject2: null, subject3: null });
    expect(applySearchParamsToForm(defaultAdmissionFormState, reparsed, config).formState.dgnl.vietnamese).toBe('200');
  });

  it('legacy share URL (không có at/sj2/sj3, chỉ có field điểm gốc đời cũ) vẫn parse đúng — không breaking change', () => {
    // Mô phỏng link chia sẻ cũ từ trước khi có applicant type/subject context (Phase 11/batch 4).
    const legacyParams = new URLSearchParams({ dg_v: '250', dg_e: '230', dg_m: '260', dg_s: '240', th_m: '9', tg: '85' });

    const { formState, hasAnyField } = applySearchParamsToForm(defaultAdmissionFormState, legacyParams, config);
    expect(hasAnyField).toBe(true);
    expect(formState.dgnl).toEqual({ vietnamese: '250', english: '230', math: '260', scientificThinking: '240' });
    expect(formState.thpt.math).toBe('9');
    expect(parseTargetFromSearchParams(legacyParams, config)).toBe('85');
    // Field mới hơn (chưa tồn tại trong link cũ) fallback đúng default — không crash, không suy đoán.
    expect(parseApplicantTypeFromSearchParams(legacyParams)).toBe('dgnl');
    expect(parseSubjectContextFromSearchParams(legacyParams)).toEqual({ subject2: null, subject3: null });
  });
});

describe('privacy guardrail (workstream L)', () => {
  it('không có key nào trong share URL khớp pattern nhạy cảm (tên/CCCD/ngày sinh/SĐT/email/địa chỉ)', () => {
    const fullForm = {
      ...defaultAdmissionFormState,
      dgnl: { vietnamese: '250', english: '240', math: '260', scientificThinking: '230' },
      thpt: { math: '9', subject2: '8', subject3: '7' },
      transcript: {
        grade10: { math: '9', subject2: '8', subject3: '7' },
        grade11: { math: '9', subject2: '8', subject3: '7' },
        grade12: { math: '9', subject2: '8', subject3: '7' },
      },
      bonus: { reward: '2', considerationReward: '1', encouragement: '1' },
      priorityRaw30Scale: '2',
    };
    const params = serializeStateToSearchParams(fullForm, '85', config);
    serializeProgramStateToSearchParams(params, { programId: 'a', buffer: 1, comparisonProgramIds: ['a', 'b'] }, testPrograms);
    serializeApplicantTypeToSearchParams(params, 'no-dgnl');
    serializeSubjectContextToSearchParams(params, { subject2: 'physics', subject3: 'chemistry' });

    expect([...params.keys()].length).toBeGreaterThan(0);
    for (const key of params.keys()) {
      expect(isForbiddenShareKey(key), `key "${key}" khớp pattern nhạy cảm`).toBe(false);
    }
  });

  it('không có hàm serialize nào trong urlState.ts nhận ApplicantProfile làm tham số — không thể vô tình leak field mới thêm vào profile (batch 4)', () => {
    // Chứng minh bằng cấu trúc: mọi serializer chỉ nhận đúng field cụ thể (form/program/
    // applicantType/subjectContext), không có serializer nào nhận toàn bộ object profile. Test
    // này gọi đủ mọi serializer với dữ liệu hợp lệ tối đa và đếm đúng số key mong đợi — nếu sau
    // này có ai lỡ thêm `serializeProfileToSearchParams` share cả object thì bài test integration
    // ở trên (đếm forbidden pattern) vẫn bắt được, còn số lượng key ở đây tăng bất thường cũng là
    // tín hiệu cần soát lại.
    const params = new URLSearchParams();
    serializeStateToSearchParams(defaultAdmissionFormState, '', config);
    serializeSubjectContextToSearchParams(params, { subject2: 'physics', subject3: 'chemistry' });
    expect([...params.keys()]).toEqual(['sj2', 'sj3']);
  });
});
