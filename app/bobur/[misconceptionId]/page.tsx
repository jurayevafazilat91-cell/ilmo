import { notFound, redirect } from 'next/navigation';
import { MISCONCEPTION_BY_ID } from '@/content/misconceptions';
import { Bobur } from '@/components/Art';
import { BoburChat } from '@/components/BoburChat';
import { boburView, startBobur, triedCards } from '@/lib/bobur';
import { shuffle, seeded, hashSeed } from '@/lib/engine';
import { renderMath } from '@/lib/math';
import { currentStudent } from '@/lib/progress';
import { getBobur } from '@/lib/store';

export default async function BoburPage({ params }: PageProps<'/bobur/[misconceptionId]'>) {
  const m = MISCONCEPTION_BY_ID.get((await params).misconceptionId);
  if (!m) notFound();
  const st = await currentStudent();
  if (!st) redirect('/kirish');

  const session = (await getBobur(st.student.id, m.id)) ?? startBobur(m, st.student.id);
  const cards = shuffle(m.cards, seeded(hashSeed(st.student.id + m.id))).map((c) => ({ id: c.id, html: renderMath(c.text) }));
  const teaching = { idea: renderMath(m.correctIdea), card: renderMath(m.cards.find((c) => c.correct)!.text) };
  const others = st.pendingTeach.filter((id) => id !== m.id);
  const next = others.length ? { href: `/bobur/${others[0]}`, label: 'Keyingi suhbat' } : st.post ? { href: '/natija', label: 'Natijani ko‘rish' } : { href: '/test/keyingi', label: 'Keyingi testni boshlash' };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-4">
        <Bobur className="size-20 shrink-0" />
        <div>
          <h1 className="font-serif text-[28px] leading-tight font-bold">Sen ustozsan</h1>
          <p className="text-muted">Bobur — {m.topic.toLowerCase()} mavzusida adashgan sinfdoshing. Eng yaxshi tushuntirishni tanla.</p>
        </div>
      </div>
      <BoburChat misconceptionId={m.id} initial={{ ...boburView(session), tried: triedCards(m, session) }} cards={cards} teaching={teaching} next={next} />
    </div>
  );
}
