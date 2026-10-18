import { GROUPS, MISCONCEPTIONS, type GroupId } from '@/content/misconceptions';

const GLYPH: Record<GroupId, string> = { daraja: 'x²', manfiy: '−3', kasr: '½', ifoda: '( )', tenglama: '=' };

// Topic-level "Bilim xaritasi": one node per group, gold strand between them, as in the design.
export function GroupMap({ tested, active }: { tested: string[]; active: string[] }) {
  const groups = Object.keys(GROUPS) as GroupId[];
  return (
    <ol className="mt-5 flex items-start justify-between gap-1 overflow-x-auto pb-1">
      {groups.map((g, i) => {
        const ids = MISCONCEPTIONS.filter((m) => m.group === g).map((m) => m.id);
        const t = ids.filter((id) => tested.includes(id)).length;
        const a = ids.filter((id) => active.includes(id)).length;
        const state = !t ? 'none' : a ? 'xato' : 'ok';
        return (
          <li key={g} className="relative flex min-w-[88px] flex-1 flex-col items-center text-center">
            {i > 0 && <span aria-hidden="true" className="absolute top-8 right-1/2 -z-0 h-0.5 w-full bg-gold/60" />}
            <span className={`relative z-[1] grid size-16 place-items-center rounded-full font-serif text-[22px] font-bold ring-4 ${
              state === 'xato' ? 'bg-card text-xato ring-xato/70' : state === 'ok' ? 'bg-forest text-white ring-gold/60' : 'bg-sage text-moss ring-gold-soft'
            }`}>{GLYPH[g]}</span>
            <span className="mt-2 text-[14px] font-semibold leading-tight">{GROUPS[g]}</span>
            <span className={`text-[13px] ${state === 'xato' ? 'text-xato' : 'text-muted'}`}>
              {state === 'none' ? 'Tekshirilmagan' : a ? `${a} ta xato ishonch` : 'Xato topilmadi'}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
