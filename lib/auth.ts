import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "fallback-secret-change-me";
const COOKIE_NAME = "volta_session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export function createSessionToken(): string {
  const payload = JSON.stringify({
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL * 1000,
  });
  const data = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function validateSessionToken(token: string): boolean {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return false;
    const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
    if (sig !== expected) return false;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return crypto.timingSafeEqual(
    Buffer.from(password),
    Buffer.from(expected)
  );
}

export { COOKIE_NAME };
