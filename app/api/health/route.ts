import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { connectDb } from '@/lib/db';
import { dbMode } from '@/lib/store';

export async function GET() {
  if (dbMode === 'memory') return NextResponse.json({ ok: true, db: 'memory', aiMode: 'scripted' });
  try {
    await connectDb();
    await mongoose.connection.db!.admin().ping();
    return NextResponse.json({ ok: true, db: 'mongodb', aiMode: 'scripted' });
  } catch {
    return NextResponse.json({ ok: false, db: 'down', aiMode: 'scripted' }, { status: 503 });
  }
}
