/**
 * @module app/projects/components/ProjectsFilters
 * @description Filter controls for the projects gallery.
 */
'use client';

import { TAG_NONE } from '../constants';

/**
 * Props for the ProjectsFilters component.
 */
type Props = {
  /** Available tag names for filtering */
  tagNames: string[];
  /** Available years for filtering */
  years: number[];
  /** Currently selected tag (null = all, TAG_NONE = untagged) */
  selectedTag: string | null;
  /** Currently selected year (null = all time) */
  selectedYear: number | null;
  /** Whether reorder mode is active (hides filters) */
  isReorderMode: boolean;
  /** Callback when tag filter changes */
  onTagChange: (tag: string | null) => void;
  /** Callback when year filter changes */
  onYearChange: (year: number | null) => void;
};

/**
 * Filter controls component for the projects gallery.
 * Displays tag buttons and year dropdown for filtering projects.
 * Shows reorder mode message when in reorder mode.
 *
 * @param props - Component props
 * @returns The filters JSX element
 *
 * @example
 * ```tsx
 * <ProjectsFilters
 *   tagNames={['Featured', 'New']}
 *   years={[2026, 2025]}
 *   selectedTag={null}
 *   selectedYear={null}
 *   isReorderMode={false}
 *   onTagChange={setSelectedTag}
 *   onYearChange={setSelectedYear}
 * />
 * ```
 */
export default function ProjectsFilters({
  tagNames,
  years,
  selectedTag,
  selectedYear,
  isReorderMode,
  onTagChange,
  onYearChange,
}: Props) {
  if (isReorderMode) {
    return (
      <p className="text-muted-foreground mb-4">
        {selectedYear !== null
          ? `Showing all projects from ${selectedYear} in true order. Drag cards to reorder.`
          : 'Showing all projects in true order. Drag cards to reorder.'}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Tag:</span>
        <button
          onClick={() => onTagChange(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedTag === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onTagChange(TAG_NONE)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedTag === TAG_NONE
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          None
        </button>
        {tagNames.map((name) => (
          <button
            key={name}
            onClick={() => onTagChange(name)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedTag === name
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Year:</span>
        <select
          aria-label="Filter by year"
          value={selectedYear ?? ''}
          onChange={(e) => onYearChange(e.target.value ? parseInt(e.target.value, 10) : null)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All time</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
