import type { YearMonth } from '../content/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-08" → "Aug 2026" */
export function formatMonth(value: YearMonth): string {
  const [year, month] = value.split('-');
  return `${MONTHS[Number(month) - 1] ?? ''} ${year}`.trim();
}

/** ("2025-10", "present") → "Oct 2025 — Present" */
export function formatRange(start: YearMonth, end: YearMonth | 'present'): string {
  return `${formatMonth(start)} — ${end === 'present' ? 'Present' : formatMonth(end)}`;
}
