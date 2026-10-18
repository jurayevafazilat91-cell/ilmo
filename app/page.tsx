import Link from 'next/link';
import { Bobur, Molecule } from '@/components/Art';
import { DemoStart } from '@/components/Actions';
import { GroupMap } from '@/components/GroupMap';
import { activeMisconceptions } from '@/lib/engine';
import { currentStudent } from '@/lib/progress';

const pill = 'inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-[16px] font-semibold transition-transform active:scale-[.98]';

export default async function Home() {
  const st = await currentStudent();
  const latest = st?.post ?? st?.pre;
  const tested = st?.student.misconceptionIds ?? [];
  const active = latest ? activeMisconceptions(latest.answers) : [];
  const steps = ['Oldingi test', 'Bobur bilan suhbat', 'Keyingi test'];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-[34px] leading-tight font-bold md:text-[42px]">Salom{st ? `, ${st.student.nickname}` : ''}!</h1>
        <p className="mt-1 text-muted">Har kuni bir qadam oldinga.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <section className="relative overflow-hidden rounded-2xl bg-moss px-6 py-7 text-white md:px-8 md:py-9">
          <div className="relative z-[1] max-w-[22rem]">
            <div className="h-0.5 w-10 bg-gold" />
            <h2 className="mt-4 font-serif text-[30px] leading-[1.15] font-bold md:text-[36px]">Bilimingdagi bo‘shliqni top</h2>
            <p className="mt-3 text-white/85">8 ta savol. Har bir xato ortidagi noto‘g‘ri ishonchni topamiz va uni birga tuzatamiz.</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {st ? (
                <Link href={st.next.href} className={`${pill} bg-paper text-forest`}>{st.next.label} <span aria-hidden="true">→</span></Link>
              ) : (
                <DemoStart className={`${pill} bg-paper text-forest`} />
              )}
              {!st && <Link href="/kirish" className="min-h-12 content-center text-[16px] text-white underline decoration-gold underline-offset-4">Sinf kodi bilan kirish</Link>}
            </div>
          </div>
          <Molecule className="pointer-events-none absolute -right-6 bottom-0 hidden w-[50%] max-w-[420px] sm:block lg:hidden xl:block" />
        </section>

        <section className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-sage px-6 py-7">
          <div className="max-w-[60%]">
            <div className="h-0.5 w-10 bg-gold" />
            <h2 className="mt-4 font-serif text-[28px] leading-tight font-bold">Sen ustozsan</h2>
            <p className="mt-2 text-muted">Xatoni top. Tushuntir. O‘rgat.</p>
          </div>
          <Link href={st?.teach[0] ? `/bobur/${st.pendingTeach[0] ?? st.teach[0]}` : st ? st.next.href : '/kirish'}
            className={`${pill} mt-6 self-start bg-forest text-white`}>Boshlash <span aria-hidden="true">→</span></Link>
          <Bobur className="absolute right-3 bottom-3 w-[42%] max-w-[150px]" />
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-line bg-card px-6 py-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-serif text-[22px] font-bold">Bilim xaritasi</h2>
            <Link href="/natija" className="text-[15px] font-medium text-moss">Batafsil <span aria-hidden="true">→</span></Link>
          </div>
          <p className="text-[15px] text-muted">{latest ? 'Har bir mavzudagi xato ishonchlaring.' : 'Testdan keyin bu yerda mavzular bo‘yicha xaritang chiqadi.'}</p>
          <GroupMap tested={tested} active={active} />
        </section>

        <section className="rounded-2xl border border-line bg-card px-6 py-6">
          <h2 className="font-serif text-[22px] font-bold">Bugungi maqsad</h2>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <Donut done={st?.stepsDone ?? 0} total={3} />
            <ol className="space-y-2 text-[15px]">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5">
                  <span className={`grid size-6 place-items-center rounded-full border text-[12px] ${i < (st?.stepsDone ?? 0) ? 'border-forest bg-forest text-white' : 'border-gold text-transparent'}`} aria-hidden="true">✓</span>
                  <span>{s}{i < (st?.stepsDone ?? 0) && <span className="sr-only"> — bajarildi</span>}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-card px-6 py-6">
        <h2 className="font-serif text-[22px] font-bold">Mening o‘sishim</h2>
        {st?.pre ? (
          <div className="mt-4 flex items-end gap-6">
            {[{ label: 'Oldin', a: st.pre }, { label: 'Keyin', a: st.post }].map(({ label, a }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="font-semibold">{a ? `${a.score}/${a.answers.length}` : '—'}</span>
                <div className="flex h-36 w-14 items-end rounded-lg bg-sage">
                  <div className={`w-full rounded-lg ${label === 'Oldin' ? 'bg-moss/60' : 'bg-forest'}`} style={{ height: a ? `${(a.score / a.answers.length) * 100}%` : 0 }} />
                </div>
                <span className="text-[15px] text-muted">{label}</span>
              </div>
            ))}
            <p className="max-w-xs text-[15px] text-muted">{st.post ? 'To‘g‘ri javoblar soni, oldingi va keyingi test.' : 'Keyingi testdan keyin ikkinchi ustun to‘ladi.'}</p>
          </div>
        ) : (
          <p className="mt-2 text-muted">Hali natija yo‘q. Birinchi testdan keyin o‘sishing shu yerda ko‘rinadi.</p>
        )}
      </section>

      <p className="pb-2 text-[15px] text-muted">
        Ota-ona yoki o‘qituvchimisiz? <Link href="/demo" className="font-medium text-moss underline underline-offset-4">Demo sinfni ko‘ring</Link>
      </p>
    </div>
  );
}

function Donut({ done, total }: { done: number; total: number }) {
  const c = 2 * Math.PI * 42;
  return (
    <svg viewBox="0 0 100 100" className="size-28 shrink-0" role="img" aria-label={`${total} qadamdan ${done} tasi bajarildi`}>
      <circle cx="50" cy="50" r="42" fill="none" stroke="#e4ede2" strokeWidth="9" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#143d2c" strokeWidth="9" strokeLinecap="round"
        strokeDasharray={`${(done / total) * c} ${c}`} transform="rotate(-90 50 50)" />
      <text x="50" y="57" textAnchor="middle" className="fill-ink font-serif text-[22px] font-bold">{done} / {total}</text>
    </svg>
  );
}
