import { notFound, redirect } from 'next/navigation';
import { TestRunner } from '@/components/TestRunner';
import { hashSeed, questionFor, seeded, shuffle, toClient, type Phase } from '@/lib/engine';
import { renderMath } from '@/lib/math';
import { currentStudent } from '@/lib/progress';

const PHASES: Record<string, Phase> = { oldingi: 'pre', keyingi: 'post' };

export default async function TestPage({ params }: PageProps<'/test/[phase]'>) {
  const phase = PHASES[(await params).phase];
  if (!phase) notFound();
  const st = await currentStudent();
  if (!st) redirect('/kirish');
  if (phase === 'post' && !st.pre) redirect('/test/oldingi');
  if ((phase === 'pre' && st.pre) || (phase === 'post' && st.post)) redirect('/natija');

  // Seeded per student+phase so a reload shows the same order. Correct flags never leave the server.
  const rand = seeded(hashSeed(st.student.id + phase));
  const questions = shuffle(st.student.misconceptionIds, rand).map((mid) => {
    const q = toClient(questionFor(mid, phase), rand);
    return { id: q.id, topic: q.topic, stemHtml: renderMath(q.stem), options: q.options.map((o) => ({ id: o.id, html: renderMath(o.text) })) };
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-[28px] font-bold">{phase === 'pre' ? 'Bilim radari: oldingi test' : 'Keyingi test'}</h1>
      <p className="mt-1 text-muted">Javoblar oxirida ko‘rsatiladi. Bilmasangiz, eng to‘g‘ri tuyulganini tanlang.</p>
      <TestRunner phase={phase} questions={questions} />
    </div>
  );
}
