/**
 * @file Admin authentication error page
 * @module app/admin/error/page
 */

import Link from "next/link";

/**
 * Admin error page component.
 * Displays authentication errors with appropriate messages based on the error type.
 * Provides a link back to the login page.
 *
 * @param props - Component props
 * @param props.searchParams - Promise containing URL search parameters
 * @returns The admin error page component
 */
export default async function AdminError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="pt-16">
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 bg-card rounded-xl shadow-md border border-border text-center">
          <h1 className="text-3xl font-bold mb-4 text-destructive">
            Authentication Error
          </h1>
          <p className="mb-6 text-muted-foreground">
            {error === "AccessDenied"
              ? "You don't have permission to access the admin panel. Please contact the administrator."
              : "An error occurred during sign in. Please try again."}
          </p>
          <Link
            href="/admin/login"
            className="inline-block bg-primary hover:bg-accent text-primary-foreground font-semibold py-2 px-6 rounded-lg shadow transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
