import { DemoStart, DemoTeacher } from '@/components/Actions';
import { DemoBanner } from '@/components/DemoBanner';

export default function Demo() {
  return (
    <div className="mx-auto max-w-xl space-y-5">
      <DemoBanner />
      <h1 className="font-serif text-[32px] font-bold">Namuna sinf</h1>
      <p className="text-muted">Bu sinfda 20 ta sun’iy o‘quvchi bor. Ular o‘qituvchi panelini ko‘rsatish uchun yaratilgan.</p>
      <div className="space-y-3 rounded-2xl border border-line bg-card px-5 py-6">
        <h2 className="font-semibold">O‘quvchi sifatida</h2>
        <DemoStart className="min-h-12 rounded-full bg-forest px-7 font-semibold text-white" label="Testni sinab ko‘rish" />
      </div>
      <div className="space-y-3 rounded-2xl border border-line bg-card px-5 py-6">
        <h2 className="font-semibold">O‘qituvchi sifatida</h2>
        <p className="text-[15px] text-muted">Sinf kodi: <b className="font-mono">NAMUNA</b> · kalit: <b className="font-mono">NAMUNA-USTOZ</b> (faqat demo uchun)</p>
        <DemoTeacher className="min-h-12 rounded-full border-2 border-forest px-6 font-semibold text-forest" />
      </div>
    </div>
  );
}
