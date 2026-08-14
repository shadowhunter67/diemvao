import type { MissingRequirement, MissingRequirementAction } from '../core/admissionEvaluation';

const SCHOOL_CONTEXT_ACTIONS: Record<string, Record<string, MissingRequirementAction>> = {
  hcmut: {
    'hcmut-context': { href: '/hcmut#subject-context', label: 'Bo sung ngu canh HCMUT' },
    program: { href: '/hcmut#programs', label: 'Chon nganh de so diem chuan' },
  },
  uel: {
    'uel-subject-combination': { href: '/uel#subject-combination', label: 'Chon to hop UEL' },
    program: { href: '/uel#programs', label: 'Chon nganh de so diem chuan' },
  },
  ueh: {
    program: { href: '/ueh#programs', label: 'Chon nganh de so diem chuan' },
  },
  uit: {
    program: { href: '/uit#programs', label: 'Chon nganh de so diem chuan' },
  },
  hcmus: {
    'hcmus-subject-combination': { href: '/hcmus#threshold', label: 'Chon to hop HCMUS' },
    program: { href: '/hcmus#programs', label: 'Chon nganh HCMUS' },
  },
  uhs: {
    program: { href: '/uhs#programs', label: 'Chon nganh UHS' },
    'uhs-subject-combination': { href: '/uhs#programs', label: 'Chon to hop UHS' },
  },
};

const PROFILE_INPUT_ACTIONS: Record<string, Record<string, MissingRequirementAction>> = {
  hcmut: {
    'hcmut-dgnl': { href: '/hcmut#dgnl', label: 'Nhap DGNL HCMUT' },
    'hcmut-thpt': { href: '/hcmut#thpt', label: 'Nhap diem THPT HCMUT' },
    'hcmut-transcript': { href: '/hcmut#transcript', label: 'Nhap hoc ba HCMUT' },
    'hcmut-profile-input': { href: '/hcmut#dgnl', label: 'Bo sung ho so HCMUT' },
  },
  ueh: {
    'ueh-dgnl': { href: '/ueh#dgnl', label: 'Nhap DGNL UEH' },
  },
  uel: {
    'uel-dgnl': { href: '/uel#dgnl', label: 'Nhap DGNL UEL' },
  },
  uit: {
    'uit-dgnl': { href: '/uit#dgnl', label: 'Nhap DGNL UIT' },
  },
  hcmus: {
    'hcmus-transcript': { href: '/hcmus#academic-score', label: 'Nhap hoc ba HCMUS' },
    'hcmus-thpt-or-vact': { href: '/hcmus#academic-score', label: 'Nhap THPT hoac DGNL HCMUS' },
    'hcmus-nuclear-math-physics': { href: '/hcmus#threshold', label: 'Nhap Toan/Ly HCMUS' },
  },
  uhs: {
    'uhs-grade12-performance': { href: '/uhs#programs', label: 'Nhap hoc luc lop 12 UHS' },
    'uhs-dgnl-or-conversion': { href: '/uhs#components', label: 'Nhap DGNL hoac du lieu quy doi UHS' },
    'uhs-transcript': { href: '/uhs#components', label: 'Nhap hoc ba UHS' },
  },
};

export function getMissingRequirementAction(schoolId: string, requirement: MissingRequirement): MissingRequirementAction | undefined {
  if (requirement.kind === 'official-rule' || requirement.kind === 'unsupported') return undefined;
  if (requirement.kind === 'school-context') return SCHOOL_CONTEXT_ACTIONS[schoolId]?.[requirement.code];
  if (requirement.kind === 'profile-input') {
    if (schoolId === 'uel' && requirement.code.startsWith('uel-thpt-')) {
      return { href: '/uel#thpt', label: 'Nhap diem THPT UEL' };
    }
    if (schoolId === 'hcmus' && requirement.code.startsWith('hcmus-thpt-')) {
      return { href: '/hcmus#threshold', label: 'Nhap diem THPT HCMUS' };
    }
    if (schoolId === 'uhs' && requirement.code.startsWith('uhs-thpt-')) {
      return { href: '/uhs#components', label: 'Nhap diem THPT UHS' };
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
