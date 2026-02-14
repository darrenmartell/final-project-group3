import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Result type returned by admin guard helpers. When `ok` is `false`, `response`
 * contains the HTTP response that should be returned from the route handler.
 */
export type RequireAdminResult =
  | {
      ok: true;
      session: Session;
      response: null;
    }
  | {
      ok: false;
      session: null;
      response: NextResponse;
    };

/**
 * Result type used by `verifyAdmin`.
 */
export type VerifyAdminResult =
  | { ok: true; user: { isAdmin: true } }
  | { ok: false; response: NextResponse };

/**
 * Single source of truth: get session, then check admin via one DB lookup by user id (or email).
 * No fallbacks — intended for a single OAuth provider (Google) and authorized-admin-only access.
 */
async function getSessionAndAdminUser(): Promise<{
  session: Session | null;
  isAdmin: boolean;
}> {
  const session = await auth();
  if (!session?.user) {
    return { session: null, isAdmin: false };
  }

  const userId = (session.user as { id?: string }).id;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });
    return { session, isAdmin: user?.isAdmin ?? false };
  }

  const email = session.user.email;
  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { isAdmin: true },
    });
    return { session, isAdmin: user?.isAdmin ?? false };
  }

  return { session, isAdmin: false };
}

/**
 * Guard for collection endpoints (e.g. POST /api/projects).
 * Returns 401 if no session, 403 if not admin, else { ok: true, session }.
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  const { session, isAdmin } = await getSessionAndAdminUser();

  if (!session) {
    return {
      ok: false,
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!isAdmin) {
    return {
      ok: false,
      session: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, session, response: null };
}

/**
 * Guard for item endpoints (e.g. PATCH/DELETE /api/projects/[id]).
 * Same logic as requireAdmin; returns a minimal result shape.
 */
export async function verifyAdmin(): Promise<VerifyAdminResult> {
  const { session, isAdmin } = await getSessionAndAdminUser();

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!isAdmin) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, user: { isAdmin: true } };
}
