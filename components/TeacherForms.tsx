'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { DemoTeacher, post } from './Actions';

const field = 'mt-1 block min-h-12 w-full rounded-xl border-2 border-line bg-card px-4 text-[18px] focus:border-forest focus:outline-none';
const btn = 'min-h-12 rounded-full bg-forest px-7 font-semibold text-white';

export function TeacherForms() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ code: string; teacherKey: string } | null>(null);

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await post<{ code: string; teacherKey: string }>('/api/class', { name: f.get('name'), testLength: Number(f.get('len')) });
    if (r.error) return setError(r.error);
    setCreated(r.data!);
  }

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await post('/api/teacher/login', { code: String(f.get('code')).toUpperCase(), key: String(f.get('key')).toUpperCase() });
    if (r.error) return setError(r.error);
    router.refresh();
  }

  if (created) {
    return (
      <section className="mt-6 rounded-2xl border border-line bg-card px-5 py-6">
        <p>Sinf yaratildi. Bu ma’lumotlarni yozib qo‘ying, kalit faqat hozir bir marta ko‘rsatiladi.</p>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <dt className="text-muted">Sinf kodi</dt><dd className="font-mono text-[24px] font-bold tracking-widest text-forest">{created.code}</dd>
          <dt className="text-muted">O‘qituvchi kaliti</dt><dd className="font-mono text-[20px] font-bold tracking-wider break-all">{created.teacherKey}</dd>
        </dl>
        <button type="button" onClick={() => router.refresh()} className={`${btn} mt-5`}>Panelga o‘tish →</button>
      </section>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {error && <p role="alert" className="text-xato">{error}</p>}
      <form onSubmit={login} className="space-y-3 rounded-2xl border border-line bg-card px-5 py-6">
        <h2 className="font-serif text-[22px] font-bold">Kirish</h2>
        <label className="block">Sinf kodi<input name="code" required minLength={6} maxLength={6} className={`${field} font-mono uppercase`} /></label>
        <label className="block">O‘qituvchi kaliti<input name="key" type="password" required minLength={6} className={field} /></label>
        <button className={btn}>Panelga kirish</button>
      </form>
      <form onSubmit={create} className="space-y-3 rounded-2xl border border-line bg-card px-5 py-6">
        <h2 className="font-serif text-[22px] font-bold">Yangi sinf</h2>
        <label className="block">Sinf nomi<input name="name" required minLength={2} maxLength={40} placeholder="Masalan: 7-B" className={field} /></label>
        <label className="block">Test uzunligi
          <select name="len" className={field} defaultValue="8">
            <option value="8">8 ta savol</option>
            <option value="16">16 ta savol</option>
          </select>
        </label>
        <button className={btn}>Sinf yaratish</button>
      </form>
      <DemoTeacher className="min-h-12 rounded-full border-2 border-forest px-6 font-semibold text-forest" />
    </div>
  );
}
