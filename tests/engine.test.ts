import { describe, expect, it } from 'vitest';
import { MISCONCEPTION_BY_ID } from '@/content/misconceptions';
import { QUESTION_BY_ID } from '@/content/questions';
import { boburTurn, MAX_TURNS } from '@/lib/bobur';
import { activeMisconceptions, compare, grade, pickMisconceptions, questionFor, seeded, toClient } from '@/lib/engine';

const opt = (qid: string, kind: 'correct' | 'mapped' | 'random') => {
  const q = QUESTION_BY_ID.get(qid)!;
  const o = q.options.find((x) => (kind === 'correct' ? x.correct : kind === 'mapped' ? x.maps : !x.correct && !x.maps))!;
  return { questionId: qid, optionId: o.id, ms: 1000 };
};

describe('grade', () => {
  it('marks correct, mapped and random answers', () => {
    const ids = ['q-M01-A', 'q-M02-A', 'q-M03-A'];
    const g = grade([opt(ids[0], 'correct'), opt(ids[1], 'mapped'), opt(ids[2], 'random')], ids);
    expect(g.map((a) => [a.correct, a.misconceptionId])).toEqual([[true, null], [false, 'M02'], [false, null]]);
    expect(activeMisconceptions(g)).toEqual(['M02']);
  });

  it('rejects questions outside the attempt, duplicates and wrong counts', () => {
    expect(() => grade([opt('q-M04-A', 'correct')], ['q-M01-A'])).toThrow();
    expect(() => grade([opt('q-M01-A', 'correct'), opt('q-M01-A', 'correct')], ['q-M01-A', 'q-M02-A'])).toThrow();
    expect(() => grade([], ['q-M01-A'])).toThrow();
  });
});

describe('compare (every status transition)', () => {
  const pre = grade(
    [opt('q-M01-A', 'mapped'), opt('q-M02-A', 'mapped'), opt('q-M03-A', 'mapped'), opt('q-M04-A', 'correct'), opt('q-M05-A', 'correct')],
    ['q-M01-A', 'q-M02-A', 'q-M03-A', 'q-M04-A', 'q-M05-A'],
  );
  const post = grade(
    [opt('q-M01-B', 'correct'), opt('q-M02-B', 'mapped'), opt('q-M03-B', 'random'), opt('q-M04-B', 'correct'), opt('q-M05-B', 'mapped')],
    ['q-M01-B', 'q-M02-B', 'q-M03-B', 'q-M04-B', 'q-M05-B'],
  );
  it('maps pre/post pairs to statuses', () => {
    expect(Object.fromEntries(compare(pre, post).map((c) => [c.misconceptionId, c.status]))).toEqual({
      M01: 'tuzatildi', M02: 'saqlanib_qoldi', M03: 'boshqa_xato', M04: 'togri', M05: 'yangi_xato',
    });
  });
});

describe('client payload', () => {
  it('never contains correctness or mapping fields', () => {
    const json = JSON.stringify(toClient(questionFor('M01', 'pre'), seeded(1)));
    expect(json).not.toMatch(/correct|maps/);
  });
});

describe('pickMisconceptions', () => {
  it('returns n distinct ids spread across groups', () => {
    const ids = pickMisconceptions(8, seeded(3));
    expect(new Set(ids).size).toBe(8);
    const groups = new Set(ids.map((id) => MISCONCEPTION_BY_ID.get(id)!.group));
    expect(groups.size).toBe(5);
    expect(pickMisconceptions(16, seeded(4))).toHaveLength(16);
  });
});

describe('scripted Bobur', () => {
  const m = MISCONCEPTION_BY_ID.get('M01')!;
  const wrong = m.cards.filter((c) => !c.correct);
  const right = m.cards.find((c) => c.correct)!;

  it('resolves on the correct card', () => {
    const s = boburTurn(m, null, 's1', right.id)!;
    expect(s.resolved && s.done).toBe(true);
  });

  it('stays unresolved on wrong cards and never traps the student', () => {
    let s = boburTurn(m, null, 's1', wrong[0].id)!;
    expect(s.done).toBe(false);
    s = boburTurn(m, s, 's1', wrong[1].id)!;
    s = boburTurn(m, s, 's1', wrong[0].id)!;
    expect(s.turns.filter((t) => t.role === 'student')).toHaveLength(MAX_TURNS);
    expect(s.done && !s.resolved).toBe(true);
  });

  it('rejects unknown cards', () => {
    expect(boburTurn(m, null, 's1', 'zz')).toBeNull();
  });
});
