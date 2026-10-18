import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fail, parse } from '@/lib/api';
import { setSession, throttled, verifySecret } from '@/lib/auth';
import { classByCode, classStudents } from '@/lib/store';

const Body = z.object({
  classCode: z.string().trim().length(6),
  nickname: z.string().trim().min(2).max(20),
  code: z.string().trim().length(6),
});

export async function POST(req: Request) {
  const body = await parse(req, Body);
  if (!body) return fail(400, 'Sinf kodi, taxallus va 6 belgili tiklash kodini kiriting.');
  if (throttled(`rejoin:${body.classCode}:${body.nickname}`)) return fail(429, 'Urinishlar ko‘p bo‘ldi. 10 daqiqadan keyin qayta urinib ko‘ring.');
  const klass = await classByCode(body.classCode);
  const student = klass && (await classStudents(klass.id)).find((s) => s.nickname.toLowerCase() === body.nickname.toLowerCase());
  if (!klass || !student || !verifySecret(body.code.toUpperCase(), student.studentCodeHash)) {
    return fail(401, 'Ma’lumotlar mos kelmadi. Sinf kodi, taxallus va tiklash kodini tekshiring.');
  }
  await setSession({ role: 'student', studentId: student.id, classId: klass.id });
  return NextResponse.json({ nickname: student.nickname });
}
