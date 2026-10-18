import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fail, parse } from '@/lib/api';
import { studentSession } from '@/lib/auth';
import { activeMisconceptions, grade, questionFor } from '@/lib/engine';
import { attemptOf, saveAttempt, studentById } from '@/lib/store';

const Body = z.object({
  phase: z.enum(['pre', 'post']),
  answers: z.array(z.object({
    questionId: z.string().max(20),
    optionId: z.string().max(2),
    ms: z.number().int().min(0).max(3_600_000),
  })).max(16),
});

export async function POST(req: Request) {
  const session = await studentSession();
  const student = session && (await studentById(session.studentId));
  if (!student) return fail(401, 'Sessiya tugagan. «Kirish» sahifasidan qayta kiring.');
  const body = await parse(req, Body);
  if (!body) return fail(400, 'Javoblar to‘liq emas. Har bir savolga javob bering.');
  if (body.phase === 'post' && !(await attemptOf(student.id, 'pre'))) return fail(409, 'Avval oldingi testni topshiring.');
  if (await attemptOf(student.id, body.phase)) return fail(409, 'Bu test allaqachon topshirilgan. Natijani ko‘ring.');

  const allowed = student.misconceptionIds.map((mid) => questionFor(mid, body.phase).id);
  let graded;
  try {
    graded = grade(body.answers, allowed);
  } catch {
    return fail(400, 'Javoblar testga mos kelmadi. Sahifani yangilab, testni qayta boshlang.');
  }
  const attempt = await saveAttempt(student, body.phase, graded);
  return NextResponse.json({ score: attempt.score, total: graded.length, active: activeMisconceptions(graded) });
}
