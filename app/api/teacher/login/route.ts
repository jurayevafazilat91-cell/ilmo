import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fail, parse } from '@/lib/api';
import { setSession, throttled, verifySecret } from '@/lib/auth';
import { classByCode } from '@/lib/store';

const Body = z.object({ code: z.string().trim().length(6), key: z.string().trim().min(6).max(40) });

export async function POST(req: Request) {
  const body = await parse(req, Body);
  if (!body) return fail(400, 'Sinf kodi (6 belgi) va o‘qituvchi kalitini kiriting.');
  if (throttled(`teacher:${body.code.toUpperCase()}`)) return fail(429, 'Urinishlar ko‘p bo‘ldi. 10 daqiqadan keyin qayta urinib ko‘ring.');
  const klass = await classByCode(body.code);
  if (!klass || !verifySecret(body.key.toUpperCase(), klass.teacherKeyHash)) {
    return fail(401, 'Sinf kodi yoki kalit mos kelmadi. Ikkalasini qayta tekshiring.');
  }
  await setSession({ role: 'teacher', classId: klass.id });
  return NextResponse.json({ ok: true });
}
