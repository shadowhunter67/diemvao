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
};

export function getMissingRequirementAction(schoolId: string, requirement: MissingRequirement): MissingRequirementAction | undefined {
  if (requirement.kind === 'official-rule' || requirement.kind === 'unsupported') return undefined;
  if (requirement.kind === 'school-context') return SCHOOL_CONTEXT_ACTIONS[schoolId]?.[requirement.code];
  if (requirement.kind === 'profile-input') {
    if (schoolId === 'uel' && requirement.code.startsWith('uel-thpt-')) {
      return { href: '/uel#thpt', label: 'Nhập điểm THPT UEL' };
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
