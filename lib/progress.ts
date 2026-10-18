import { studentSession } from './auth';
import { activeMisconceptions } from './engine';
import { attemptOf, getBobur, studentById } from './store';

// Where the student is in the loop: pre-test → natija → Sen ustozsan (top 2) → post-test → natija.
export async function currentStudent() {
  const session = await studentSession();
  const student = session && (await studentById(session.studentId));
  if (!student) return null;
  const [pre, post] = await Promise.all([attemptOf(student.id, 'pre'), attemptOf(student.id, 'post')]);
  const preActive = pre ? activeMisconceptions(pre.answers) : [];
  const teach = preActive.slice(0, 2);
  const boburs = Object.fromEntries(await Promise.all(teach.map(async (mid) => [mid, await getBobur(student.id, mid)] as const)));
  const pendingTeach = teach.filter((mid) => !boburs[mid]?.done);
  const next = !pre
    ? { href: '/test/oldingi', label: 'Testni boshlash' }
    : post
      ? { href: '/natija', label: 'Natijani ko‘rish' }
      : pendingTeach.length
        ? { href: `/bobur/${pendingTeach[0]}`, label: 'Bobur bilan gaplashish' }
        : { href: '/test/keyingi', label: 'Keyingi testni boshlash' };
  const stepsDone = [!!pre, !!pre && pendingTeach.length === 0, !!post].filter(Boolean).length;
  return { student, pre, post, preActive, teach, boburs, pendingTeach, next, stepsDone };
}
