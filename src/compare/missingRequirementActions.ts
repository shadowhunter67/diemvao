import type { MissingRequirement, MissingRequirementAction } from '../core/admissionEvaluation';

const SCHOOL_CONTEXT_ACTIONS: Record<string, Record<string, MissingRequirementAction>> = {
  hcmut: {
    'hcmut-context': { href: '/hcmut#subject-context', label: 'Bổ sung ngữ cảnh HCMUT' },
    program: { href: '/hcmut#programs', label: 'Chọn ngành để so điểm chuẩn' },
  },
  uel: {
    'uel-subject-combination': { href: '/uel#subject-combination', label: 'Chọn tổ hợp UEL' },
    program: { href: '/uel#programs', label: 'Chọn ngành để so điểm chuẩn' },
  },
  ueh: {
    program: { href: '/ueh#programs', label: 'Chọn ngành để so điểm chuẩn' },
  },
  iu: {
    program: { href: '/iu#programs', label: 'Chọn ngành IU' },
    'iu-subject-combination': { href: '/iu#academic-score', label: 'Chọn tổ hợp IU' },
  },
  uit: {
    program: { href: '/uit#programs', label: 'Chọn ngành để so điểm chuẩn' },
  },
  hcmus: {
    'hcmus-subject-combination': { href: '/hcmus#threshold', label: 'Chọn tổ hợp HCMUS' },
    program: { href: '/hcmus#programs', label: 'Chọn ngành HCMUS' },
  },
  uhs: {
    program: { href: '/uhs#programs', label: 'Chọn ngành UHS' },
    'uhs-subject-combination': { href: '/uhs#programs', label: 'Chọn tổ hợp UHS' },
  },
};

const PROFILE_INPUT_ACTIONS: Record<string, Record<string, MissingRequirementAction>> = {
  hcmut: {
    'hcmut-dgnl': { href: '/hcmut#dgnl', label: 'Nhập DGNL HCMUT' },
    'hcmut-thpt': { href: '/hcmut#thpt', label: 'Nhập điểm THPT HCMUT' },
    'hcmut-transcript': { href: '/hcmut#transcript', label: 'Nhập học bạ HCMUT' },
    'hcmut-profile-input': { href: '/hcmut#dgnl', label: 'Bổ sung hồ sơ HCMUT' },
  },
  ueh: {
    'ueh-dgnl': { href: '/ueh#dgnl', label: 'Nhập DGNL UEH' },
    'ueh-exam-score-30': { href: '/ueh#calculator', label: 'Nhập điểm thi UEH' },
    'ueh-gpa': { href: '/ueh#calculator', label: 'Nhập học bạ UEH' },
  },
  uel: {
    'uel-dgnl': { href: '/uel#dgnl', label: 'Nhập DGNL UEL' },
  },
  uit: {
    'uit-dgnl': { href: '/uit#dgnl', label: 'Nhập DGNL UIT' },
  },
  hcmus: {
    'hcmus-transcript': { href: '/hcmus#academic-score', label: 'Nhập học bạ HCMUS' },
    'hcmus-thpt-or-vact': { href: '/hcmus#academic-score', label: 'Nhập THPT hoặc DGNL HCMUS' },
    'hcmus-nuclear-math-physics': { href: '/hcmus#threshold', label: 'Nhập Toán/Lý HCMUS' },
  },
  uhs: {
    'uhs-grade12-performance': { href: '/uhs#programs', label: 'Nhập học lực lớp 12 UHS' },
    'uhs-dgnl-or-conversion': { href: '/uhs#components', label: 'Nhập DGNL hoặc dữ liệu quy đổi UHS' },
    'uhs-transcript': { href: '/uhs#components', label: 'Nhập học bạ UHS' },
  },
};

export function getMissingRequirementAction(schoolId: string, requirement: MissingRequirement): MissingRequirementAction | undefined {
  if (requirement.kind === 'official-rule' || requirement.kind === 'unsupported') return undefined;
  if (requirement.kind === 'school-context') return SCHOOL_CONTEXT_ACTIONS[schoolId]?.[requirement.code];
  if (requirement.kind === 'profile-input') {
    if (schoolId === 'uel' && requirement.code.startsWith('uel-thpt-')) {
      return { href: '/uel#thpt', label: 'Nhập điểm THPT UEL' };
    }
    if (schoolId === 'hcmus' && requirement.code.startsWith('hcmus-thpt-')) {
      return { href: '/hcmus#threshold', label: 'Nhập điểm THPT HCMUS' };
    }
    if (schoolId === 'uhs' && requirement.code.startsWith('uhs-thpt-')) {
      return { href: '/uhs#components', label: 'Nhập điểm THPT UHS' };
    }
    if (schoolId === 'iu' && requirement.code.startsWith('iu-subject-')) {
      return { href: '/iu#academic-score', label: 'Nhập điểm THPT/học bạ IU' };
    }
    return PROFILE_INPUT_ACTIONS[schoolId]?.[requirement.code];
  }
  return undefined;
}

export function withMissingRequirementActions(schoolId: string, requirements: readonly MissingRequirement[]): MissingRequirement[] {
  return requirements.map((requirement) => ({
    ...requirement,
    action: requirement.action ?? getMissingRequirementAction(schoolId, requirement),
  }));
}
