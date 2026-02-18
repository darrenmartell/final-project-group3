/**
 * @module api/cloudinary-cleanup/route
 * @description Admin-only API to delete orphaned project folders from Cloudinary.
 *
 * When users upload images for a new project but close the page without saving,
 * those images remain in Cloudinary. This endpoint finds project folders that
 * are not linked to any project in the database and deletes them (if their
 * oldest asset is older than 1 hour). Run periodically via cron or on-demand.
 *
 * @see docs/cloudinary-cleanup.md
 */
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guards";
import { prisma } from "@/lib/db";
import {
  cleanupOrphanedProjectFolders,
  ORPHANED_FOLDER_AGE_MS,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

/**
 * GET /api/cloudinary-cleanup
 *
 * Admin only. Deletes Cloudinary project folders that are not in the database
 * and whose oldest asset is older than 1 hour. Returns { deleted: string[] }.
 * Safe to call from a cron job (e.g. hourly) if the cron sends an admin auth
 * cookie or a secure token.
 */
export async function GET() {
  const adminResult = await requireAdmin();
  if (!adminResult.ok) {
    return adminResult.response;
  }

  try {
    const projects = await prisma.project.findMany({
      where: { cloudinaryFolder: { not: null } },
      select: { cloudinaryFolder: true },
    });
    const knownFolders = new Set(
      projects
        .map((p) => p.cloudinaryFolder)
        .filter((f): f is string => typeof f === "string" && f.trim() !== ""),
    );

    const deleted = await cleanupOrphanedProjectFolders(
      knownFolders,
      ORPHANED_FOLDER_AGE_MS,
    );

    return NextResponse.json({
      ok: true,
      deleted,
      message:
        deleted.length > 0
          ? `Deleted ${deleted.length} orphaned folder(s).`
          : "No orphaned folders to delete.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cleanup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
