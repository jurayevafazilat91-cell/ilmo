import { MISCONCEPTIONS } from '@/content/misconceptions';

export type NodeState = 'untested' | 'ok' | 'active' | 'fixed';

const COLOR: Record<NodeState, string> = { untested: '#e8e0cc', ok: '#1c4a36', active: '#c2461f', fixed: '#1f7a5c' };
const LABEL: Record<NodeState, string> = { untested: 'tekshirilmagan', ok: 'xato ishonch yo‘q', active: 'xato ishonch', fixed: 'tuzatildi' };

// The signature "DNK zanjiri": 16 nodes in two rows of 8. An active node breaks the strand before it;
// a fixed node reconnects it with the one orchestrated animation.
export function DnkChain({ states }: { states: Record<string, NodeState> }) {
  const rows = [MISCONCEPTIONS.slice(0, 8), MISCONCEPTIONS.slice(8)];
  return (
    <figure>
      {rows.map((row, r) => (
        <svg key={r} viewBox="0 0 344 64" className="block w-full max-w-[640px]" role="img"
          aria-label={row.map((m) => `${m.topic}: ${LABEL[states[m.id] ?? 'untested']}`).join('; ')}>
          {row.map((m, i) => {
            const x = 22 + i * 43;
            const s = states[m.id] ?? 'untested';
            const strandX1 = x - 43 + 13;
            const strandX2 = x - 13;
            return (
              <g key={m.id}>
                {i > 0 && (s === 'active' ? (
                  <>
                    <line x1={strandX1} y1="32" x2={strandX1 + 6} y2="32" stroke="#c2461f" strokeWidth="3" strokeLinecap="round" />
                    <line x1={strandX2 - 6} y1="32" x2={strandX2} y2="32" stroke="#c2461f" strokeWidth="3" strokeLinecap="round" />
                  </>
                ) : (
                  <line x1={strandX1} y1="32" x2={strandX2} y2="32" stroke={s === 'fixed' ? '#1f7a5c' : '#c9a24a'} strokeWidth="3"
                    strokeLinecap="round" className={s === 'fixed' ? 'strand-fixed' : undefined} />
                ))}
                <circle cx={x} cy="32" r="12" fill={s === 'untested' ? '#fffdf8' : COLOR[s]} stroke={COLOR[s]} strokeWidth="2.5" />
                <text x={x} y="36.5" textAnchor="middle" fontSize="11" fontWeight="700" fill={s === 'untested' ? '#56645b' : '#fff'}>
                  {Number(m.id.slice(1))}
                </text>
                <title>{`${m.topic}: ${LABEL[s]}`}</title>
              </g>
            );
          })}
        </svg>
      ))}
      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-muted">
        {(['active', 'fixed', 'ok', 'untested'] as NodeState[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className="size-3 rounded-full border-2" style={{ background: s === 'untested' ? '#fffdf8' : COLOR[s], borderColor: COLOR[s] }} />
            {LABEL[s][0].toUpperCase() + LABEL[s].slice(1)}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
