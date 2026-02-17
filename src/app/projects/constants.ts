/**
 * @module app/projects/constants
 * @description Constants and utility functions for the projects page.
 */

/** Number of projects to load per page for pagination */
export const PAGE_SIZE = 6;

/** Special tag value used to filter projects with no tags */
export const TAG_NONE = '__none__';

/**
 * Format a project's creation date for display.
 * Shows "Month Year" for month-only dates, or "Month Day, Year" for full dates.
 *
 * @param createdAt - ISO date string from the project
 * @param dateIsMonthOnly - Whether the date should be displayed without day
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatProjectDate('2026-02-15', false); // "February 15, 2026"
 * formatProjectDate('2026-02-01', true);  // "February 2026"
 * ```
 */
export function formatProjectDate(createdAt: string, dateIsMonthOnly?: boolean | null): string {
  const d = new Date(createdAt);
  const month = d.toLocaleString('default', { month: 'long' });
  const year = d.getFullYear();
  if (dateIsMonthOnly) {
    return `${month} ${year}`;
  }
  const day = d.getDate();
  return `${month} ${day}, ${year}`;
}

/**
 * History state for modal navigation stack.
 * Used for browser history management when opening/closing modals.
 */
export type ModalHistoryState =
  /** Gallery modal showing all project images */
  | { modal: 'gallery'; projectId: string }
  /** Photo modal showing single image in carousel */
  | { modal: 'photo'; projectId: string; photoIndex: number }
  /** No modal open */
  | null;
