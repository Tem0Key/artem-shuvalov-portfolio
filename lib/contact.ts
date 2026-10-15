/** Shared form validation and a small, dependency-free contact API. */
export const CONTACT_EMAIL = "shuvaloff.artyom@gmail.com";
export const CONTACT_LINKEDIN = "https://linkedin.com/in/artyom-shuvalov-0b9029332";
export const CONTACT_GITHUB = "https://github.com/Tem0Key";
export const MAX_CONTACT_BYTES = 16_384;

export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  role: 160,
  jobLink: 2_048,
  message: 4_000,
  website: 200,
} as const;

export type ContactField = keyof typeof CONTACT_LIMITS;
export type ContactValues = Record<ContactField, string>;

/** A draft only: the visitor reviews and sends it in their own email client. */
export function buildContactDraft(values: ContactValues, lang: "en" | "ru" | "es" = "en") {
  const labels = {
    ru: { name: "Имя", email: "Почта", company: "Компания", role: "Вакансия", jobLink: "Ссылка", subject: "Предложение о работе", regards: "С уважением," },
    en: { name: "Name", email: "Email", company: "Company", role: "Role", jobLink: "Job link", subject: "Career opportunity", regards: "Best regards," },
    es: { name: "Nombre", email: "Correo", company: "Empresa", role: "Puesto", jobLink: "Enlace a la oferta", subject: "Oportunidad profesional", regards: "Saludos cordiales," },
  }[lang];
  const subject = values.role ? `${labels.subject}: ${values.role}` : labels.subject;
  const details = (["name", "email", "company", "role", "jobLink"] as const)
    .filter(field => values[field])
    .map(field => `${labels[field]}: ${values[field]}`);
  const body = [values.message.replace(/\r\n?/g, "\n").replace(/\n/g, "\r\n"), "", labels.regards, ...details].join("\r\n");
  return { subject, body, href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
export type ContactFieldError = "required" | "invalid" | "too_long";
export type ContactErrors = Partial<Record<ContactField, ContactFieldError>>;
export type ContactEnvironment = {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_ALLOWED_ORIGINS?: string;
  CONTACT_TRUST_PROXY?: string;
};

const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const singleLineControls = /[\u0000-\u001f\u007f-\u009f]/;
const messageControls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/;

export function validateContactInput(input: unknown):
  | { valid: true; values: ContactValues }
  | { valid: false; errors: ContactErrors; rejected?: boolean } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: {}, rejected: true };
  }
  const data = input as Record<string, unknown>;
  const errors: ContactErrors = {};
  const values = {} as ContactValues;

  for (const field of Object.keys(CONTACT_LIMITS) as ContactField[]) {
    const raw = data[field] ?? "";
    if (typeof raw !== "string") {
      errors[field] = "invalid";
      values[field] = "";
      continue;
    }
    // Check before trimming so trailing control characters cannot be hidden.
    if ((field === "message" ? messageControls : singleLineControls).test(raw)) {
      errors[field] = "invalid";
    }
    values[field] = raw.replace(/\r\n?/g, "\n").trim();
    if (raw.length > CONTACT_LIMITS[field]) errors[field] = "too_long";
  }

  // A filled hidden field is rejected without contacting the email provider.
  if (values.website) return { valid: false, errors: {}, rejected: true };

  for (const field of ["name", "email", "message"] as const) {
    if (!values[field]) errors[field] = "required";
  }
  if (values.email && !emailPattern.test(values.email)) errors.email = "invalid";
  if (values.jobLink) {
    try {
      const url = new URL(values.jobLink);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
        errors.jobLink = "invalid";
      }
    } catch {
      errors.jobLink = "invalid";
    }
  }
  return Object.keys(errors).length ? { valid: false, errors } : { valid: true, values };
}

type RateLimitResult = { allowed: boolean; retryAfter: number };
export type ContactRateLimiter = { check: (key: string, now: number, limit?: number) => RateLimitResult };

/** Process-local only. Use a distributed limiter for a multi-instance deployment. */
export function createContactRateLimiter({ windowMs = 600_000, maxEntries = 1_000 } = {}): ContactRateLimiter {
  const attempts = new Map<string, { count: number; expires: number }>();
  return {
    check(key, now, limit = 5) {
      for (const [storedKey, value] of attempts) {
        if (value.expires <= now) attempts.delete(storedKey);
      }
      let entry = attempts.get(key);
      if (!entry) {
        if (attempts.size >= maxEntries) return { allowed: false, retryAfter: Math.ceil(windowMs / 1_000) };
        entry = { count: 0, expires: now + windowMs };
        attempts.set(key, entry);
      }
      if (entry.count >= limit) {
        return { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.expires - now) / 1_000)) };
      }
      entry.count += 1;
      return { allowed: true, retryAfter: 0 };
    },
  };
}

function respond(status: number, body: Record<string, unknown>, headers?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers },
  });
}

function originIsAllowed(request: Request, configured?: string): boolean {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;
  try {
    const allowed = configured?.trim()
      ? configured.split(",").map((value) => new URL(value.trim()).origin)
      : [new URL(request.url).origin];
    return new URL(origin).origin === origin && allowed.includes(origin);
  } catch {
    return false;
  }
}

function validSender(value: string): boolean {
  if (!value || value.length > 350 || singleLineControls.test(value)) return false;
  const mailbox = value.match(/^[^<>]+<([^<>]+)>$/)?.[1]?.trim() ?? value;
  return emailPattern.test(mailbox) && mailbox.length <= 254;
}

async function readLimitedJson(request: Request): Promise<{ value?: unknown; status?: number }> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return { status: 415 };
  }
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_CONTACT_BYTES) return { status: 413 };
  if (!request.body) return { status: 400 };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_CONTACT_BYTES) {
        await reader.cancel();
        return { status: 413 };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    return { value: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) };
  } catch {
    return { status: 400 };
  } finally {
    reader.releaseLock();
  }
}

type ContactHandlerOptions = {
  env: ContactEnvironment;
  rateLimiter: ContactRateLimiter;
  fetcher?: typeof fetch;
  now?: () => number;
  timeoutMs?: number;
};

export async function handleContactRequest(request: Request, options: ContactHandlerOptions): Promise<Response> {
  const { env, rateLimiter, fetcher = fetch, now = Date.now, timeoutMs = 8_000 } = options;
  if (!originIsAllowed(request, env.CONTACT_ALLOWED_ORIGINS)) {
    return respond(403, { ok: false, code: "forbidden" });
  }

  // Only trust client IP headers when the operator explicitly names a trusted
  // proxy. Otherwise all visitors share a modest process-local budget.
  const proxy = env.CONTACT_TRUST_PROXY;
  const address = proxy === "cloudflare"
    ? request.headers.get("cf-connecting-ip")
    : proxy === "forwarded"
      ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      : null;
  const clientKey = address && /^[a-fA-F0-9:.]{3,64}$/.test(address) ? `client:${address}` : "shared";
  const timestamp = now();
  const globalLimit = rateLimiter.check("global", timestamp, 50);
  const clientLimit = rateLimiter.check(clientKey, timestamp, clientKey === "shared" ? 20 : 5);
  if (!globalLimit.allowed || !clientLimit.allowed) {
    const retryAfter = Math.max(globalLimit.retryAfter, clientLimit.retryAfter);
    return respond(429, { ok: false, code: "rate_limited" }, { "Retry-After": String(retryAfter) });
  }

  const body = await readLimitedJson(request);
  if (body.status) return respond(body.status, { ok: false, code: body.status === 413 ? "too_large" : "invalid_request" });
  const validation = validateContactInput(body.value);
  if (!validation.valid) {
    return respond(400, { ok: false, code: "validation", errors: validation.errors });
  }

  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.CONTACT_FROM_EMAIL?.trim() ?? "";
  const to = env.CONTACT_TO_EMAIL?.trim() || CONTACT_EMAIL;
  if (!apiKey || !validSender(from) || !emailPattern.test(to) || to.length > 254) {
    return respond(503, { ok: false, code: "not_configured" });
  }

  const { name, email, company, role, jobLink, message } = validation.values;
  const idempotencyKey = request.headers.get("idempotency-key");
  if (idempotencyKey && !/^[a-zA-Z0-9_-]{16,100}$/.test(idempotencyKey)) {
    return respond(400, { ok: false, code: "invalid_request" });
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const result = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": `portfolio-contact-${idempotencyKey}` } : {}),
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio enquiry from ${name}`,
        text: [
          "New portfolio enquiry",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || "Not provided"}`,
          `Role / opportunity: ${role || "Not provided"}`,
          `Job link: ${jobLink || "Not provided"}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      }),
      signal: controller.signal,
    });
    if (!result.ok) return respond(502, { ok: false, code: "delivery_failed" });
    const accepted = await result.json().catch(() => null) as { id?: unknown } | null;
    if (!accepted || typeof accepted.id !== "string" || !accepted.id) {
      return respond(502, { ok: false, code: "delivery_failed" });
    }
    return respond(200, { ok: true });
  } catch {
    return respond(controller.signal.aborted ? 504 : 502, {
      ok: false,
      code: controller.signal.aborted ? "timeout" : "delivery_failed",
    });
  } finally {
    clearTimeout(timeout);
  }
}
