import type { SVGProps } from "react";

export function LinkedInIcon({ size = 18 }: SVGProps<SVGSVGElement> & { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.37 7.83H1.78V22h3.59V7.83ZM3.58 2A2.08 2.08 0 1 0 3.6 6.16 2.08 2.08 0 0 0 3.58 2ZM22.23 13.87c0-4.27-2.28-6.26-5.32-6.26a4.57 4.57 0 0 0-4.11 2.26V7.83H9.21V22h3.59v-7.92c0-2.1.4-4.14 3-4.14 2.56 0 2.59 2.4 2.59 4.27V22h3.84v-8.13Z"/></svg>;
}
