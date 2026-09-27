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

  const given = Buffer.from(password);
  const target = Buffer.from(expected);

  if (given.length !== target.length) {
    // Esegue comunque un confronto a tempo costante per non rivelare
    // la lunghezza, poi restituisce false.
    crypto.timingSafeEqual(target, target);
    return false;
  }

  return crypto.timingSafeEqual(given, target);
}

export { COOKIE_NAME };
