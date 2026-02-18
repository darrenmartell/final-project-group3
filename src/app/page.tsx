/**
 * @module app/page
 * @description Home page with editable landing hero and recent projects.
 */
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getHeroImageUrl } from '@/lib/cloudinary';
import RecentProjects from '@/components/RecentProjects';
import LandingHero from '@/app/components/LandingHero';

const LANDING_KEYS = [
  'landing.heroTitle',
  'landing.heroTagline',
  'landing.heroImagePublicId',
  'landing.heroImagePosition',
] as const;

export default async function Home() {
  const [session, settingsRows] = await Promise.all([
    auth(),
    prisma.siteSetting.findMany({
      where: { key: { in: [...LANDING_KEYS] } },
      select: { key: true, value: true },
    }),
  ]);

  const settings: Record<string, string | null> = {};
  for (const k of LANDING_KEYS) {
    settings[k] = settingsRows.find((r) => r.key === k)?.value ?? null;
  }

  const isAdmin = !!(
    session?.user &&
    'isAdmin' in session.user &&
    session.user.isAdmin
  );

  const publicId = settings['landing.heroImagePublicId'];
  let heroImageUrl: string | null = null;
  if (publicId && publicId.trim() !== '') {
    try {
      heroImageUrl = getHeroImageUrl(publicId.trim());
    } catch {
      heroImageUrl = null;
    }
  }

  return (
    <div className="pt-16">
      <LandingHero
        initialTitle={settings['landing.heroTitle']}
        initialTagline={settings['landing.heroTagline']}
        heroImageUrl={heroImageUrl}
        initialHeroImagePublicId={publicId?.trim() || null}
        heroImagePositionRaw={settings['landing.heroImagePosition']}
        isAdmin={isAdmin}
      />
      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-12">
        <RecentProjects />
      </div>
    </div>
  );
}
