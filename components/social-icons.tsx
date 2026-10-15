import type { SVGProps } from "react";

export function GitHubIcon({ size = 18 }: SVGProps<SVGSVGElement> & { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.01-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.64 0c2.15-1.46 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98a4.33 4.33 0 0 1 1.16 3.01c0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.03.76 2.08v3.11c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z"/></svg>;
}

export function LinkedInIcon({ size = 18 }: SVGProps<SVGSVGElement> & { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.37 7.83H1.78V22h3.59V7.83ZM3.58 2A2.08 2.08 0 1 0 3.6 6.16 2.08 2.08 0 0 0 3.58 2ZM22.23 13.87c0-4.27-2.28-6.26-5.32-6.26a4.57 4.57 0 0 0-4.11 2.26V7.83H9.21V22h3.59v-7.92c0-2.1.4-4.14 3-4.14 2.56 0 2.59 2.4 2.59 4.27V22h3.84v-8.13Z"/></svg>;
}
