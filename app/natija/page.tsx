import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MISCONCEPTION_BY_ID } from '@/content/misconceptions';
import { DnkChain, type NodeState } from '@/components/DnkChain';
import { StepReveal } from '@/components/StepReveal';
import { activeMisconceptions, compare, type Change } from '@/lib/engine';
import { renderMath } from '@/lib/math';
import { currentStudent } from '@/lib/progress';

const CHANGE: Record<Change, { label: string; tone: string }> = {
  tuzatildi: { label: 'Tuzatildi', tone: 'text-fixed' },
  saqlanib_qoldi: { label: 'Saqlanib qoldi', tone: 'text-xato' },
  boshqa_xato: { label: 'Boshqa xato', tone: 'text-muted' },
  togri: { label: 'To‘g‘ri edi, to‘g‘ri qoldi', tone: 'text-moss' },
  yangi_xato: { label: 'Yangi xato ishonch', tone: 'text-xato' },
};

export default async function Natija() {
  const st = await currentStudent();
  if (!st) redirect('/kirish');
  if (!st.pre) redirect('/test/oldingi');

  const changes = st.post ? compare(st.pre.answers, st.post.answers) : [];
  const postActive = st.post ? activeMisconceptions(st.post.answers) : [];
  const states: Record<string, NodeState> = {};
  for (const mid of st.student.misconceptionIds) states[mid] = st.preActive.includes(mid) ? 'active' : 'ok';
  for (const c of changes) states[c.misconceptionId] = c.status === 'tuzatildi' ? 'fixed' : postActive.includes(c.misconceptionId) ? 'active' : 'ok';
  const focus = st.post ? postActive : st.preActive;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-2xl border border-line bg-card px-5 py-6 md:px-7">
        <h1 className="font-serif text-[30px] leading-tight font-bold md:text-[36px]">
          {st.post ? `Xato DNK: ${st.preActive.length} → ${postActive.length}` : `${st.preActive.length} ta ehtimoliy xato ishonch topildi`}
        </h1>
        <p className="mt-2 text-muted">
          To‘g‘ri javoblar: oldin {st.pre.score}/{st.pre.answers.length}
          {st.post && <>, keyin {st.post.score}/{st.post.answers.length}</>}.
          {!st.post && ' Har bir ishonch bitta savoldan aniqlandi, keyingi test uni yana tekshiradi.'}
        </p>
        <div className="mt-5"><DnkChain states={states} /></div>
      </section>

      {focus.length > 0 ? (
        <section aria-labelledby="ishonchlar" className="space-y-4">
          <h2 id="ishonchlar" className="font-serif text-[24px] font-bold">{st.post ? 'Hali tuzatish kerak' : 'Ishonchni tuzatish imkoniyatlari'}</h2>
          {focus.map((mid) => {
            const m = MISCONCEPTION_BY_ID.get(mid)!;
            return (
              <article key={mid} className="rounded-2xl border border-line bg-card px-5 py-5">
                <p className="text-[15px] font-semibold text-moss">{m.topic}</p>
                <p className="mt-2">Xato ishonch: <span className="font-semibold text-xato" dangerouslySetInnerHTML={{ __html: renderMath(m.wrongBelief) }} /></p>
                <p className="mt-1">To‘g‘ri g‘oya: <span dangerouslySetInnerHTML={{ __html: renderMath(m.correctIdea) }} /></p>
                <StepReveal steps={m.counterexample.map(renderMath)} />
              </article>
            );
          })}
        </section>
      ) : (
        <p className="rounded-2xl bg-sage px-5 py-5">Bu testda xato ishonch topilmadi. Zo‘r natija!</p>
      )}

      {!st.post && st.teach.length > 0 && (
        <section id="ustoz" className="scroll-mt-6 rounded-2xl bg-sage px-5 py-6">
          <h2 className="font-serif text-[24px] font-bold">Sen ustozsan</h2>
          <p className="mt-1 text-muted">Sinfdoshing Bobur ham xuddi shunday o‘ylaydi. Uni ishontirib ko‘r.</p>
          <ul className="mt-4 space-y-2">
            {st.teach.map((mid) => {
              const b = st.boburs[mid];
              return (
                <li key={mid}>
                  <Link href={`/bobur/${mid}`} className="flex min-h-14 items-center justify-between gap-3 rounded-xl bg-card px-4">
                    <span>{MISCONCEPTION_BY_ID.get(mid)!.topic}</span>
                    <span className={`text-[15px] font-semibold ${b?.resolved ? 'text-fixed' : b?.done ? 'text-muted' : 'text-moss'}`}>
                      {b?.resolved ? 'Bobur tushundi' : b?.done ? 'Ko‘rib chiqildi' : 'Boshlash →'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {st.post && (
        <section id="natijalar" className="scroll-mt-6 rounded-2xl border border-line bg-card px-5 py-6">
          <h2 className="font-serif text-[24px] font-bold">Oldin va keyin</h2>
          <ul className="mt-3 divide-y divide-line">
            {changes.map((c) => (
              <li key={c.misconceptionId} className="flex min-h-12 items-center justify-between gap-3 py-2">
                <span>{MISCONCEPTION_BY_ID.get(c.misconceptionId)!.topic}</span>
                <span className={`text-[15px] font-semibold ${CHANGE[c.status].tone}`}>{CHANGE[c.status].label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {st.next.href !== '/natija' && (
        <Link href={st.next.href} className="inline-flex min-h-12 items-center rounded-full bg-forest px-7 font-semibold text-white">
          {st.next.label} <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      )}
    </div>
  );
}
