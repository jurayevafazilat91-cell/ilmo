// Decorative SVG art for the ILMO look. All aria-hidden.

export function Molecule({ className = '' }: { className?: string }) {
  const balls: [number, number, number, 'g' | 'w'][] = [
    [70, 60, 22, 'g'], [140, 40, 16, 'w'], [120, 110, 18, 'w'], [60, 140, 26, 'g'], [190, 150, 30, 'g'], [215, 75, 14, 'g'], [30, 95, 10, 'w'],
  ];
  const links = [[0, 1], [0, 2], [2, 3], [2, 4], [1, 5], [4, 5], [0, 6], [3, 6]];
  return (
    <svg viewBox="0 0 330 200" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="mg" cx="35%" cy="30%"><stop offset="0" stopColor="#3f7a5f" /><stop offset="1" stopColor="#0f3324" /></radialGradient>
        <radialGradient id="mw" cx="35%" cy="30%"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d9d2bf" /></radialGradient>
        <radialGradient id="mb" cx="35%" cy="30%"><stop offset="0" stopColor="#fbf8f0" /><stop offset="1" stopColor="#cfc6ae" /></radialGradient>
      </defs>
      <ellipse cx="200" cy="105" rx="125" ry="70" fill="none" stroke="#c9a24a" strokeOpacity=".45" />
      {links.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={balls[a][0]} y1={balls[a][1]} x2={balls[b][0]} y2={balls[b][1]} stroke="#c9a24a" strokeWidth="3" />
      ))}
      <circle cx="265" cy="95" r="58" fill="url(#mb)" />
      <path d="M228 80c15-8 30 6 48-2s22 10 34 4M222 104c18-6 28 8 50 0s26 8 38 2M232 128c14-4 26 6 42 0" stroke="#bdb39a" strokeWidth="1.2" fill="none" />
      {balls.map(([x, y, r, c], i) => <circle key={i} cx={x} cy={y} r={r} fill={c === 'g' ? 'url(#mg)' : 'url(#mw)'} />)}
      {[[300, 170], [250, 20], [100, 185], [20, 40]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="4" fill="#c9a24a" />)}
    </svg>
  );
}

// Bobur: a friendly classmate in a do‘ppi. Simple shapes only.
export function Bobur({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <ellipse cx="60" cy="112" rx="34" ry="5" fill="#143d2c" opacity=".12" />
      <path d="M28 112c2-22 14-34 32-34s30 12 32 34z" fill="#1c4a36" />
      <circle cx="60" cy="52" r="28" fill="#f7efe0" stroke="#e2d6bd" />
      <path d="M33 40c2-14 14-22 27-22s25 8 27 22z" fill="#143d2c" />
      <path d="M38 34l5 4 5-4 5 4 5-4 5 4 5-4 5 4 5-4 5 4" stroke="#faf6ec" strokeWidth="2" fill="none" />
      <circle cx="50" cy="54" r="3" fill="#14231b" /><circle cx="70" cy="54" r="3" fill="#14231b" />
      <path d="M51 65c5 5 13 5 18 0" stroke="#14231b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="44" cy="62" r="3.5" fill="#e8a88f" opacity=".6" /><circle cx="76" cy="62" r="3.5" fill="#e8a88f" opacity=".6" />
    </svg>
  );
}
