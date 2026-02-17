/**
 * @module app/page
 * @description Home page component displaying the landing hero section.
 */
import LandingHeader from "@/app/components/LandingHeader";

/**
 * Home page component.
 * Displays the landing page with hero section and call-to-action buttons.
 *
 * @returns The home page JSX element
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingHeader />
    </main>
  );
}