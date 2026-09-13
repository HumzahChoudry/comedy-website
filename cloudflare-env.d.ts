// Cloudflare Worker bindings available via getCloudflareContext().env
// Keep in sync with wrangler.jsonc.
interface CloudflareEnv {
  ASSETS: Fetcher;
  DB: D1Database;
  BUCKET: R2Bucket;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD_HASH: string;
}
