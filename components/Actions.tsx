'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export async function post<T>(url: string, body: unknown): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json().catch(() => null);
    return res.ok ? { data: json as T } : { error: json?.error?.message ?? 'Server hozir javob bermayapti. Bir daqiqadan keyin qayta urinib ko‘ring.' };
  } catch {
    return { error: 'Internetga ulanib bo‘lmadi. Aloqani tekshirib, qayta urinib ko‘ring.' };
  }
}

// One click into the demo class: creates a guest student and opens the pre-test.
export function DemoStart({ className = '', label = 'Sinab ko‘rish' }: { className?: string; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return (
    <div>
      <button type="button" disabled={busy} className={className}
        onClick={async () => {
          setBusy(true);
          const r = await post('/api/student/join', { demo: true });
          if (r.error) { setError(r.error); setBusy(false); return; }
          router.push('/test/oldingi');
          router.refresh();
        }}>
        {busy ? 'Ochilmoqda…' : label} <span aria-hidden="true">→</span>
      </button>
      {error && <p role="alert" className="mt-2 text-[15px] text-gold-soft">{error}</p>}
    </div>
  );
}

export function DemoTeacher({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  return (
    <div>
      <button type="button" className={className}
        onClick={async () => {
          const r = await post('/api/teacher/login', { code: 'NAMUNA', key: 'NAMUNA-USTOZ' });
          if (r.error) return setError(r.error);
          router.push('/oqituvchi');
          router.refresh();
        }}>
        Demo o‘qituvchi panelini ochish <span aria-hidden="true">→</span>
      </button>
      {error && <p role="alert" className="mt-2 text-[15px] text-xato">{error}</p>}
    </div>
  );
}
