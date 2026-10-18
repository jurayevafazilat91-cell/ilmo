import { NextResponse } from 'next/server';
import { z } from 'zod';
import { MISCONCEPTION_BY_ID } from '@/content/misconceptions';
import { fail, parse } from '@/lib/api';
import { studentSession } from '@/lib/auth';
import { boburTurn, boburView, triedCards } from '@/lib/bobur';
import { getBobur, saveBobur, studentById } from '@/lib/store';

const Body = z.object({ misconceptionId: z.string().regex(/^M\d{2}$/), cardChoiceId: z.string().max(4) });

export async function POST(req: Request) {
  const session = await studentSession();
  const student = session && (await studentById(session.studentId));
  if (!student) return fail(401, 'Sessiya tugagan. «Kirish» sahifasidan qayta kiring.');
  const body = await parse(req, Body);
  const m = body && MISCONCEPTION_BY_ID.get(body.misconceptionId);
  if (!body || !m) return fail(400, 'Bunday mavzu topilmadi. Natija sahifasiga qayting.');
  const next = boburTurn(m, await getBobur(student.id, m.id), student.id, body.cardChoiceId);
  if (!next) return fail(400, 'Bu javob varianti topilmadi. Kartalardan birini tanlang.');
  await saveBobur(next);
  return NextResponse.json({ ...boburView(next), tried: triedCards(m, next) });
}
