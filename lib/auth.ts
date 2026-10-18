import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// shortcut: a missing SESSION_SECRET falls back to a per-process random key (sessions reset on restart); set it before deploying.
// Kept on globalThis because route handlers and pages load this module in separate bundles.
const g = globalThis as unknown as { __ilmoSecret?: string };
const secret = new TextEncoder().encode(process.env.SESSION_SECRET || (g.__ilmoSecret ??= randomBytes(32).toString('hex')));

export type Session = { role: 'student'; studentId: string; classId: string } | { role: 'teacher'; classId: string };

const COOKIE = { student: 'ilmo_s', teacher: 'ilmo_t' } as const;

export async function setSession(s: Session) {
  const token = await new SignJWT(s).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('12h').sign(secret);
  (await cookies()).set(COOKIE[s.role], token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 12,
  });
}

async function read<R extends Session['role']>(role: R): Promise<Extract<Session, { role: R }> | null> {
  const token = (await cookies()).get(COOKIE[role])?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === role ? (payload as unknown as Extract<Session, { role: R }>) : null;
  } catch {
    return null;
  }
}

export const studentSession = () => read('student');
export const teacherSession = () => read('teacher');

export function hashSecret(value: string): string {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(value, salt, 32).toString('hex')}`;
}

export function verifySecret(value: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const a = Buffer.from(hash, 'hex');
  const b = scryptSync(value, salt, 32);
  return a.length === b.length && timingSafeEqual(a, b);
}

// No 0/O/1/I so codes are easy to read aloud and copy.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const randomCode = (len = 6) => [...randomBytes(len)].map((b) => ALPHABET[b % ALPHABET.length]).join('');

// In-process attempt throttle for login/rejoin: 8 tries per key per 10 minutes.
const attempts = new Map<string, { n: number; until: number }>();
export function throttled(key: string): boolean {
  const now = Date.now();
  const e = attempts.get(key);
  if (!e || e.until < now) {
    attempts.set(key, { n: 1, until: now + 10 * 60_000 });
    return false;
  }
  e.n++;
  return e.n > 8;
}
