/**
 * @module api/cloudinary-delete/route
 * @description Admin-only API to delete a single image from Cloudinary by public ID.
 * Used when canceling hero image upload so the temporary upload is removed.
 */
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guards";
import { deleteImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

/**
 * POST /api/cloudinary-delete
 * Body: { publicId: string }. Deletes the image from Cloudinary. Admin only.
 */
export async function POST(req: Request) {
  const adminResult = await requireAdmin();
  if (!adminResult.ok) {
    return adminResult.response;
  }

  let body: { publicId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const publicId =
    typeof body.publicId === "string" ? body.publicId.trim() : undefined;
  if (!publicId) {
    return NextResponse.json(
      { error: "Missing or invalid publicId" },
      { status: 400 }
    );
  }

  try {
    await deleteImage(publicId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
