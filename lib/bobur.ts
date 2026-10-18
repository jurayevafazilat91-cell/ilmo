// Scripted "Sen ustozsan" flow: the student picks the best argument card; Bobur reacts. Pure function.
import type { Misconception } from '@/content/misconceptions';
import { renderMath } from './math';
import type { BoburSession } from './store';

export const MAX_TURNS = 3;

export function startBobur(m: Misconception, studentId: string): BoburSession {
  return { studentId, misconceptionId: m.id, mode: 'cards', turns: [{ role: 'bobur', text: m.boburLine, at: new Date() }], wrongPicks: 0, resolved: false, done: false };
}

export function boburTurn(m: Misconception, prev: BoburSession | null, studentId: string, cardId: string): BoburSession | null {
  const s = prev ?? startBobur(m, studentId);
  if (s.done) return s;
  const card = m.cards.find((c) => c.id === cardId);
  if (!card) return null;
  const turns = [...s.turns, { role: 'student' as const, text: card.text, at: new Date() }, { role: 'bobur' as const, text: card.boburReply, at: new Date() }];
  const wrongPicks = s.wrongPicks + (card.correct ? 0 : 1);
  const studentTurns = turns.filter((t) => t.role === 'student').length;
  // Never trap the student: after MAX_TURNS the page shows the teaching card and moves on.
  return { ...s, turns, wrongPicks, resolved: card.correct, done: card.correct || studentTurns >= MAX_TURNS };
}

// Card ids the student already picked (matched by text, since turns store the card text).
export const triedCards = (m: Misconception, s: BoburSession) =>
  m.cards.filter((c) => s.turns.some((t) => t.role === 'student' && t.text === c.text)).map((c) => c.id);

export const boburView = (s: BoburSession) => ({
  turns: s.turns.map((t) => ({ role: t.role, html: renderMath(t.text) })),
  resolved: s.resolved,
  done: s.done,
});
