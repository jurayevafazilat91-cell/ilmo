'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-line bg-card px-5 py-6">
      <h1 className="font-serif text-[26px] font-bold">Sahifa ochilmadi</h1>
      <p className="mt-2 text-muted">Server yoki ma’lumotlar bazasi hozir javob bermayapti. Bir daqiqadan keyin qayta urinib ko‘ring.</p>
      <button type="button" onClick={reset} className="mt-4 min-h-12 rounded-full bg-forest px-7 font-semibold text-white">Qayta urinish</button>
    </div>
  );
}
