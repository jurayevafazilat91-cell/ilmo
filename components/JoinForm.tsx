'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { DemoStart, post } from './Actions';

const field = 'mt-1 block min-h-12 w-full rounded-xl border-2 border-line bg-card px-4 text-[18px] focus:border-forest focus:outline-none';

export function JoinForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [joined, setJoined] = useState<{ nickname: string; recoveryCode: string } | null>(null);

  async function join(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await post<{ nickname: string; recoveryCode: string }>('/api/student/join', { classCode: String(f.get('code')).toUpperCase(), nickname: f.get('nickname') });
    if (r.error) return setError(r.error);
    setJoined(r.data!);
    router.refresh();
  }

  async function rejoin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await post('/api/student/rejoin', { classCode: String(f.get('code')).toUpperCase(), nickname: f.get('nickname'), code: String(f.get('recovery')).toUpperCase() });
    if (r.error) return setError(r.error);
    router.push('/');
    router.refresh();
  }

  if (joined) {
    return (
      <section className="rounded-2xl border border-line bg-card px-5 py-6">
        <p>Xush kelibsiz, <b>{joined.nickname}</b>! Qaytib kirish uchun tiklash kodingiz:</p>
        <p className="mt-3 font-mono text-[32px] font-bold tracking-[.2em] text-forest">{joined.recoveryCode}</p>
        <p className="mt-1 text-[15px] text-muted">Kodni yozib qo‘ying. U faqat hozir bir marta ko‘rsatiladi.</p>
        <Link href="/test/oldingi" className="mt-5 inline-flex min-h-12 items-center rounded-full bg-forest px-7 font-semibold text-white">Testni boshlash →</Link>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={join} className="space-y-4 rounded-2xl border border-line bg-card px-5 py-6">
        <label className="block font-medium">Sinf kodi
          <input name="code" required minLength={6} maxLength={6} autoComplete="off" className={`${field} font-mono uppercase tracking-[.2em]`} />
        </label>
        <label className="block font-medium">Taxallus
          <input name="nickname" required minLength={2} maxLength={20} autoComplete="off" className={field} />
          <span className="mt-1 block text-[14px] font-normal text-muted">Haqiqiy ismingizni yozmang. Masalan: Lochin7.</span>
        </label>
        {error && <p role="alert" className="text-xato">{error}</p>}
        <button className="min-h-12 rounded-full bg-forest px-7 font-semibold text-white">Sinfga kirish</button>
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-muted">Kodingiz yo‘qmi?</span>
        <DemoStart className="min-h-12 rounded-full border-2 border-forest px-6 font-semibold text-forest" />
      </div>

      <details className="rounded-2xl border border-line bg-card px-5 py-4">
        <summary className="min-h-10 cursor-pointer content-center font-medium">Avval kirganmisiz? Tiklash kodi bilan qayting</summary>
        <form onSubmit={rejoin} className="mt-3 space-y-3">
          <label className="block">Sinf kodi<input name="code" required minLength={6} maxLength={6} className={`${field} font-mono uppercase`} /></label>
          <label className="block">Taxallus<input name="nickname" required minLength={2} maxLength={20} className={field} /></label>
          <label className="block">Tiklash kodi<input name="recovery" required minLength={6} maxLength={6} className={`${field} font-mono uppercase`} /></label>
          <button className="min-h-12 rounded-full bg-forest px-7 font-semibold text-white">Qaytib kirish</button>
        </form>
      </details>
    </div>
  );
}
