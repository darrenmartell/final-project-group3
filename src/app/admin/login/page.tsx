/**
 * @file Admin login page
 * @module app/admin/login/page
 */

import GoogleSignInButton from "@/components/GoogleSignInButton";

/**
 * Admin login page component.
 * Displays the login interface for admin users to authenticate via Google Sign-In.
 *
 * @returns The admin login page component
 */
export default function AdminLogin() {
  return (
    <div className="pt-16">
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 bg-card rounded-xl shadow-md border border-border">
          <h1 className="text-3xl font-bold mb-6 text-center text-foreground">
            Admin Login
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Sign in to manage Shoreline Woodworks
          </p>
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
