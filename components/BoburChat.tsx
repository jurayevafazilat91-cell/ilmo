'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { post } from './Actions';

type View = { turns: { role: 'bobur' | 'student'; html: string }[]; resolved: boolean; done: boolean; tried: string[] };

export function BoburChat({ misconceptionId, initial, cards, teaching, next }: {
  misconceptionId: string; initial: View; cards: { id: string; html: string }[];
  teaching: { idea: string; card: string }; next: { href: string; label: string };
}) {
  const router = useRouter();
  const [view, setView] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pick(cardChoiceId: string) {
    setBusy(true);
    setError('');
    const r = await post<View>('/api/bobur/turn', { misconceptionId, cardChoiceId });
    setBusy(false);
    if (r.error || !r.data) return setError(r.error ?? 'Xatolik yuz berdi. Qayta urinib ko‘ring.');
    setView(r.data);
    router.refresh();
  }

  return (
    <div className="mt-6">
      <ol className="space-y-3" aria-live="polite">
        {view.turns.map((t, i) => (
          <li key={i} className={`flex ${t.role === 'student' ? 'justify-end' : ''}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${t.role === 'student' ? 'rounded-br-md bg-forest text-white' : 'rounded-bl-md border border-line bg-card'}`}>
              <p className="sr-only">{t.role === 'student' ? 'Sen:' : 'Bobur:'}</p>
              <p dangerouslySetInnerHTML={{ __html: t.html }} />
            </div>
          </li>
        ))}
      </ol>

      {!view.done ? (
        <fieldset className="mt-6" disabled={busy}>
          <legend className="font-semibold">Boburni qaysi tushuntirish ishontiradi?</legend>
          <div className="mt-3 grid gap-3">
            {cards.map((c) => (
              <button key={c.id} type="button" onClick={() => pick(c.id)} disabled={view.tried.includes(c.id)}
                className="min-h-14 rounded-xl border-2 border-line bg-paper px-4 py-3 text-left transition-colors hover:border-gold disabled:opacity-45">
                <span dangerouslySetInnerHTML={{ __html: c.html }} />
              </button>
            ))}
          </div>
          {error && <p role="alert" className="mt-3 text-xato">{error}</p>}
        </fieldset>
      ) : (
        <div className="mt-6 rounded-2xl bg-sage px-5 py-5">
          {view.resolved ? (
            <p className="font-semibold text-fixed">Bobur tushundi. Sen yaxshi ustozsan!</p>
          ) : (
            <>
              <p className="font-semibold">Keling, birga ko‘rib chiqamiz:</p>
              <p className="mt-2" dangerouslySetInnerHTML={{ __html: teaching.idea }} />
              <p className="mt-2 text-muted" dangerouslySetInnerHTML={{ __html: teaching.card }} />
            </>
          )}
          <Link href={next.href} className="mt-4 inline-flex min-h-12 items-center rounded-full bg-forest px-7 font-semibold text-white">
            {next.label} <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
