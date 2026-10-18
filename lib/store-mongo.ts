import { AttemptModel, BoburModel, ClassModel, StudentModel } from '@/models';
import { connectDb } from './db';
import type { Attempt, BoburSession, Klass, Repo, Student } from './store';

type WithId<T> = Omit<T, 'id'> & { _id: string };
const toApp = <T>(d: WithId<T> | null): T | null => {
  if (!d) return null;
  const { _id, ...rest } = d;
  return { ...rest, id: _id } as T;
};
const toDb = <T extends { id: string }>({ id, ...rest }: T) => ({ _id: id, ...rest });
const isDuplicate = (e: unknown) => (e as { code?: number })?.code === 11000;

export const mongoRepo: Repo = {
  async insertClass(k) {
    await connectDb();
    try {
      await ClassModel.create(toDb(k));
      return true;
    } catch (e) {
      if (isDuplicate(e)) return false;
      throw e;
    }
  },
  async findClass(q) {
    await connectDb();
    const filter = 'code' in q ? { code: q.code } : { _id: q.id };
    return toApp(await ClassModel.findOne(filter).lean<WithId<Klass>>());
  },
  async insertStudents(students) {
    await connectDb();
    try {
      await StudentModel.insertMany(students.map((s) => ({ ...toDb(s), nicknameLower: s.nickname.toLowerCase() })));
      return true;
    } catch (e) {
      if (isDuplicate(e)) return false;
      throw e;
    }
  },
  async findStudent(id) {
    await connectDb();
    return toApp(await StudentModel.findById(id).select('-nicknameLower').lean<WithId<Student>>());
  },
  async findStudents(classId) {
    await connectDb();
    const docs = await StudentModel.find({ classId }).select('-nicknameLower').sort({ createdAt: 1 }).lean<WithId<Student>[]>();
    return docs.map((d) => toApp(d)!);
  },
  async insertAttempts(attempts) {
    await connectDb();
    await AttemptModel.insertMany(attempts.map(toDb));
  },
  async findAttempts(q) {
    await connectDb();
    const docs = await AttemptModel.find(q).sort({ submittedAt: 1 }).lean<WithId<Attempt>[]>();
    return docs.map((d) => toApp(d)!);
  },
  async getBobur(key) {
    await connectDb();
    return BoburModel.findById(key).select('-_id').lean<BoburSession>();
  },
  async saveBobur(key, s) {
    await connectDb();
    await BoburModel.replaceOne({ _id: key }, { _id: key, ...s }, { upsert: true });
  },
};
