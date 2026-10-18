import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fail, parse } from '@/lib/api';
import { setSession } from '@/lib/auth';
import { createClass } from '@/lib/store';

const Body = z.object({ name: z.string().trim().min(2).max(40), testLength: z.union([z.literal(8), z.literal(16)]).default(8) });

export async function POST(req: Request) {
  const body = await parse(req, Body);
  if (!body) return fail(400, 'Sinf nomi 2–40 ta belgidan iborat bo‘lsin.');
  const { klass, key } = await createClass(body.name, body.testLength);
  await setSession({ role: 'teacher', classId: klass.id });
  // The key is returned once and stored only as a scrypt hash.
  return NextResponse.json({ code: klass.code, teacherKey: key });
}
