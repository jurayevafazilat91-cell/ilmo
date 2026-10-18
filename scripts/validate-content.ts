// Machine-checks every question's answer key. Run: npm run validate (exit 1 on any error).
import { evaluate } from 'mathjs';
import { MISCONCEPTIONS, MISCONCEPTION_BY_ID } from '../content/misconceptions';
import { QUESTIONS } from '../content/questions';

const SCOPES = [
  { x: 1.7, y: 2.3, a: 1.3, b: -0.7 },
  { x: -2.1, y: 0.6, a: 3.1, b: 2.2 },
];

// Turns option text like "Ertalab ($-8$°C)" or "$x = 7$" or "$\frac{5}{6}$" into a mathjs expression.
export function toMath(text: string): string | null {
  const m = text.match(/\$([^$]+)\$/);
  if (!m) return null;
  let s = m[1];
  if (s.includes('=')) s = s.slice(s.lastIndexOf('=') + 1);
  s = s
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
    .replace(/\\cdot/g, '*')
    .replace(/\s+/g, '')
    .replace(/([a-z])(?=[a-z])/g, '$1*');
  return s;
}

const values = (expr: string) => SCOPES.map((scope) => Number(evaluate(expr, { ...scope })));
const same = (a: number[], b: number[]) => a.every((v, i) => Math.abs(v - b[i]) < 1e-9);

const errors: string[] = [];
const err = (id: string, msg: string) => errors.push(`${id}: ${msg}`);

for (const q of QUESTIONS) {
  const correct = q.options.filter((o) => o.correct);
  if (correct.length !== 1) err(q.id, `${correct.length} correct options (need exactly 1)`);
  if (new Set(q.options.map((o) => o.id)).size !== q.options.length) err(q.id, 'duplicate option ids');
  if (new Set(q.options.map((o) => o.text)).size !== q.options.length) err(q.id, 'duplicate option texts');
  if (!MISCONCEPTION_BY_ID.has(q.misconceptionId)) err(q.id, `unknown misconception ${q.misconceptionId}`);
  for (const o of q.options) {
    if (o.maps && !MISCONCEPTION_BY_ID.has(o.maps)) err(q.id, `option ${o.id} maps to unknown ${o.maps}`);
    if (o.correct && o.maps) err(q.id, 'correct option must not map to a misconception');
  }
  if (!q.options.some((o) => !o.correct && o.maps === null)) err(q.id, 'needs at least one maps:null distractor');

  try {
    const want = values(q.check.expr);
    const wrong = values(q.check.wrong);
    if (same(want, wrong)) err(q.id, 'wrong rule gives the correct answer');
    for (const o of q.options) {
      const m = toMath(o.text);
      if (m === null) {
        if (o.correct || o.maps) err(q.id, `option ${o.id} "${o.text}" is not machine-checkable`);
        continue;
      }
      const got = values(m);
      if (o.correct && !same(got, want)) err(q.id, `correct option "${o.text}" != ${q.check.expr}`);
      if (!o.correct && same(got, want)) err(q.id, `distractor "${o.text}" equals the correct answer`);
      if (o.maps && !same(got, wrong)) err(q.id, `mapped option "${o.text}" != wrong rule ${q.check.wrong}`);
    }
  } catch (e) {
    err(q.id, `math check failed: ${(e as Error).message}`);
  }
}

for (const m of MISCONCEPTIONS) {
  for (const form of ['A', 'B'] as const) {
    if (!QUESTIONS.some((q) => q.misconceptionId === m.id && q.form === form)) err(m.id, `missing form ${form} item`);
  }
  if (m.cards.length !== 3 || m.cards.filter((c) => c.correct).length !== 1) err(m.id, 'needs 3 cards with exactly 1 correct');
  if (!m.boburLine || m.rubric.length === 0 || m.counterexample.length === 0) err(m.id, 'missing Bobur line, rubric or counterexample');
}

console.log(`Misconceptions: ${MISCONCEPTIONS.length}, questions: ${QUESTIONS.length}`);
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('All content checks passed.');
