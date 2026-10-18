import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fail, parse } from '@/lib/api';
import { randomCode, setSession } from '@/lib/auth';
import { DEMO_CODE, classByCode, createStudent } from '@/lib/store';

const Body = z.union([
  z.object({ demo: z.literal(true) }),
  z.object({
    classCode: z.string().trim().length(6),
    nickname: z.string().trim().min(2).max(20).regex(/^[\p{L}\p{N} _‘’'-]+$/u),
  }),
]);

export async function POST(req: Request) {
  const body = await parse(req, Body);
  if (!body) return fail(400, 'Sinf kodi 6 ta belgidan, taxallus 2–20 ta harfdan iborat bo‘lsin.');
  const klass = await classByCode('demo' in body ? DEMO_CODE : body.classCode);
  if (!klass) return fail(404, 'Bunday sinf kodi topilmadi. Kodni o‘qituvchingizdan qayta so‘rang.');
  const nickname = 'demo' in body ? `Mehmon-${randomCode(4)}` : body.nickname;
  const created = await createStudent(klass, nickname);
  if (!created) return fail(409, 'Bu taxallus sinfda band. Boshqa taxallus tanlang.');
  await setSession({ role: 'student', studentId: created.student.id, classId: klass.id });
  return NextResponse.json({ nickname, recoveryCode: created.code, isDemo: klass.isDemo });
}
