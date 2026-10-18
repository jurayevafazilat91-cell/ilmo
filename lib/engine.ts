// Deterministic grading and diagnosis. Pure functions: no AI, no I/O.
import { MISCONCEPTIONS, type GroupId } from '@/content/misconceptions';
import { QUESTION_BY_ID, QUESTIONS, type Question } from '@/content/questions';

export type Phase = 'pre' | 'post';
export type Answer = { questionId: string; optionId: string; ms: number };
export type GradedAnswer = Answer & { correct: boolean; misconceptionId: string | null };
export type Change = 'tuzatildi' | 'saqlanib_qoldi' | 'boshqa_xato' | 'togri' | 'yangi_xato';
export type ClientQuestion = { id: string; stem: string; topic: string; options: { id: string; text: string }[] };

export const formOf = (phase: Phase) => (phase === 'pre' ? 'A' : 'B');

export function questionFor(misconceptionId: string, phase: Phase): Question {
  const q = QUESTIONS.find((x) => x.misconceptionId === misconceptionId && x.form === formOf(phase));
  if (!q) throw new Error(`No ${phase} item for ${misconceptionId}`);
  return q;
}

export function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Picks n misconceptions, round-robin over topic groups so the test covers different topics.
export function pickMisconceptions(n: number, rand: () => number): string[] {
  const byGroup = new Map<GroupId, string[]>();
  for (const m of shuffle(MISCONCEPTIONS, rand)) {
    byGroup.set(m.group, [...(byGroup.get(m.group) ?? []), m.id]);
  }
  const queues = shuffle([...byGroup.values()], rand);
  const out: string[] = [];
  while (out.length < Math.min(n, MISCONCEPTIONS.length)) {
    for (const q of queues) if (q.length && out.length < n) out.push(q.shift()!);
  }
  return out;
}

// Strips correctness and misconception mapping before anything reaches the browser.
export function toClient(q: Question, rand: () => number): ClientQuestion {
  return {
    id: q.id, stem: q.stem, topic: q.topic,
    options: shuffle(q.options, rand).map(({ id, text }) => ({ id, text })),
  };
}

export function grade(answers: Answer[], allowedIds: string[]): GradedAnswer[] {
  const allowed = new Set(allowedIds);
  if (answers.length !== allowed.size) throw new Error('answer count mismatch');
  const seen = new Set<string>();
  return answers.map((a) => {
    const q = QUESTION_BY_ID.get(a.questionId);
    if (!q || !allowed.has(a.questionId) || seen.has(a.questionId)) throw new Error('invalid question');
    seen.add(a.questionId);
    const opt = q.options.find((o) => o.id === a.optionId);
    if (!opt) throw new Error('invalid option');
    return { ...a, correct: !!opt.correct, misconceptionId: opt.correct ? null : opt.maps };
  });
}

export const score = (g: GradedAnswer[]) => g.filter((a) => a.correct).length;

export function activeMisconceptions(g: GradedAnswer[]): string[] {
  return [...new Set(g.flatMap((a) => (a.misconceptionId ? [a.misconceptionId] : [])))];
}

const itemMisconception = (a: GradedAnswer) => QUESTION_BY_ID.get(a.questionId)!.misconceptionId;

// Per misconception tested in both phases: what changed between pre and post.
export function compare(pre: GradedAnswer[], post: GradedAnswer[]): { misconceptionId: string; status: Change }[] {
  const preActive = new Set(activeMisconceptions(pre));
  return post.map((a) => {
    const mid = itemMisconception(a);
    const was = preActive.has(mid);
    let status: Change;
    if (a.correct) status = was ? 'tuzatildi' : 'togri';
    else if (a.misconceptionId === mid) status = was ? 'saqlanib_qoldi' : 'yangi_xato';
    else status = 'boshqa_xato';
    return { misconceptionId: mid, status };
  });
}

// Small seeded PRNG (mulberry32) so demo data and option order are reproducible.
export function seeded(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const hashSeed = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);
