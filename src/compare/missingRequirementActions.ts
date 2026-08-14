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
  uit: {
    program: { href: '/uit#programs', label: 'Chọn ngành để so điểm chuẩn' },
  },
  hcmus: {
    'hcmus-subject-combination': { href: '/hcmus#threshold', label: 'Chọn tổ hợp HCMUS' },
    program: { href: '/hcmus#programs', label: 'Chọn ngành HCMUS' },
  },
};

const PROFILE_INPUT_ACTIONS: Record<string, Record<string, MissingRequirementAction>> = {
  hcmut: {
    'hcmut-dgnl': { href: '/hcmut#dgnl', label: 'Nhập ĐGNL HCMUT' },
    'hcmut-thpt': { href: '/hcmut#thpt', label: 'Nhập điểm THPT HCMUT' },
    'hcmut-transcript': { href: '/hcmut#transcript', label: 'Nhập học bạ HCMUT' },
    'hcmut-profile-input': { href: '/hcmut#dgnl', label: 'Bổ sung hồ sơ HCMUT' },
  },
  ueh: {
    'ueh-dgnl': { href: '/ueh#dgnl', label: 'Nhập ĐGNL UEH' },
  },
  uel: {
    'uel-dgnl': { href: '/uel#dgnl', label: 'Nhập ĐGNL UEL' },
  },
  uit: {
    'uit-dgnl': { href: '/uit#dgnl', label: 'Nhập ĐGNL UIT' },
  },
  hcmus: {
    'hcmus-transcript': { href: '/hcmus#academic-score', label: 'Nhập học bạ HCMUS' },
    'hcmus-thpt-or-vact': { href: '/hcmus#academic-score', label: 'Nhập THPT hoặc ĐGNL HCMUS' },
    'hcmus-nuclear-math-physics': { href: '/hcmus#threshold', label: 'Nhập Toán/Lý HCMUS' },
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
