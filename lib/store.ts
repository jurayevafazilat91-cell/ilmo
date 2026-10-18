// Data access. Uses MongoDB when MONGODB_URI is set, otherwise an in-memory store.
// shortcut: memory mode lives in one Node process and resets on restart; fine for local demos, set MONGODB_URI for Vercel.
import { randomUUID } from 'node:crypto';
import { hashSecret, randomCode } from './auth';
import { activeMisconceptions, grade, pickMisconceptions, questionFor, score, seeded, type GradedAnswer, type Phase } from './engine';
import { mongoRepo } from './store-mongo';

export type Klass = { id: string; code: string; name: string; teacherKeyHash: string; testLength: 8 | 16; isDemo: boolean; createdAt: Date };
export type Student = { id: string; classId: string; nickname: string; studentCodeHash: string; misconceptionIds: string[]; createdAt: Date };
export type Attempt = { id: string; studentId: string; classId: string; phase: Phase; answers: GradedAnswer[]; score: number; submittedAt: Date };
export type BoburSession = { studentId: string; misconceptionId: string; mode: 'cards'; turns: { role: 'bobur' | 'student'; text: string; at: Date }[]; wrongPicks: number; resolved: boolean; done: boolean };

export type Repo = {
  insertClass(k: Klass): Promise<boolean>; // false if the code is taken
  findClass(q: { code: string } | { id: string }): Promise<Klass | null>;
  insertStudents(s: Student[]): Promise<boolean>; // false if a nickname is taken in the class
  findStudent(id: string): Promise<Student | null>;
  findStudents(classId: string): Promise<Student[]>;
  insertAttempts(a: Attempt[]): Promise<void>;
  findAttempts(q: { studentId?: string; classId?: string; phase?: Phase }): Promise<Attempt[]>; // oldest first
  getBobur(key: string): Promise<BoburSession | null>;
  saveBobur(key: string, s: BoburSession): Promise<void>;
};

type Mem = { classes: Klass[]; students: Student[]; attempts: Attempt[]; bobur: Map<string, BoburSession> };
const g = globalThis as unknown as { __ilmo?: Mem };
const mem: Mem = (g.__ilmo ??= { classes: [], students: [], attempts: [], bobur: new Map() });

const memoryRepo: Repo = {
  async insertClass(k) {
    if (mem.classes.some((c) => c.code === k.code)) return false;
    mem.classes.push(k);
    return true;
  },
  async findClass(q) {
    return mem.classes.find((c) => ('code' in q ? c.code === q.code : c.id === q.id)) ?? null;
  },
  async insertStudents(students) {
    const taken = (s: Student) => mem.students.some((x) => x.classId === s.classId && x.nickname.toLowerCase() === s.nickname.toLowerCase());
    if (students.some(taken)) return false;
    mem.students.push(...students);
    return true;
  },
  async findStudent(id) {
    return mem.students.find((s) => s.id === id) ?? null;
  },
  async findStudents(classId) {
    return mem.students.filter((s) => s.classId === classId);
  },
  async insertAttempts(a) {
    mem.attempts.push(...a);
  },
  async findAttempts(q) {
    return mem.attempts.filter((a) => (!q.studentId || a.studentId === q.studentId) && (!q.classId || a.classId === q.classId) && (!q.phase || a.phase === q.phase));
  },
  async getBobur(key) {
    return mem.bobur.get(key) ?? null;
  },
  async saveBobur(key, s) {
    mem.bobur.set(key, s);
  },
};

const repo: Repo = process.env.MONGODB_URI ? mongoRepo : memoryRepo;
export const dbMode = process.env.MONGODB_URI ? 'mongodb' : 'memory';

export const DEMO_CODE = 'NAMUNA';
export const DEMO_TEACHER_KEY = 'NAMUNA-USTOZ';

const newClass = (name: string, testLength: 8 | 16, isDemo: boolean, code: string, key: string): Klass =>
  ({ id: randomUUID(), code, name, teacherKeyHash: hashSecret(key), testLength, isDemo, createdAt: new Date() });

export async function createClass(name: string, testLength: 8 | 16 = 8) {
  const key = randomCode(10);
  for (;;) {
    const klass = newClass(name, testLength, false, randomCode(), key);
    if (await repo.insertClass(klass)) return { klass, key };
  }
}

export async function classByCode(code: string) {
  const upper = code.toUpperCase();
  if (upper === DEMO_CODE) await ensureDemo();
  return repo.findClass({ code: upper });
}
export const classById = (id: string) => repo.findClass({ id });
export const studentById = (id: string) => repo.findStudent(id);
export const classStudents = (classId: string) => repo.findStudents(classId);

const newStudent = (klass: Klass, nickname: string, codeHash: string, ids: string[]): Student =>
  ({ id: randomUUID(), classId: klass.id, nickname, studentCodeHash: codeHash, misconceptionIds: ids, createdAt: new Date() });

export async function createStudent(klass: Klass, nickname: string) {
  const code = randomCode();
  const student = newStudent(klass, nickname, hashSecret(code), pickMisconceptions(klass.testLength, Math.random));
  return (await repo.insertStudents([student])) ? { student, code } : null;
}

const newAttempt = (student: Student, phase: Phase, answers: GradedAnswer[]): Attempt =>
  ({ id: randomUUID(), studentId: student.id, classId: student.classId, phase, answers, score: score(answers), submittedAt: new Date() });

export async function saveAttempt(student: Student, phase: Phase, answers: GradedAnswer[]) {
  const a = newAttempt(student, phase, answers);
  await repo.insertAttempts([a]);
  return a;
}

export const attemptOf = async (studentId: string, phase: Phase) => (await repo.findAttempts({ studentId, phase })).at(-1);

const boburKey = (studentId: string, mid: string) => `${studentId}:${mid}`;
export const getBobur = (studentId: string, mid: string) => repo.getBobur(boburKey(studentId, mid));
export const saveBobur = (s: BoburSession) => repo.saveBobur(boburKey(s.studentId, s.misconceptionId), s);

// Synthetic demo class: 20 fake students so the teacher dashboard is alive. Always labeled as demo in the UI.
export async function ensureDemo() {
  if (await repo.findClass({ code: DEMO_CODE })) return;
  const klass = newClass('Namuna sinf (demo)', 8, true, DEMO_CODE, DEMO_TEACHER_KEY);
  if (!(await repo.insertClass(klass))) return; // another instance is seeding it
  const rand = seeded(42);
  const codeHash = hashSecret(randomCode()); // demo students never rejoin; one hash keeps seeding fast
  const students: Student[] = [];
  const attempts: Attempt[] = [];
  for (let i = 1; i <= 20; i++) {
    const s = newStudent(klass, `Demo-${String(i).padStart(2, '0')}`, codeHash, pickMisconceptions(8, rand));
    students.push(s);
    const skill = 0.3 + rand() * 0.5;
    for (const phase of ['pre', 'post'] as const) {
      if (phase === 'post' && i > 16) break; // a few students have not finished yet
      const p = phase === 'pre' ? skill : Math.min(0.95, skill + 0.25);
      const answers = s.misconceptionIds.map((mid) => {
        const q = questionFor(mid, phase);
        const r = rand();
        const opt = r < p ? q.options.find((o) => o.correct)! : r < p + (1 - p) * 0.7 ? q.options.find((o) => o.maps)! : q.options.find((o) => !o.correct && !o.maps)!;
        return { questionId: q.id, optionId: opt.id, ms: 8000 + Math.floor(rand() * 20000) };
      });
      attempts.push(newAttempt(s, phase, grade(answers, answers.map((a) => a.questionId))));
    }
  }
  await repo.insertStudents(students);
  await repo.insertAttempts(attempts);
}

// Class misconception map from each student's latest attempt.
export async function classOverview(classId: string) {
  const [students, attempts] = await Promise.all([repo.findStudents(classId), repo.findAttempts({ classId })]);
  const holders = new Map<string, string[]>();
  let n = 0;
  for (const s of students) {
    const mine = attempts.filter((a) => a.studentId === s.id);
    const latest = mine.filter((a) => a.phase === 'post').at(-1) ?? mine.filter((a) => a.phase === 'pre').at(-1);
    if (!latest) continue;
    n++;
    for (const mid of activeMisconceptions(latest.answers)) holders.set(mid, [...(holders.get(mid) ?? []), s.nickname]);
  }
  return { n, total: students.length, holders };
}
