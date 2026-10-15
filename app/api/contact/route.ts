import { createContactRateLimiter, handleContactRequest } from "@/lib/contact";

// This budget lasts only for this process. Deploy a shared rate limiter before
// scaling to multiple workers or server instances.
const rateLimiter = createContactRateLimiter();

export async function POST(request: Request) {
  return handleContactRequest(request, {
    rateLimiter,
    env: {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
      CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
      CONTACT_ALLOWED_ORIGINS: process.env.CONTACT_ALLOWED_ORIGINS,
      CONTACT_TRUST_PROXY: process.env.CONTACT_TRUST_PROXY,
    },
  });
}
