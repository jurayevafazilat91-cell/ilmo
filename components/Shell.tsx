'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const ICONS: Record<string, ReactNode> = {
  home: <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  radar: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><path d="M12 12l6-6" /></>,
  map: <><path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" /><path d="M9 4v13.5M15 6.5V20" /></>,
  teach: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  bars: <path d="M5 20V12M10 20V6M15 20v-9M20 20V4" />,
  class: <><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M2.5 20c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5M10.5 20c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" /></>,
};

export function Icon({ name, className = 'size-6' }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

const NAV = [
  { href: '/', label: 'Bosh sahifa', icon: 'home' },
  { href: '/test/oldingi', label: 'Bilim radari', icon: 'radar' },
  { href: '/natija', label: 'Bilim xaritasi', icon: 'map' },
  { href: '/natija#ustoz', label: 'Sen ustozsan', icon: 'teach' },
  { href: '/natija#natijalar', label: 'Natijalar', icon: 'bars' },
];

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 font-serif text-[28px] font-bold tracking-wide ${light ? 'text-gold-soft' : 'text-forest'}`}>
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <path d="M16 9c-3-2.5-7-3-12-2.5v17c5-.5 9 0 12 2.5 3-2.5 7-3 12-2.5v-17C23 6 19 6.5 16 9z" fill="#c9a24a" />
        <path d="M16 9v17" stroke={light ? '#143d2c' : '#faf6ec'} strokeWidth="1.6" />
      </svg>
      ILMO
    </Link>
  );
}

// Line-art skyline (dome, arches, minaret) for the sidebar foot, as in the design.
function Skyline() {
  return (
    <svg viewBox="0 0 220 170" className="w-full text-gold opacity-40" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M10 170V60h14v110M12 60l5-14 5 14M17 46v-8" />
      <path d="M40 170v-70h90v70M40 100h90M55 170v-40a10 10 0 0 1 20 0v40M95 170v-40a10 10 0 0 1 20 0v40" />
      <path d="M60 100a25 25 0 0 1 50 0M85 75v-10M82 65h6" />
      <path d="M150 170v-55h50v55M160 170v-30a15 15 0 0 1 30 0v30M150 115h50" />
      <path d="M0 170h220" />
      <path d="M200 170c4-20 12-30 18-34M206 170c2-12 6-18 10-20" />
    </svg>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const active = (href: string) => (href === '/' ? path === '/' : path.startsWith(href.split('#')[0]) && !href.includes('#'));
  const teacher = path.startsWith('/oqituvchi');

  return (
    <div className="md:grid md:min-h-dvh md:grid-cols-[248px_1fr]">
      <aside className="hidden flex-col bg-forest px-4 pt-7 md:flex">
        <div className="px-3"><Logo light /></div>
        <nav aria-label="Asosiy" className="mt-10 flex flex-col gap-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={active(n.href) ? 'page' : undefined}
              className={`flex min-h-12 items-center gap-3.5 rounded-xl px-3.5 text-[16px] font-medium transition-colors ${active(n.href) ? 'bg-moss text-white ring-1 ring-white/10' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}>
              <Icon name={n.icon} />{n.label}
            </Link>
          ))}
        </nav>
        <div className="mx-3 my-6 h-px w-8 bg-gold/70" />
        <div className="mt-auto -mx-4"><Skyline /></div>
      </aside>

      <div className="min-w-0 pb-24 md:pb-10">
        <header className="flex items-center justify-between gap-3 px-4 pt-4 md:px-8 md:pt-6">
          <div className="md:hidden"><Logo /></div>
          <nav aria-label="Rol" className="flex rounded-full border border-line bg-card p-1 text-[15px]">
            <Link href="/" aria-current={!teacher ? 'page' : undefined}
              className={`flex min-h-10 items-center gap-2 rounded-full px-3 sm:px-4 ${!teacher ? 'bg-forest text-white' : 'text-ink/80 hover:text-ink'}`}>
              <Icon name="teach" className="hidden size-5 sm:block" />O‘quvchi
            </Link>
            <Link href="/oqituvchi" aria-current={teacher ? 'page' : undefined}
              className={`flex min-h-10 items-center gap-2 rounded-full px-3 sm:px-4 ${teacher ? 'bg-forest text-white' : 'text-ink/80 hover:text-ink'}`}>
              <Icon name="class" className="hidden size-5 sm:block" />O‘qituvchi
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-[1180px] px-4 pt-5 md:px-8">{children}</main>
      </div>

      <nav aria-label="Asosiy" className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-white/10 bg-forest md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} aria-current={active(n.href) ? 'page' : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] leading-tight ${active(n.href) ? 'text-gold-soft' : 'text-white/75'}`}>
            <Icon name={n.icon} className="size-5" />{n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
