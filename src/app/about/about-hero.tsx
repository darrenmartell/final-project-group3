/**
 * @file About page hero section component with editable title and tagline
 * @module app/about/about-hero
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Default title displayed when no custom title is set */
const DEFAULT_TITLE = 'About Shoreline Woodworks';

/** Default tagline displayed when no custom tagline is set */
const DEFAULT_TAGLINE = 'Learn all about us — our craft, materials, and services.';

/**
 * Props for the AboutHero component
 */
type Props = {
  /** The initial title value from the database, or null if not set */
  initialTitle: string | null;
  /** The initial tagline value from the database, or null if not set */
  initialTagline: string | null;
  /** Whether the current user has admin privileges */
  isAdmin: boolean;
};

/**
 * Hero section for the About page with editable title and tagline.
 * Allows admin users to edit and save the page title and tagline via inline editing.
 *
 * @param props - Component props
 * @returns The About hero section component
 */
export default function AboutHero({
  initialTitle,
  initialTagline,
  isAdmin,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(initialTitle ?? DEFAULT_TITLE);
  const [tagline, setTagline] = useState(initialTagline ?? DEFAULT_TAGLINE);

  const displayTitle = initialTitle ?? DEFAULT_TITLE;
  const displayTagline = initialTagline ?? DEFAULT_TAGLINE;

  /**
   * Saves the edited title and tagline to the database via API calls.
   * Refreshes the router to display updated content.
   */
  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all([
        fetch('/api/site-settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'about.pageTitle', value: title }),
        }),
        fetch('/api/site-settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'about.pageTagline', value: tagline }),
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
    setTitle(initialTitle ?? DEFAULT_TITLE);
    setTagline(initialTagline ?? DEFAULT_TAGLINE);
    setEditing(false);
  }

  return (
    <div className="text-center mb-12">
      {editing ? (
        <div className="space-y-4 max-w-2xl mx-auto">
          <label htmlFor="about-hero-title" className="sr-only">
            Page title
          </label>
          <input
            id="about-hero-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-background border border-border rounded px-3 py-2 text-4xl font-bold text-center text-foreground"
            aria-label="Page title"
          />
          <label htmlFor="about-hero-tagline" className="sr-only">
            Tagline
          </label>
          <input
            id="about-hero-tagline"
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-background border border-border rounded px-3 py-2 text-lg text-center text-foreground"
            aria-label="Tagline"
          />
          <div className="flex gap-2 justify-center">
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
          <h1 className="text-4xl font-bold mb-4">{displayTitle}</h1>
          <p className="text-lg text-muted-foreground">{displayTagline}</p>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-4 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Edit
            </button>
          )}
        </>
      )}
    </div>
  );
}
