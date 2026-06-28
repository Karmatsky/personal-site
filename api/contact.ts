import { createHash } from "node:crypto";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown;
};

type ContactData = {
  name: string;
  email: string;
  message: string;
};

type RequestLike = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: {
    remoteAddress?: string;
  };
  on?: (event: string, callback: (chunk?: unknown) => void) => void;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: Record<string, unknown>) => void;
  setHeader: (name: string, value: string) => void;
};

type RateResult = {
  allowed: boolean;
  remaining?: number;
  resetSeconds?: number;
};

const MAX_BODY_BYTES = 8_192;
const IP_LIMIT = { limit: 3, windowSeconds: 10 * 60 };
const EMAIL_LIMIT = { limit: 5, windowSeconds: 60 * 60 };
const DUPLICATE_WINDOW_SECONDS = 10 * 60;

const localCounters = new Map<string, { count: number; expiresAt: number }>();
const localDuplicates = new Map<string, number>();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const htmlPattern = /<[^>]+>|javascript:|data:text\/html|on\w+\s*=|https?:\/\/\S+/i;

function getHeader(req: RequestLike, name: string) {
  const value = req.headers[name] ?? req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function getIp(req: RequestLike) {
  const forwardedFor = getHeader(req, "x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    getHeader(req, "x-real-ip") ||
    getHeader(req, "cf-connecting-ip") ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

function hashValue(value: string) {
  const salt = process.env.CONTACT_HASH_SALT || "contact-form-dev-salt";

  return createHash("sha256")
    .update(`${salt}:${value.toLowerCase().trim()}`)
    .digest("hex")
    .slice(0, 32);
}

function logBlocked(reason: string, req: RequestLike, details: Record<string, string> = {}) {
  console.warn(
    JSON.stringify({
      event: "contact_submission_blocked",
      reason,
      at: new Date().toISOString(),
      ipHash: hashValue(getIp(req)),
      ...details,
    }),
  );
}

function genericSuccess(res: ResponseLike) {
  return res.status(200).json({ ok: true });
}

function genericError(res: ResponseLike, status = 400) {
  return res.status(status).json({ ok: false, message: "Something went wrong. Please try again." });
}

function isAllowedOrigin(req: RequestLike) {
  const origin = getHeader(req, "origin");
  const referer = getHeader(req, "referer");
  let source = origin || "";

  if (!source && referer) {
    try {
      source = new URL(referer).origin;
    } catch {
      source = "";
    }
  }
  const allowedOrigins = new Set(
    [
      process.env.SITE_ORIGIN,
      ...(process.env.CONTACT_ALLOWED_ORIGINS || "").split(","),
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ]
      .map((item) => (item || "").trim())
      .filter(Boolean),
  );

  if (!source) {
    return process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1";
  }

  return allowedOrigins.has(source);
}

async function readJsonBody(req: RequestLike) {
  if (typeof req.body === "string") {
    if (Buffer.byteLength(req.body, "utf8") > MAX_BODY_BYTES) {
      throw new Error("payload_too_large");
    }

    return JSON.parse(req.body) as ContactPayload;
  }

  if (req.body && typeof req.body === "object") {
    const serialized = JSON.stringify(req.body);
    if (Buffer.byteLength(serialized, "utf8") > MAX_BODY_BYTES) {
      throw new Error("payload_too_large");
    }

    return req.body as ContactPayload;
  }

  if (!req.on) {
    return {};
  }

  return new Promise<ContactPayload>((resolve, reject) => {
    let body = "";

    req.on?.("data", (chunk) => {
      body += String(chunk);

      if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
        reject(new Error("payload_too_large"));
      }
    });

    req.on?.("end", () => {
      try {
        resolve(JSON.parse(body || "{}") as ContactPayload);
      } catch {
        reject(new Error("invalid_json"));
      }
    });
  });
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";

  return value
    .replace(/\0/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function validatePayload(payload: ContactPayload) {
  const honeypot = cleanString(payload.company, 200);
  const data: ContactData = {
    name: cleanString(payload.name, 80),
    email: cleanString(payload.email, 254).toLowerCase(),
    message: cleanString(payload.message, 2_000),
  };

  if (honeypot) {
    return { status: "honeypot" as const, data };
  }

  if (
    data.name.length < 2 ||
    data.name.length > 80 ||
    !emailPattern.test(data.email) ||
    data.message.length < 10 ||
    data.message.length > 2_000
  ) {
    return { status: "invalid" as const, data };
  }

  if (
    htmlPattern.test(data.name) ||
    htmlPattern.test(data.email) ||
    htmlPattern.test(data.message)
  ) {
    return { status: "suspicious" as const, data };
  }

  return { status: "valid" as const, data };
}

function hasUpstashConfig() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function upstashCommand<T = unknown>(command: unknown[]) {
  const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`upstash_${response.status}`);
  }

  const body = (await response.json()) as { result?: T; error?: string };
  if (body.error) {
    throw new Error(body.error);
  }

  return body.result;
}

async function checkUpstashRateLimit(key: string, limit: number, windowSeconds: number): Promise<RateResult> {
  const count = Number(await upstashCommand<number>(["INCR", key]));

  if (count === 1) {
    await upstashCommand(["EXPIRE", key, windowSeconds]);
  }

  const ttl = Number(await upstashCommand<number>(["TTL", key]));

  return {
    allowed: count <= limit,
    remaining: Math.max(limit - count, 0),
    resetSeconds: ttl > 0 ? ttl : windowSeconds,
  };
}

async function checkUpstashDuplicate(key: string) {
  const result = await upstashCommand<"OK" | null>([
    "SET",
    key,
    "1",
    "NX",
    "EX",
    DUPLICATE_WINDOW_SECONDS,
  ]);

  return result === "OK";
}

function cleanupLocalStores(now: number) {
  for (const [key, value] of localCounters.entries()) {
    if (value.expiresAt <= now) localCounters.delete(key);
  }

  for (const [key, expiresAt] of localDuplicates.entries()) {
    if (expiresAt <= now) localDuplicates.delete(key);
  }
}

function checkLocalRateLimit(key: string, limit: number, windowSeconds: number): RateResult {
  const now = Date.now();
  cleanupLocalStores(now);

  const existing = localCounters.get(key);
  const next = existing && existing.expiresAt > now
    ? { count: existing.count + 1, expiresAt: existing.expiresAt }
    : { count: 1, expiresAt: now + windowSeconds * 1_000 };

  localCounters.set(key, next);

  return {
    allowed: next.count <= limit,
    remaining: Math.max(limit - next.count, 0),
    resetSeconds: Math.ceil((next.expiresAt - now) / 1_000),
  };
}

function checkLocalDuplicate(key: string) {
  const now = Date.now();
  cleanupLocalStores(now);

  if (localDuplicates.has(key)) {
    return false;
  }

  localDuplicates.set(key, now + DUPLICATE_WINDOW_SECONDS * 1_000);
  return true;
}

async function checkRateLimit(key: string, limit: number, windowSeconds: number) {
  if (hasUpstashConfig()) {
    return checkUpstashRateLimit(key, limit, windowSeconds);
  }

  if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
    throw new Error("missing_upstash_config");
  }

  return checkLocalRateLimit(key, limit, windowSeconds);
}

async function checkDuplicate(key: string) {
  if (hasUpstashConfig()) {
    return checkUpstashDuplicate(key);
  }

  if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
    throw new Error("missing_upstash_config");
  }

  return checkLocalDuplicate(key);
}

function duplicateKey(data: ContactData, ipHash: string) {
  return `contact:duplicate:${hashValue(`${ipHash}:${data.email}:${data.name}:${data.message}`)}`;
}

async function forwardToFormspree(data: ContactData) {
  const formspreeId = process.env.FORMSPREE_ID || process.env.CONTACT_FORMSPREE_ID;

  if (!formspreeId) {
    throw new Error("missing_formspree_id");
  }

  const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      message: data.message,
    }),
  });

  if (!response.ok) {
    throw new Error(`formspree_${response.status}`);
  }
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed." });
  }

  const contentType = getHeader(req, "content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    logBlocked("invalid_content_type", req);
    return genericError(res, 415);
  }

  if (!isAllowedOrigin(req)) {
    logBlocked("invalid_origin", req);
    return genericError(res, 403);
  }

  let payload: ContactPayload;

  try {
    payload = await readJsonBody(req);
  } catch {
    logBlocked("invalid_payload", req);
    return genericError(res, 400);
  }

  const validation = validatePayload(payload);
  const emailHash = validation.data.email ? hashValue(validation.data.email) : "missing";

  if (validation.status === "honeypot") {
    logBlocked("honeypot", req, { emailHash });
    return genericSuccess(res);
  }

  if (validation.status !== "valid") {
    logBlocked(validation.status, req, { emailHash });
    return genericError(res, 400);
  }

  const ipHash = hashValue(getIp(req));

  try {
    const duplicateAllowed = await checkDuplicate(duplicateKey(validation.data, ipHash));
    if (!duplicateAllowed) {
      logBlocked("duplicate", req, { emailHash });
      return genericSuccess(res);
    }

    const ipLimit = await checkRateLimit(
      `contact:ip:${ipHash}`,
      IP_LIMIT.limit,
      IP_LIMIT.windowSeconds,
    );

    if (!ipLimit.allowed) {
      logBlocked("ip_rate_limit", req, { emailHash });
      return res.status(429).json({ ok: false, message: "Too many requests. Please try again later." });
    }

    const emailLimit = await checkRateLimit(
      `contact:email:${emailHash}`,
      EMAIL_LIMIT.limit,
      EMAIL_LIMIT.windowSeconds,
    );

    if (!emailLimit.allowed) {
      logBlocked("email_rate_limit", req, { emailHash });
      return res.status(429).json({ ok: false, message: "Too many requests. Please try again later." });
    }

    await forwardToFormspree(validation.data);

    return genericSuccess(res);
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "contact_submission_error",
        at: new Date().toISOString(),
        reason: error instanceof Error ? error.message : "unknown",
        ipHash,
        emailHash,
      }),
    );

    return genericError(res, 500);
  }
}
