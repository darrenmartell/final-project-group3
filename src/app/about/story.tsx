/**
 * @file Our Story section component for the About page
 * @module app/about/story
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Default heading displayed when no custom heading is set */
const DEFAULT_HEADING = 'Our Story';

/** Default body text displayed when no custom body is set */
const DEFAULT_BODY = `This is where you add your story.`;

/**
 * Props for the Story component
 */
type Props = {
  /** The initial heading value from the database, or null if not set */
  initialHeading: string | null;
  /** The initial body text from the database, or null if not set */
  initialBody: string | null;
  /** Whether the current user has admin privileges */
  isAdmin: boolean;
};

/**
 * Our Story section component with editable heading and body text.
 * Allows admin users to edit and save the company story via inline editing.
 * Supports multi-paragraph formatting with double newlines.
 *
 * @param props - Component props
 * @returns The Story section component
 */
export default function Story({
  initialHeading,
  initialBody,
  isAdmin,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [heading, setHeading] = useState(initialHeading ?? DEFAULT_HEADING);
  const [body, setBody] = useState(initialBody ?? DEFAULT_BODY);

  const displayHeading = initialHeading ?? DEFAULT_HEADING;
  const displayBody = initialBody ?? DEFAULT_BODY;
  const paragraphs = displayBody.trim().split(/\n\n+/).filter(Boolean);

  /**
   * Saves the edited heading and body to the database via API calls.
   * Refreshes the router to display updated content.
   */
  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all([
        fetch('/api/site-settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'about.ourStoryHeading', value: heading }),
        }),
        fetch('/api/site-settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'about.ourStoryBody', value: body }),
        }),
      ]);
      setEditing(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  /**
   * Cancels the editing mode and resets the form to initial values.
   */
  function handleCancel() {
    setHeading(initialHeading ?? DEFAULT_HEADING);
    setBody(initialBody ?? DEFAULT_BODY);
    setEditing(false);
  }

  return (
    <section aria-labelledby="our-story" className="mb-12 bg-muted p-6 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 id="our-story" className="text-2xl font-semibold">
            {editing ? (
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="bg-background border border-border rounded px-3 py-2 w-full max-w-md text-2xl font-semibold"
                aria-label="Our Story heading"
              />
            ) : (
              displayHeading
            )}
          </h2>
          {isAdmin && !editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="shrink-0 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground resize-y"
              aria-label="Our Story body"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="bg-muted-foreground/20 text-foreground px-4 py-2 rounded-md hover:bg-muted-foreground/30 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} className="text-foreground mb-4 last:mb-0">
                  {p.replace(/\n/g, ' ')}
                </p>
              ))
            ) : (
              <p className="text-foreground mb-4">
                {displayBody || ' '}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
