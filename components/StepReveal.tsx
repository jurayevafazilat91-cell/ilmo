'use client';
import { useState } from 'react';

// Counterexample revealed one step per tap.
export function StepReveal({ steps }: { steps: string[] }) {
  const [n, setN] = useState(1);
  return (
    <div className="mt-3 rounded-xl bg-paper px-4 py-3">
      <ol className="space-y-2" aria-live="polite">
        {steps.slice(0, n).map((html, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold-soft text-[13px] font-bold text-forest">{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: html }} />
          </li>
        ))}
      </ol>
      {n < steps.length && (
        <button type="button" onClick={() => setN(n + 1)} className="mt-3 min-h-11 rounded-full border border-forest px-5 text-[15px] font-semibold text-forest">
          Keyingi qadam
        </button>
      )}
    </div>
  );
}
