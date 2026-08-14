export const SPLIT_SITES = process.env.NEXT_PUBLIC_SPLIT_SITES === "true";

export function productUrl(host: string, path: string) {
  if (SPLIT_SITES) {
    return `https://${host}`;
  }
  return path;
}
