/**
 * @file About page - main entry point for the about section
 * @module app/about/page
 */

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AboutHero from './about-hero';
import Story from './story';
import WhatWeDo from './what-we-do';

/** Array of site setting keys used on the About page */
const ABOUT_KEYS = [
  'about.pageTitle',
  'about.pageTagline',
  'about.ourStoryHeading',
  'about.ourStoryBody',
  'about.whatWeDo',
] as const;

/**
 * Type representing the structure of the "What We Do" data stored in the database
 */
type WhatWeDoStored = { heading: string; cards: { title: string; description: string }[] };

/**
 * Parses and validates the "What We Do" JSON string from the database.
 *
 * @param raw - The raw JSON string from the database, or null
 * @returns The parsed and validated WhatWeDoStored object, or null if invalid
 */
function parseWhatWeDo(raw: string | null): WhatWeDoStored | null {
  if (raw == null || raw === '') return null;
  try {
    const parsed = JSON.parse(raw) as WhatWeDoStored;
    if (typeof parsed?.heading !== 'string' || !Array.isArray(parsed?.cards)) return null;
    const cards = parsed.cards.filter(
      (c): c is { title: string; description: string } =>
        c != null && typeof c.title === 'string' && typeof c.description === 'string'
    );
    return { heading: parsed.heading, cards };
  } catch {
    return null;
  }
}

/**
 * About page component that displays the company's story, services, and information.
 * Fetches site settings from the database and passes them to child components.
 * Includes admin editing capabilities when user is authenticated as admin.
 *
 * @returns The About page component
 */
export default async function About() {
  const [session, settingsRows] = await Promise.all([
    auth(),
    prisma.siteSetting.findMany({
      where: { key: { in: [...ABOUT_KEYS] } },
      select: { key: true, value: true },
    }),
  ]);

  const settings: Record<string, string | null> = {};
  for (const k of ABOUT_KEYS) {
    settings[k] = settingsRows.find((r) => r.key === k)?.value ?? null;
  }

  const whatWeDo = parseWhatWeDo(settings['about.whatWeDo']);
  const isAdmin = !!(
    session?.user &&
    'isAdmin' in session.user &&
    session.user.isAdmin
  );

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AboutHero
          initialTitle={settings['about.pageTitle']}
          initialTagline={settings['about.pageTagline']}
          isAdmin={isAdmin}
        />
        <Story
          initialHeading={settings['about.ourStoryHeading']}
          initialBody={settings['about.ourStoryBody']}
          isAdmin={isAdmin}
        />
        <WhatWeDo
          initialHeading={whatWeDo?.heading ?? null}
          initialCards={whatWeDo?.cards?.length ? whatWeDo.cards : null}
          isAdmin={isAdmin}
        />
        <div className="mt-8 text-center">
          <a 
            href="/contact" 
            className="inline-block bg-primary text-primary-foreground px-5 py-3 rounded-md shadow hover:bg-accent transition-colors"
          >
            Request a Quote
          </a>
        </div>
      </div>
    </div>
  );
}