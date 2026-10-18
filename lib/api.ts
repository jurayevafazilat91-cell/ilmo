import { NextResponse } from 'next/server';
import type { ZodType } from 'zod';

// One error shape for every route: { error: { message } } with an Uzbek, actionable message.
export const fail = (status: number, message: string) => NextResponse.json({ error: { message } }, { status });

export async function parse<T>(req: Request, schema: ZodType<T>): Promise<T | null> {
  try {
    const r = schema.safeParse(await req.json());
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}

export const BAD_INPUT = 'So‘rov noto‘g‘ri. Sahifani yangilab, qaytadan urinib ko‘ring.';
