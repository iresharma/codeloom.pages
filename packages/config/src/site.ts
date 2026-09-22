export const SITE_HOST = "codeloom.iresharma.com";

export function siteUrl(path = "/"): string {
  const base = process.env.NODE_ENV !== "production" ? "http://localhost:3000" : `https://${SITE_HOST}`;
  return `${base}${path}`;
}
