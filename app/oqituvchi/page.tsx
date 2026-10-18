import { MISCONCEPTIONS } from '@/content/misconceptions';
import { DemoBanner } from '@/components/DemoBanner';
import { TeacherForms } from '@/components/TeacherForms';
import { teacherSession } from '@/lib/auth';
import { renderMath } from '@/lib/math';
import { classById, classOverview } from '@/lib/store';

export default async function Oqituvchi() {
  const session = await teacherSession();
  const klass = session && (await classById(session.classId));
  if (!klass) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="font-serif text-[32px] font-bold">O‘qituvchi paneli</h1>
        <p className="mt-1 text-muted">Sinf yarating yoki sinf kodi va kalit bilan kiring.</p>
        <TeacherForms />
      </div>
    );
  }

  const { n, total, holders } = await classOverview(klass.id);
  const rows = MISCONCEPTIONS.map((m) => ({ m, names: holders.get(m.id) ?? [] })).sort((a, b) => b.names.length - a.names.length);
  const max = Math.max(1, ...rows.map((r) => r.names.length));

  return (
    <div className="space-y-5">
      {klass.isDemo && <DemoBanner />}
      <div>
        <h1 className="font-serif text-[32px] font-bold">{klass.name}</h1>
        <p className="mt-1 text-muted">
          Sinf kodi: <b className="font-mono tracking-widest text-forest">{klass.code}</b> · O‘quvchilar: {total} · Test topshirganlar: n = {n}
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-card px-5 py-6 md:px-7">
        <h2 className="font-serif text-[24px] font-bold">Sinfning xato ishonchlar xaritasi</h2>
        <p className="mt-1 text-[15px] text-muted">
          Har bir o‘quvchining oxirgi testi bo‘yicha. Ustun — shu xato ishonchni hozir ushlab turgan o‘quvchilar soni (n = {n} dan).
          {n > 0 && n < 10 && ' Namuna kichik, bu dastlabki ko‘rsatkich.'}
        </p>
        {n === 0 ? (
          <p className="mt-4">Hali hech kim test topshirmagan. O‘quvchilarga sinf kodini bering.</p>
        ) : (
          <ul className="mt-5 space-y-2">
            {rows.map(({ m, names }) => (
              <li key={m.id}>
                <details className="group rounded-xl px-2 py-1 open:bg-paper">
                  <summary className="grid min-h-11 cursor-pointer list-none grid-cols-[minmax(0,8rem)_1fr_2rem] sm:grid-cols-[minmax(0,12rem)_1fr_3rem] items-center gap-3">
                    <span className="truncate text-[15px]">{m.topic}</span>
                    <span className="h-3 overflow-hidden rounded-full bg-sage">
                      <span className="block h-full rounded-full bg-xato" style={{ width: `${(names.length / max) * 100}%` }} />
                    </span>
                    <span className="text-right text-[15px] font-semibold">{names.length}</span>
                  </summary>
                  <div className="px-1 pb-2 text-[15px]">
                    <p className="text-muted">Xato ishonch: <span dangerouslySetInnerHTML={{ __html: renderMath(m.wrongBelief) }} /></p>
                    <p className="mt-1">{names.length ? names.join(', ') : 'Hech kim'}</p>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
