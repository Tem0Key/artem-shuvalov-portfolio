import test from "node:test";
import assert from "node:assert/strict";
import {
  CONTACT_EMAIL,
  MAX_CONTACT_BYTES,
  createContactRateLimiter,
  handleContactRequest,
  validateContactInput,
  buildContactDraft,
} from "../lib/contact.ts";

const validInput = {
  name: "Alex Morgan",
  email: "alex@example.com",
  company: "Example",
  role: "Security Analyst",
  jobLink: "https://example.com/careers/analyst",
  message: "Hello Artem, I would like to discuss an opportunity.",
  website: "",
};
const configured = {
  RESEND_API_KEY: "test-only-key",
  CONTACT_FROM_EMAIL: "Portfolio <hello@example.com>",
};

test("static email drafts preserve details and safely encode mail headers and body", () => {
  const values = { ...validInput, role: "Network & Security", message: "Hello & thanks!\nПривет" };
  const draft = buildContactDraft(values);
  const url = new URL(draft.href);
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, CONTACT_EMAIL);
  assert.equal(url.searchParams.get("subject"), "Career opportunity: Network & Security");
  assert.equal(url.searchParams.get("body"), draft.body);
  assert.ok(draft.body.startsWith("Hello & thanks!\r\nПривет\r\n\r\nBest regards,"));
  assert.ok(draft.body.includes(`Job link: ${validInput.jobLink}`));
  assert.ok(buildContactDraft(values, "ru").subject.startsWith("Предложение о работе:"));
  const spanish = buildContactDraft(values, "es");
  assert.equal(new URL(spanish.href).searchParams.get("subject"), "Oportunidad profesional: Network & Security");
  assert.ok(spanish.body.includes("Nombre: Alex Morgan"));
});

test("drafts put all sender details after the localized closing and omit empty optional fields", () => {
  for (const [lang, closing, nameLabel, emailLabel, companyLabel, roleLabel, linkLabel] of [
    ["en", "Best regards,", "Name", "Email", "Company", "Role", "Job link"],
    ["ru", "С уважением,", "Имя", "Почта", "Компания", "Вакансия", "Ссылка"],
    ["es", "Saludos cordiales,", "Nombre", "Correo", "Empresa", "Puesto", "Enlace a la oferta"],
  ]) {
    const draft = buildContactDraft(validInput, lang);
    assert.equal(draft.body, [validInput.message, "", closing,
      `${nameLabel}: ${validInput.name}`, `${emailLabel}: ${validInput.email}`,
      `${companyLabel}: ${validInput.company}`, `${roleLabel}: ${validInput.role}`,
      `${linkLabel}: ${validInput.jobLink}`].join("\r\n"));
    const minimal = buildContactDraft({ ...validInput, company: "", role: "", jobLink: "" }, lang);
    assert.ok(!minimal.body.includes(`${companyLabel}:`));
    assert.ok(!minimal.body.includes(`${roleLabel}:`));
    assert.ok(!minimal.body.includes(`${linkLabel}:`));
  }
});

function request(input = validInput, headers = {}) {
  return new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: { origin: "https://portfolio.example", "content-type": "application/json", ...headers },
    body: JSON.stringify(input),
  });
}

function options(extra = {}) {
  return { env: configured, rateLimiter: createContactRateLimiter(), ...extra };
}

test("accepts trimmed input and optional recruitment details", () => {
  const result = validateContactInput({ name: " Alex ", email: " alex@example.com ", message: "Hello\r\nArtem" });
  assert.equal(result.valid, true);
  assert.equal(result.values.name, "Alex");
  assert.equal(result.values.message, "Hello\nArtem");
  assert.equal(result.values.company, "");
});

test("validates required fields, field types, email, and length", () => {
  assert.equal(validateContactInput(null).valid, false);
  assert.equal(validateContactInput([]).valid, false);
  assert.deepEqual(validateContactInput({}).errors, { name: "required", email: "required", message: "required" });
  assert.equal(validateContactInput({ ...validInput, company: {} }).errors.company, "invalid");
  assert.equal(validateContactInput({ ...validInput, email: "alex@" }).errors.email, "invalid");
  assert.equal(validateContactInput({ ...validInput, message: "x".repeat(4_001) }).errors.message, "too_long");
});

test("rejects control characters and unsafe job URLs", () => {
  assert.equal(validateContactInput({ ...validInput, name: "Alex\r\nBcc: test@example.com" }).valid, false);
  assert.equal(validateContactInput({ ...validInput, email: "alex@example.com\n" }).valid, false);
  assert.equal(validateContactInput({ ...validInput, message: "Hello\u0000Artem" }).valid, false);
  for (const jobLink of ["javascript:alert(1)", "data:text/plain,hello", "ftp://example.com", "https://user:password@example.com", "not a url"]) {
    assert.equal(validateContactInput({ ...validInput, jobLink }).errors.jobLink, "invalid");
  }
});

test("honeypot requests never call the provider", async () => {
  let calls = 0;
  const result = await handleContactRequest(request({ ...validInput, website: "bot.example" }), options({ fetcher: async () => { calls++; } }));
  assert.equal(result.status, 400);
  assert.equal(calls, 0);
});

test("requires exact same origin and supports explicit proxy origin configuration", async () => {
  for (const origin of ["https://attacker.example", "null", "https://portfolio.example.attacker.example"]) {
    const result = await handleContactRequest(request(validInput, { origin }), options());
    assert.equal(result.status, 403);
  }
  const missing = request();
  missing.headers.delete("origin");
  assert.equal((await handleContactRequest(missing, options())).status, 403);
  const explicit = await handleContactRequest(request(validInput, { origin: "https://public.example" }), options({ env: { CONTACT_ALLOWED_ORIGINS: "https://public.example" } }));
  assert.equal(explicit.status, 503);
});

test("rejects unsupported content types and malformed JSON", async () => {
  assert.equal((await handleContactRequest(request(validInput, { "content-type": "text/plain" }), options())).status, 415);
  const malformed = new Request("https://portfolio.example/api/contact", {
    method: "POST", headers: { origin: "https://portfolio.example", "content-type": "application/json" }, body: "{broken",
  });
  assert.equal((await handleContactRequest(malformed, options())).status, 400);
});

test("limits streamed UTF-8 bytes even without Content-Length", async () => {
  const oversized = request({ ...validInput, message: "ю".repeat(MAX_CONTACT_BYTES) });
  assert.equal(oversized.headers.get("content-length"), null);
  assert.equal((await handleContactRequest(oversized, options())).status, 413);
  assert.equal((await handleContactRequest(request(validInput, { "content-length": String(MAX_CONTACT_BYTES + 1) }), options())).status, 413);
});

test("rejects invalid input before attempting to send", async () => {
  let calls = 0;
  const result = await handleContactRequest(request({ ...validInput, email: "invalid" }), options({ fetcher: async () => { calls++; } }));
  assert.equal(result.status, 400);
  assert.equal((await result.json()).errors.email, "invalid");
  assert.equal(calls, 0);
});

test("an unconfigured or invalid sender never reports success", async () => {
  for (const env of [{}, { RESEND_API_KEY: "test-only-key" }, { ...configured, CONTACT_FROM_EMAIL: "invalid" }]) {
    let calls = 0;
    const result = await handleContactRequest(request(), options({ env, fetcher: async () => { calls++; } }));
    assert.equal(result.status, 503);
    assert.equal((await result.json()).code, "not_configured");
    assert.equal(calls, 0);
  }
});

test("sends plain text to the verified recipient and passes a stable idempotency key", async () => {
  let delivery;
  const result = await handleContactRequest(request(validInput, { "idempotency-key": "1a12d121-e80a-4d35-a4d0-9dabf57b1a1b" }), options({
    fetcher: async (url, init) => {
      delivery = { url, init, body: JSON.parse(init.body) };
      return Response.json({ id: "mock-email-id" });
    },
  }));
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true });
  assert.equal(delivery.url, "https://api.resend.com/emails");
  assert.deepEqual(delivery.body.to, [CONTACT_EMAIL]);
  assert.equal(delivery.body.reply_to, validInput.email);
  assert.equal(delivery.body.from, configured.CONTACT_FROM_EMAIL);
  assert.equal("html" in delivery.body, false);
  assert.match(delivery.body.text, /Security Analyst/);
  assert.match(delivery.init.headers["Idempotency-Key"], /^portfolio-contact-/);
  assert.equal(result.headers.get("cache-control"), "no-store");
});

test("provider rejections and network failures never report success or expose provider details", async () => {
  for (const fetcher of [
    async () => Response.json({ message: "private provider detail" }, { status: 403 }),
    async () => { throw new Error("private provider detail"); },
    async () => Response.json({}),
  ]) {
    const result = await handleContactRequest(request(), options({ fetcher }));
    assert.equal(result.status, 502);
    assert.deepEqual(await result.json(), { ok: false, code: "delivery_failed" });
  }
});

test("aborts a stalled provider request and returns a timeout", async () => {
  const result = await handleContactRequest(request(), options({
    timeoutMs: 5,
    fetcher: async (_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
    }),
  }));
  assert.equal(result.status, 504);
  assert.equal((await result.json()).code, "timeout");
});

test("rate limits a trusted client and recovers after the window", async () => {
  const limiter = createContactRateLimiter({ windowMs: 1_000 });
  const settings = options({ env: { CONTACT_TRUST_PROXY: "cloudflare" }, rateLimiter: limiter, now: () => 100 });
  for (let attempt = 0; attempt < 5; attempt++) {
    assert.equal((await handleContactRequest(request(validInput, { "cf-connecting-ip": "192.0.2.1" }), settings)).status, 503);
  }
  const limited = await handleContactRequest(request(validInput, { "cf-connecting-ip": "192.0.2.1" }), settings);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "1");
  assert.equal((await handleContactRequest(request(validInput, { "cf-connecting-ip": "192.0.2.1" }), { ...settings, now: () => 1_101 })).status, 503);
});

test("the limiter bounds its map and expires old entries", () => {
  const limiter = createContactRateLimiter({ maxEntries: 2, windowMs: 100 });
  assert.equal(limiter.check("one", 0).allowed, true);
  assert.equal(limiter.check("two", 0).allowed, true);
  assert.equal(limiter.check("three", 0).allowed, false);
  assert.equal(limiter.check("three", 101).allowed, true);
});
