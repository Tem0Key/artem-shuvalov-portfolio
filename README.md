# Artem Shuvalov — personal portfolio

A responsive English/Russian portfolio built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Motion, and Lucide. Original SVG network artwork is animated with CSS; photos and the Inter variable font are served locally.

Live portfolio: **https://tem0key.github.io/artem-shuvalov-portfolio/**

## GitHub Pages

Pushes to `main` run `.github/workflows/pages.yml`, build the static site, and deploy `out/` to GitHub Pages. In repository settings, Pages uses **GitHub Actions** with no custom domain. It publishes the portfolio, rather than rendering this README from the repository root.

```sh
npm ci
npm run build:pages
```

This build sets the repository base path, static export mode, and public site URL. All UI routes are TSX; the Pages build discovers TSX routes only, excluding the server-only `app/api/contact/route.ts`. The API remains available in normal server deployments. If adding new UI routes, use `.tsx` so they are included in the static build.

On GitHub Pages, the contact form validates the details and prepares a `mailto:` draft. Visitors review and send it from their own email app, or copy the provided text into webmail. It does not claim to send messages automatically. No Resend key is needed for this version.

## Local development

Requires Node.js 22.13 or later.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Language selection is remembered locally. Navigation, native expandable experience/project details, reduced-motion preferences, CV download, and the recruitment form work without third-party frontend services.

## Standard Next.js production deployment

```sh
npm run build:next
npm start
```

The source is a standard Next.js App Router application. It can be deployed on a Next.js-compatible Node host. The private ChatGPT Sites deployment uses the included Vinext/Cloudflare compatibility build (`npm run build`), generated into `dist/`. Keep its `sites()` Vite integration and `.openai/hosting.json` project identity when updating that deployment.

## Enable recruitment email

The form posts to `/api/contact`; successful delivery requires a Resend account and a verified sender domain.

1. Copy `.env.example` to `.env.local` for local Next.js development, or add the variables to your production host’s server environment.
2. Set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (for example, `Portfolio <contact@your-verified-domain.com>`).
3. Optionally set `CONTACT_TO_EMAIL`. It defaults to the verified CV address, `shuvaloff.artyom@gmail.com`.
4. Restart/redeploy after changing environment variables. On Sites, set runtime variables with the native environment-variable tool and deploy a saved version to apply them. Never commit credentials or prefix them with `NEXT_PUBLIC_` or `VITE_`.

Without credentials the endpoint deliberately returns 503. The form keeps the entered message, explains that delivery failed, and offers a direct email link. It never displays a false success. No email was sent during development.

For reverse proxies that change the incoming request origin, set `CONTACT_ALLOWED_ORIGINS` to a comma-separated list of exact HTTPS origins. The default requires a matching Origin header. `CONTACT_TRUST_PROXY=cloudflare` or `forwarded` enables client-IP throttling only when your trusted proxy overwrites the corresponding header. The bounded memory limiter is per process; use shared storage or an edge rate-limiting service before scaling a public multi-instance deployment.

The API validates field types/lengths, email addresses, HTTP(S) job links, exact origins, streamed request bytes, and a honeypot. It sends plain-text email with an abort timeout and idempotency key and avoids logging submitted personal information.

## Verification

```sh
npm run typecheck
npm test
npm run build:next
npm run build
```

Fifteen isolated tests cover mail-draft encoding, validation, origin checks, request limits, honeypot, rate limits, idempotency, provider errors/timeouts, and missing configuration. Provider calls are mocked. Desktop and mobile layouts, both languages, project expansion, mobile menu keyboard handling, image loading, and contact feedback were checked in a browser.

## Content and assets

- `app/page.tsx`: navigation, hero, about, language selection, footer.
- `components/network-visual.tsx`: original infrastructure illustration, no WebGL or video dependency.
- `components/portfolio-sections.tsx`: factual experience, project previews, skills, education, certificates.
- `components/contact-section.tsx`: accessible recruitment form.
- `lib/contact.ts` and `app/api/contact/route.ts`: validation and email delivery.
- `public/assets/`: supplied portraits, original CV, and font license; `app/fonts/` contains the bundled local font.

Professional facts come from the supplied CV and brief. Project interface previews are explicitly illustrative. The proposed expansion to approximately 40 additional users is labeled as planned and incomplete. The CV is offered unchanged; it retains any original document annotations. No SceneAI video or design assets are used.

Update `metadataBase` in `app/layout.tsx` when deploying to a different domain. The Site is private by default; make it public through Sites access settings when you want to share it with recruiters.
