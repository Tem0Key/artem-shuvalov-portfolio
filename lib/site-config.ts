export const STATIC_SITE = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://artem-shuvalov-network-engineer.clevereagle513.chatgpt.site";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function assetPath(path: string) {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
