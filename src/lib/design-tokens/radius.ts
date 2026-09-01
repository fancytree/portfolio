export const caseRadiusPx = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const caseRadius = {
  sm: 'var(--case-radius-sm)',
  md: 'var(--case-radius-md)',
  lg: 'var(--case-radius-lg)',
  xl: 'var(--case-radius-xl)',
  full: 'var(--case-radius-full)',
} as const;
