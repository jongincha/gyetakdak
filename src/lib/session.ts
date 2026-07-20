import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const secretKey = process.env.SESSION_SECRET ?? "dev-only-insecure-secret-change-me";
const encodedKey = new TextEncoder().encode(secretKey);

interface SessionPayload {
  role: "admin";
  [key: string]: unknown;
}

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function createAdminSession() {
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
  const session = await encrypt({ role: "admin" });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSessionCookieName() {
  return SESSION_COOKIE;
}
