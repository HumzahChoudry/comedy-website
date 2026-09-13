import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SiteConfig, Photo, Video, TourDate } from "@/types";

// Default config used as a fallback when the DB row is missing.
import defaultSiteConfig from "@/data/site-config.json";

// -----------------------------------------------------------------------------
// Storage layer backed by Cloudflare D1 (structured content) and R2 (images).
// All functions are async because D1/R2 are async. Access to bindings goes
// through getCloudflareContext(), which works in production and in local dev
// (via initOpenNextCloudflareForDev() in next.config.ts + wrangler).
// -----------------------------------------------------------------------------

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

export async function getBucket() {
  const { env } = await getCloudflareContext({ async: true });
  return env.BUCKET;
}

// ---- Site Config ------------------------------------------------------------

export async function getSiteConfig(): Promise<SiteConfig> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT data FROM site_config WHERE id = 1")
    .first<{ data: string }>();

  if (!row) return defaultSiteConfig as SiteConfig;
  return JSON.parse(row.data) as SiteConfig;
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  const db = await getDB();
  await db
    .prepare(
      "INSERT INTO site_config (id, data) VALUES (1, ?1) " +
        "ON CONFLICT(id) DO UPDATE SET data = ?1"
    )
    .bind(JSON.stringify(config))
    .run();
}

// ---- Photos -----------------------------------------------------------------

export async function getPhotos(): Promise<Photo[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(
      "SELECT id, src, alt, caption, uploadedAt FROM photos ORDER BY uploadedAt DESC"
    )
    .all<Photo>();
  return results ?? [];
}

export async function savePhotos(photos: Photo[]): Promise<void> {
  // Replace the full set. Used by upload/delete flows.
  const db = await getDB();
  const statements = [db.prepare("DELETE FROM photos")];
  for (const p of photos) {
    statements.push(
      db
        .prepare(
          "INSERT INTO photos (id, src, alt, caption, uploadedAt) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(p.id, p.src, p.alt, p.caption, p.uploadedAt)
    );
  }
  await db.batch(statements);
}

// ---- Videos -----------------------------------------------------------------

export async function getVideos(): Promise<Video[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(
      "SELECT id, title, description, youtubeUrl, thumbnailUrl, addedAt, featured FROM videos ORDER BY addedAt DESC"
    )
    .all<Omit<Video, "featured"> & { featured: number }>();
  return (results ?? []).map((v) => ({ ...v, featured: !!v.featured }));
}

export async function saveVideos(videos: Video[]): Promise<void> {
  const db = await getDB();
  const statements = [db.prepare("DELETE FROM videos")];
  for (const v of videos) {
    statements.push(
      db
        .prepare(
          "INSERT INTO videos (id, title, description, youtubeUrl, thumbnailUrl, addedAt, featured) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(
          v.id,
          v.title,
          v.description,
          v.youtubeUrl,
          v.thumbnailUrl,
          v.addedAt,
          v.featured ? 1 : 0
        )
    );
  }
  await db.batch(statements);
}

// ---- Tour Dates -------------------------------------------------------------

export async function getTourDates(): Promise<TourDate[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(
      "SELECT id, date, venue, city, ticketUrl, soldOut, notes FROM tour_dates ORDER BY date ASC"
    )
    .all<Omit<TourDate, "soldOut"> & { soldOut: number }>();
  return (results ?? []).map((d) => ({ ...d, soldOut: !!d.soldOut }));
}

export async function saveTourDates(dates: TourDate[]): Promise<void> {
  const db = await getDB();
  const statements = [db.prepare("DELETE FROM tour_dates")];
  for (const d of dates) {
    statements.push(
      db
        .prepare(
          "INSERT INTO tour_dates (id, date, venue, city, ticketUrl, soldOut, notes) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(d.id, d.date, d.venue, d.city, d.ticketUrl, d.soldOut ? 1 : 0, d.notes)
    );
  }
  await db.batch(statements);
}

export function getYouTubeEmbedUrl(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

export function getYouTubeThumbnail(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return "";
}
