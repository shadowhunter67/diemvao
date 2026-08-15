import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Re-audit 2026-08-15: the public UEL "To hop tuyen sinh" HTML now exposes
 * the language-certificate bonus table, so the old Appendix/Drive blocker is no
 * longer a runtime exactness blocker for the certificate types represented in
 * ApplicantProfile (IELTS, TOEFL iBT, TOEIC). Linguaskill/Cambridge remain source
 * data, but are not user input fields yet, so they do not block supported-scope
 * exact evaluation.
 */
export const uelKnowledgeGaps: KnowledgeGap[] = [];
