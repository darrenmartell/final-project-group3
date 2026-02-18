# Cloudinary orphaned folder cleanup

## What are orphaned folders?

When a user **starts** creating a project and chooses images, those images are uploaded to Cloudinary immediately (so thumbnails can show the converted files). If the user then **closes the page or navigates away without saving**, no project is created in the database—but the uploaded images remain in Cloudinary. Those assets live in a folder that is not linked to any project; we call such folders **orphaned**.

## Does the app delete them automatically?

**No.** Abandoned uploads are not deleted when the user leaves. They stay in Cloudinary until a cleanup job runs.

## Cleanup job

The app provides an admin-only API that finds and deletes orphaned project folders:

- **Endpoint:** `GET /api/cloudinary-cleanup`
- **Auth:** Admin session required (same as other admin APIs).
- **Behavior:**
  - Loads all project `cloudinaryFolder` values from the database.
  - Lists image resources under the `projects/` prefix in Cloudinary.
  - For each folder that is **not** in the database and whose **oldest asset is older than 1 hour**, it deletes all assets in that folder and then deletes the folder.
- **Response:** `{ ok: true, deleted: string[], message: string }`

The 1-hour delay avoids deleting folders that are currently in use (e.g. the user is still filling the form).

## How to run it

1. **On-demand (browser):** While logged in as an admin, open  
   `https://your-domain.com/api/cloudinary-cleanup`  
   in the browser. The response shows how many folders were deleted.

2. **Cron / scheduler:** Call `GET /api/cloudinary-cleanup` on a schedule (e.g. hourly). You must send the request with credentials that satisfy the admin check (e.g. a secure token or cookie, depending on how you implement auth for cron). See your deployment docs for how to set up cron (e.g. Vercel Cron Jobs, or an external service).

## Implementation details

- Cleanup logic lives in `src/lib/cloudinary.ts` (`findOrphanedProjectFolders`, `cleanupOrphanedProjectFolders`).
- The API route is `src/app/api/cloudinary-cleanup/route.ts`.
- Folder age is determined by the oldest `created_at` among assets in that folder; the threshold is configurable via `ORPHANED_FOLDER_AGE_MS` (default 1 hour).
