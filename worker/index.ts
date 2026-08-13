const ALLOWED_HOSTNAMES = new Set([
  "safouanaouezghar.com",
  "www.safouanaouezghar.com",
  "studio-s-portfolio.pages.dev",
]);

const SERVICES = new Set([
  "Essential Presence",
  "Signature Experience",
  "Complete Brand Presence",
  "Something else",
]);

const BUDGETS = new Set(["€750–€1,500", "€1,500–€2,500", "€2,500+", "Not sure yet"]);
const LAUNCH_WINDOWS = new Set(["Within 4 weeks", "1–2 months", "3+ months", "Flexible"]);
const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

type Enquiry = {
  id: string;
  name: string;
  email: string;
  business: string;
  service: string;
  budget: string;
  launch: string;
  message: string;
};

type TurnstileResult = {
  success?: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function value(form: FormData, key: string, maxLength: number): string {
  const raw = form.get(key);
  return typeof raw === "string" ? raw.trim().slice(0, maxLength) : "";
}

function validEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email);
}

function escapeHtml(input: string): string {
  return input.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function safeSubject(input: string): string {
  return input.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

async function hashIp(ip: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(salt),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(token: string, ip: string, env: Env): Promise<boolean> {
  const payload = new FormData();
  payload.set("secret", env.TURNSTILE_SECRET);
  payload.set("response", token);
  payload.set("remoteip", ip);
  payload.set("idempotency_key", crypto.randomUUID());

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: payload,
  });
  if (!response.ok) return false;

  const result: TurnstileResult = await response.json();
  return result.success === true
    && result.action === "enquiry"
    && typeof result.hostname === "string"
    && ALLOWED_HOSTNAMES.has(result.hostname);
}

async function withinRateLimit(ipHash: string, env: Env): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - 3600;

  await env.ENQUIRIES_DB.prepare(`
    INSERT INTO submission_attempts (ip_hash, window_started_at, attempt_count)
    VALUES (?1, ?2, 1)
    ON CONFLICT(ip_hash) DO UPDATE SET
      window_started_at = CASE WHEN window_started_at < ?3 THEN ?2 ELSE window_started_at END,
      attempt_count = CASE WHEN window_started_at < ?3 THEN 1 ELSE attempt_count + 1 END
  `).bind(ipHash, now, windowStart).run();

  const attempt = await env.ENQUIRIES_DB.prepare(
    "SELECT attempt_count FROM submission_attempts WHERE ip_hash = ?1",
  ).bind(ipHash).first<{ attempt_count: number }>();

  return Boolean(attempt && attempt.attempt_count <= 5);
}

function parseEnquiry(form: FormData): Enquiry | null {
  const enquiry = {
    id: crypto.randomUUID(),
    name: value(form, "name", 100),
    email: value(form, "email", 254).toLowerCase(),
    business: value(form, "business", 140),
    service: value(form, "service", 80),
    budget: value(form, "budget", 40),
    launch: value(form, "launch", 40),
    message: value(form, "message", 5000),
  };

  if (
    enquiry.name.length < 2
    || !validEmail(enquiry.email)
    || !SERVICES.has(enquiry.service)
    || !BUDGETS.has(enquiry.budget)
    || !LAUNCH_WINDOWS.has(enquiry.launch)
    || enquiry.message.length < 20
  ) return null;

  return enquiry;
}

async function storeEnquiry(enquiry: Enquiry, env: Env): Promise<void> {
  await env.ENQUIRIES_DB.prepare(`
    INSERT INTO enquiries (
      id, name, email, business, service, budget, launch_window, message,
      delivery_status, privacy_version
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'pending', '2026-08-13')
  `).bind(
    enquiry.id,
    enquiry.name,
    enquiry.email,
    enquiry.business || null,
    enquiry.service,
    enquiry.budget,
    enquiry.launch,
    enquiry.message,
  ).run();
}

async function sendNotification(enquiry: Enquiry, env: Env): Promise<void> {
  const project = safeSubject(enquiry.business || enquiry.name);
  const fields = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Business or project", enquiry.business || "Not provided"],
    ["Service", enquiry.service],
    ["Approximate budget", enquiry.budget],
    ["Desired launch", enquiry.launch],
  ];
  const text = [
    `New Studio S. project enquiry — ${project}`,
    "",
    ...fields.map(([label, fieldValue]) => `${label}: ${fieldValue}`),
    "",
    "Project details:",
    enquiry.message,
    "",
    `Reference: ${enquiry.id}`,
  ].join("\n");
  const html = `
    <h1 style="font: 400 28px Georgia,serif">New Studio S. project enquiry</h1>
    <table cellpadding="6" cellspacing="0" style="font: 14px Arial,sans-serif;border-collapse:collapse">
      ${fields.map(([label, fieldValue]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(fieldValue)}</td></tr>`).join("")}
    </table>
    <h2 style="font: 400 20px Georgia,serif">Project details</h2>
    <p style="font: 14px/1.6 Arial,sans-serif;white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>
    <p style="color:#777;font:12px Arial,sans-serif">Reference: ${escapeHtml(enquiry.id)}</p>
  `;

  await env.EMAIL.send({
    to: env.NOTIFICATION_EMAIL,
    from: { name: "Studio S. website", email: env.FROM_EMAIL },
    replyTo: { name: enquiry.name, email: enquiry.email },
    subject: `Project enquiry — ${project}`,
    text,
    html,
  });
}

async function handleEnquiry(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get("Origin");
  if (origin) {
    const originHostname = new URL(origin).hostname;
    if (!ALLOWED_HOSTNAMES.has(originHostname)) return json({ message: "This form can only be submitted from the Studio S. website." }, 403);
  }

  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength > 32_768) return json({ message: "That enquiry is too large to send." }, 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ message: "The enquiry could not be read. Please refresh and try again." }, 400);
  }

  if (value(form, "website", 200)) return json({ ok: true, reference: "received" }, 201);

  const token = value(form, "cf-turnstile-response", 2048);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!token || !(await verifyTurnstile(token, ip, env))) {
    return json({ message: "The spam check expired or could not be verified. Please try it again." }, 400);
  }

  const ipHash = await hashIp(ip, env.RATE_LIMIT_SALT);
  if (!(await withinRateLimit(ipHash, env))) {
    return json({ message: "Too many enquiries were sent from this connection. Please try again in an hour." }, 429);
  }

  const enquiry = parseEnquiry(form);
  if (!enquiry) return json({ message: "Please check every required field and add a little more project detail." }, 422);

  await storeEnquiry(enquiry, env);

  try {
    await sendNotification(enquiry, env);
    await env.ENQUIRIES_DB.prepare(
      "UPDATE enquiries SET delivery_status = 'sent', delivered_at = datetime('now') WHERE id = ?1",
    ).bind(enquiry.id).run();
  } catch (error) {
    const reason = error instanceof Error ? error.message.slice(0, 500) : "Unknown email delivery error";
    await env.ENQUIRIES_DB.prepare(
      "UPDATE enquiries SET delivery_status = 'failed', delivery_error = ?1 WHERE id = ?2",
    ).bind(reason, enquiry.id).run();
    console.error(JSON.stringify({ message: "enquiry notification failed", enquiryId: enquiry.id, error: reason }));
    return json({
      message: `Your enquiry was saved, but the notification could not be delivered. Please email hello@safouanaouezghar.com and mention ${enquiry.id}.`,
      reference: enquiry.id,
    }, 503);
  }

  console.log(JSON.stringify({ message: "enquiry accepted", enquiryId: enquiry.id }));
  return json({ ok: true, reference: enquiry.id }, 201);
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/api/enquiries") return json({ message: "Not found." }, 404);
    if (request.method !== "POST") return new Response(null, { status: 405, headers: { ...JSON_HEADERS, Allow: "POST" } });

    try {
      return await handleEnquiry(request, env);
    } catch (error) {
      console.error(JSON.stringify({ message: "enquiry request failed", error: error instanceof Error ? error.message : String(error) }));
      return json({ message: "The enquiry service is temporarily unavailable. Please try again shortly." }, 503);
    }
  },

  async scheduled(_controller, env): Promise<void> {
    const results = await env.ENQUIRIES_DB.batch([
      env.ENQUIRIES_DB.prepare("DELETE FROM enquiries WHERE created_at < datetime('now', '-12 months')"),
      env.ENQUIRIES_DB.prepare("DELETE FROM submission_attempts WHERE window_started_at < unixepoch('now') - 86400"),
    ]);
    console.log(JSON.stringify({ message: "enquiry retention cleanup complete", changes: results.map((result) => result.meta.changes) }));
  },
} satisfies ExportedHandler<Env>;
