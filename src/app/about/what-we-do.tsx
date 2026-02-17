/**
 * @file What We Do section component for the About page
 * @module app/about/what-we-do
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Represents a single card in the What We Do section
 */
export type WhatWeDoCard = { title: string; description: string };

/** Default heading displayed when no custom heading is set */
const DEFAULT_HEADING = 'What We Do';

/** Default service cards displayed when no custom cards are set */
const DEFAULT_CARDS: WhatWeDoCard[] = [
  { title: 'Custom Stairs & Railings', description: 'Hand-crafted staircases and railings designed to complement any home aesthetic.' },
  { title: 'Millwork & Cabinetry', description: 'Built-in cabinets, shelving, and architectural millwork tailored to your vision.' },
  { title: 'Flooring Installation', description: 'Premium hardwood flooring selection and expert installation.' },
  { title: 'Home Renovations', description: 'Full renovation projects with woodworking and custom details.' },
  { title: 'Restoration & Repair', description: 'Expert restoration and repair of existing woodwork and furniture.' },
  { title: 'Design Consultation', description: 'Personalized consultations to bring your vision to life.' },
];

/**
 * Props for the WhatWeDo component
 */
type Props = {
  /** The initial heading value from the database, or null if not set */
  initialHeading: string | null;
  /** The initial array of service cards from the database, or null if not set */
  initialCards: WhatWeDoCard[] | null;
  /** Whether the current user has admin privileges */
  isAdmin: boolean;
};

/**
 * What We Do section component with editable service cards.
 * Allows admin users to edit and save service information via inline editing.
 * Displays services in a responsive grid layout.
 *
 * @param props - Component props
 * @returns The What We Do section component
 */
export default function WhatWeDo({
  initialHeading,
  initialCards,
  isAdmin,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [heading, setHeading] = useState(initialHeading ?? DEFAULT_HEADING);
  const [cards, setCards] = useState<WhatWeDoCard[]>(
    initialCards?.length ? initialCards : DEFAULT_CARDS
  );

  const displayHeading = initialHeading ?? DEFAULT_HEADING;
  const displayCards = (initialCards?.length ? initialCards : DEFAULT_CARDS) as WhatWeDoCard[];

  /**
   * Saves the edited heading and cards to the database as JSON via API call.
   * Refreshes the router to display updated content.
   */
  async function handleSave() {
    setSaving(true);
    try {
      await fetch('/api/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'about.whatWeDo',
          value: JSON.stringify({ heading, cards }),
        }),
      });
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
    setCards(initialCards?.length ? initialCards : DEFAULT_CARDS);
    setEditing(false);
  }

  /**
   * Updates a specific field of a card at the given index.
   *
   * @param index - The index of the card to update
   * @param field - The field to update ('title' or 'description')
   * @param value - The new value for the field
   */
  function updateCard(index: number, field: 'title' | 'description', value: string) {
    setCards((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  return (
    <section aria-labelledby="what-we-do" className="bg-muted p-6 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 id="what-we-do" className="text-2xl font-semibold">
            {editing ? (
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="bg-background border border-border rounded px-3 py-2 w-full max-w-md text-2xl font-semibold"
                aria-label="What We Do heading"
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="p-5 bg-card rounded shadow border border-border space-y-3"
                >
                  <label
                    htmlFor={`what-we-do-card-${index}-title`}
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Card {index + 1} title
                  </label>
                  <input
                    id={`what-we-do-card-${index}-title`}
                    type="text"
                    value={card.title}
                    onChange={(e) => updateCard(index, 'title', e.target.value)}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                    aria-label={`Card ${index + 1} title`}
                  />
                  <label
                    htmlFor={`what-we-do-card-${index}-description`}
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Card {index + 1} description
                  </label>
                  <textarea
                    id={`what-we-do-card-${index}-description`}
                    value={card.description}
                    onChange={(e) => updateCard(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground resize-y text-sm"
                    aria-label={`Card ${index + 1} description`}
                  />
                </div>
              ))}
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCards.map((card, index) => (
              <div
                key={index}
                className="p-5 bg-card rounded shadow border border-border"
              >
                <h3 className="font-medium mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
