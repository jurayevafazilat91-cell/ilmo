import { JoinForm } from '@/components/JoinForm';

export default function Kirish() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-serif text-[32px] font-bold">Sinfga kirish</h1>
        <p className="mt-1 text-muted">O‘qituvchingiz bergan 6 belgili kodni va o‘zingizga taxallus kiriting.</p>
      </div>
      <JoinForm />
      <section className="rounded-2xl bg-sage px-5 py-5 text-[15px]">
        <h2 className="font-semibold">Maxfiylik</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Saqlanadi: taxallusingiz va test javoblaringiz.</li>
          <li>Saqlanmaydi: ismingiz, telefoningiz, maktabingiz. Ularni hech qayerga yozmang.</li>
          <li>Taxallusingiz sun’iy intellektga hech qachon yuborilmaydi.</li>
        </ul>
      </section>
    </div>
  );
}
