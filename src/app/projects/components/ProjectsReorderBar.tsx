/**
 * @module app/projects/components/ProjectsReorderBar
 * @description Admin toolbar for entering/exiting project reorder mode.
 */
'use client';

/**
 * Props for the ProjectsReorderBar component.
 */
type Props = {
  /** Whether reorder mode is currently active */
  isReorderMode: boolean;
  /** Whether the new order is being saved */
  isSavingOrder: boolean;
  /** Callback to enter reorder mode */
  onEnterReorderMode: () => void;
  /** Callback to cancel reordering and restore original order */
  onCancelReorder: () => void;
  /** Callback to save the new order */
  onSaveOrder: () => void;
};

/**
 * Admin toolbar for project reordering.
 * Shows "Edit order" button when not in reorder mode,
 * or Cancel/Save buttons when reordering.
 *
 * @param props - Component props
 * @returns The reorder bar JSX element
 *
 * @example
 * ```tsx
 * <ProjectsReorderBar
 *   isReorderMode={isReorderMode}
 *   isSavingOrder={isSaving}
 *   onEnterReorderMode={() => setIsReorderMode(true)}
 *   onCancelReorder={handleCancel}
 *   onSaveOrder={handleSave}
 * />
 * ```
 */
export default function ProjectsReorderBar({
  isReorderMode,
  isSavingOrder,
  onEnterReorderMode,
  onCancelReorder,
  onSaveOrder,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 mb-8">
      {isReorderMode ? (
        <>
          <button
            onClick={onCancelReorder}
            disabled={isSavingOrder}
            className="px-4 py-2 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSaveOrder}
            disabled={isSavingOrder}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingOrder ? 'Saving…' : 'Save order'}
          </button>
        </>
      ) : (
        <button
          onClick={onEnterReorderMode}
          className="px-4 py-2 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
        >
          Edit order
        </button>
      )}
    </div>
  );
}
