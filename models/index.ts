import { Schema, model, models, type Model } from 'mongoose';

// _id is our own UUID string, so app code keeps using plain string ids.
const opts = { versionKey: false as const };

const ClassSchema = new Schema({
  _id: String,
  code: { type: String, required: true, unique: true },
  name: String,
  teacherKeyHash: String,
  testLength: Number,
  isDemo: Boolean,
  createdAt: Date,
}, opts);

const StudentSchema = new Schema({
  _id: String,
  classId: { type: String, required: true },
  nickname: String,
  nicknameLower: String,
  studentCodeHash: String,
  misconceptionIds: [String],
  createdAt: Date,
}, opts);
StudentSchema.index({ classId: 1, nicknameLower: 1 }, { unique: true });

const AttemptSchema = new Schema({
  _id: String,
  studentId: String,
  classId: String,
  phase: { type: String, enum: ['pre', 'post'] },
  answers: [{ _id: false, questionId: String, optionId: String, ms: Number, correct: Boolean, misconceptionId: { type: String, default: null } }],
  score: Number,
  submittedAt: Date,
}, opts);
AttemptSchema.index({ classId: 1, phase: 1 });
AttemptSchema.index({ studentId: 1, phase: 1 });

const BoburSchema = new Schema({
  _id: String, // `${studentId}:${misconceptionId}`
  studentId: String,
  misconceptionId: String,
  mode: String,
  turns: [{ _id: false, role: String, text: String, at: Date }],
  wrongPicks: Number,
  resolved: Boolean,
  done: Boolean,
}, opts);

// Loosely typed on purpose: lib/store-mongo.ts reads through .lean<T>() with the app's own types.
const get = (name: string, schema: Schema) => (models[name] ?? model(name, schema)) as Model<Record<string, unknown>>;

export const ClassModel = get('Class', ClassSchema);
export const StudentModel = get('Student', StudentSchema);
export const AttemptModel = get('Attempt', AttemptSchema);
export const BoburModel = get('BoburSession', BoburSchema);
