'use client';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { post } from './Actions';

type Q = { id: string; topic: string; stemHtml: string; options: { id: string; html: string }[] };

export function TestRunner({ phase, questions }: { phase: 'pre' | 'post'; questions: Q[] }) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const ms = useRef<Record<string, number>>({});
  const shownAt = useRef(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const q = questions[i];
  const last = i === questions.length - 1;

  const go = (to: number) => {
    const now = performance.now();
    if (shownAt.current) ms.current[q.id] = (ms.current[q.id] ?? 0) + Math.round(now - shownAt.current);
    shownAt.current = now;
    setI(to);
  };

  async function submit() {
    go(i);
    setBusy(true);
    const answers = questions.map((x) => ({ questionId: x.id, optionId: picked[x.id], ms: Math.min(ms.current[x.id] ?? 0, 3_600_000) }));
    const r = await post('/api/test/submit', { phase, answers });
    if (r.error) { setError(r.error); setBusy(false); return; }
    router.push('/natija');
    router.refresh();
  }

  return (
    <div className="mt-6" onPointerDown={() => { if (!shownAt.current) shownAt.current = performance.now(); }}>
      <div className="flex items-center justify-between text-[15px] text-muted">
        <span>{i + 1}-savol, jami {questions.length} ta</span>
        <span>{q.topic}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-sage" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={i + 1}>
        <div className="h-full rounded-full bg-gold transition-[width]" style={{ width: `${((i + 1) / questions.length) * 100}%` }} />
      </div>

      <fieldset className="mt-6 rounded-2xl border border-line bg-card px-5 py-6 md:px-7">
        <legend className="sr-only">{i + 1}-savol</legend>
        <p className="text-[22px] leading-snug font-medium" dangerouslySetInnerHTML={{ __html: q.stemHtml }} />
        <div className="mt-5 grid gap-3">
          {q.options.map((o) => {
            const on = picked[q.id] === o.id;
            return (
              <label key={o.id} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-[19px] transition-colors ${on ? 'border-forest bg-sage' : 'border-line bg-paper hover:border-gold'}`}>
                <input type="radio" name={q.id} value={o.id} checked={on} className="size-5 accent-forest"
                  onChange={() => setPicked((p) => ({ ...p, [q.id]: o.id }))} />
                <span dangerouslySetInnerHTML={{ __html: o.html }} />
              </label>
            );
          })}
        </div>
      </fieldset>

      {error && <p role="alert" className="mt-4 text-xato">{error}</p>}

      <div className="mt-5 flex items-center justify-between gap-3">
        <button type="button" onClick={() => go(i - 1)} disabled={i === 0}
          className="min-h-12 rounded-full px-5 font-medium text-moss disabled:invisible">← Oldingi</button>
        {last ? (
          <button type="button" onClick={submit} disabled={busy || questions.some((x) => !picked[x.id])}
            className="min-h-12 rounded-full bg-forest px-7 font-semibold text-white disabled:opacity-50">
            {busy ? 'Tekshirilmoqda…' : 'Natijani ko‘rish'}
          </button>
        ) : (
          <button type="button" onClick={() => go(i + 1)} disabled={!picked[q.id]}
            className="min-h-12 rounded-full bg-forest px-7 font-semibold text-white disabled:opacity-50">Keyingi savol →</button>
        )}
      </div>
      {last && questions.some((x) => !picked[x.id]) && (
        <p className="mt-3 text-right text-[15px] text-muted">Barcha savollarga javob bering, keyin natijani ko‘rasiz.</p>
      )}
    </div>
  );
}
