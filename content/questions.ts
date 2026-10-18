import { MISCONCEPTION_BY_ID } from './misconceptions';

export type Option = { id: string; text: string; correct?: true; maps: string | null };

export type Question = {
  id: string;
  misconceptionId: string;
  form: 'A' | 'B';
  topic: string;
  stem: string;
  options: Option[];
  // mathjs expressions: `expr` must equal the correct option, `wrong` the mapped distractor.
  check: { expr: string; wrong: string };
};

function q(
  mid: string, form: 'A' | 'B', stem: string,
  correct: string, mapped: string, nulls: string[],
  expr: string, wrong: string,
): Question {
  const raw: Omit<Option, 'id'>[] = [
    { text: correct, correct: true, maps: null },
    { text: mapped, maps: mid },
    ...nulls.map((text) => ({ text, maps: null })),
  ];
  // Rotate so the correct option does not always get id "a".
  const k = (Number(mid.slice(1)) + (form === 'B' ? 1 : 0)) % raw.length;
  const rotated = [...raw.slice(k), ...raw.slice(0, k)];
  return {
    id: `q-${mid}-${form}`, misconceptionId: mid, form,
    topic: MISCONCEPTION_BY_ID.get(mid)?.topic ?? '',
    stem,
    options: rotated.map((o, i) => ({ id: 'abcd'[i], ...o })),
    check: { expr, wrong },
  };
}

const F = (a: number, b: number) => `$\\frac{${a}}{${b}}$`;

export const QUESTIONS: Question[] = [
  q('M01', 'A', 'Hisoblang: $-3^2$', '$-9$', '$9$', ['$-6$', '$6$'], '-3^2', '(-3)^2'),
  q('M01', 'B', 'Hisoblang: $-5^2$', '$-25$', '$25$', ['$-10$', '$10$'], '-5^2', '(-5)^2'),
  q('M02', 'A', 'Hisoblang: $2^3$', '$8$', '$6$', ['$5$', '$9$'], '2^3', '2*3'),
  q('M02', 'B', 'Hisoblang: $4^3$', '$64$', '$12$', ['$7$', '$16$'], '4^3', '4*3'),
  q('M03', 'A', 'Hisoblang: $5 - (-3)$', '$8$', '$2$', ['$-8$', '$-2$'], '5-(-3)', '5-3'),
  q('M03', 'B', 'Hisoblang: $7 - (-6)$', '$13$', '$1$', ['$-13$', '$-1$'], '7-(-6)', '7-6'),
  q('M04', 'A', 'Hisoblang: $(-2)\\cdot(-4)$', '$8$', '$-8$', ['$-6$', '$6$'], '(-2)*(-4)', '-(2*4)'),
  q('M04', 'B', 'Hisoblang: $(-3)\\cdot(-5)$', '$15$', '$-15$', ['$-8$', '$8$'], '(-3)*(-5)', '-(3*5)'),
  q('M05', 'A', 'Qavsni oching: $-(x - 4)$', '$-x + 4$', '$-x - 4$', ['$x - 4$', '$x + 4$'], '-(x-4)', '-x-4'),
  q('M05', 'B', 'Soddalashtiring: $10 - (a - 3)$', '$13 - a$', '$7 - a$', ['$7 + a$', '$13 + a$'], '10-(a-3)', '10-a-3'),
  q('M06', 'A', 'Hisoblang: $\\frac{1}{2} + \\frac{1}{3}$', F(5, 6), F(2, 5), [F(2, 6), F(1, 6)], '1/2+1/3', '(1+1)/(2+3)'),
  q('M06', 'B', 'Hisoblang: $\\frac{1}{4} + \\frac{2}{3}$', F(11, 12), F(3, 7), [F(2, 12), F(3, 12)], '1/4+2/3', '(1+2)/(4+3)'),
  q('M07', 'A', 'Qaysi kasr katta: $\\frac{1}{8}$ yoki $\\frac{1}{5}$?', F(1, 5), F(1, 8), ['Ikkalasi teng', 'Taqqoslab bo‘lmaydi'], 'max(1/8,1/5)', 'min(1/8,1/5)'),
  q('M07', 'B', 'Qaysi kasr kichik: $\\frac{1}{6}$ yoki $\\frac{1}{9}$?', F(1, 9), F(1, 6), ['Ikkalasi teng', 'Taqqoslab bo‘lmaydi'], 'min(1/6,1/9)', 'max(1/6,1/9)'),
  q('M08', 'A', 'Qavsni oching: $2(x + 3)$', '$2x + 6$', '$2x + 3$', ['$2x + 5$', '$x + 6$'], '2(x+3)', '2x+3'),
  q('M08', 'B', 'Qavsni oching: $5(a - 2)$', '$5a - 10$', '$5a - 2$', ['$5a - 7$', '$a - 10$'], '5(a-2)', '5a-2'),
  q('M09', 'A', 'Soddalashtiring: $3x + 4y$', 'Soddalashmaydi: $3x + 4y$', '$7xy$', ['$7x$', '$12xy$'], '3x+4y', '7*x*y'),
  q('M09', 'B', 'Soddalashtiring: $2x + 5y + 3x$', '$5x + 5y$', '$10xy$', ['$10x$', '$6x + 5y$'], '2x+5y+3x', '10*x*y'),
  q('M10', 'A', 'Tenglamani yeching: $x + 5 = 12$', '$x = 7$', '$x = 17$', ['$x = 60$', '$x = -7$'], '12-5', '12+5'),
  q('M10', 'B', 'Tenglamani yeching: $x - 4 = 9$', '$x = 13$', '$x = 5$', ['$x = -13$', '$x = 36$'], '9+4', '9-4'),
  q('M11', 'A', 'Hisoblang: $2 + 3\\cdot 4$', '$14$', '$20$', ['$9$', '$24$'], '2+3*4', '(2+3)*4'),
  q('M11', 'B', 'Hisoblang: $10 - 2\\cdot 3$', '$4$', '$24$', ['$5$', '$15$'], '10-2*3', '(10-2)*3'),
  q('M12', 'A', 'Qavsni oching: $(a + b)^2$', '$a^2 + 2ab + b^2$', '$a^2 + b^2$', ['$2a + 2b$', '$a^2 + ab + b^2$'], '(a+b)^2', 'a^2+b^2'),
  q('M12', 'B', 'Hisoblang: $(2 + 3)^2$', '$25$', '$13$', ['$10$', '$12$'], '(2+3)^2', '2^2+3^2'),
  q('M13', 'A', 'Soddalashtiring: $x^2\\cdot x^3$', '$x^5$', '$x^6$', ['$2x^5$', '$2x^6$'], 'x^2*x^3', 'x^6'),
  q('M13', 'B', 'Soddalashtiring: $a^4\\cdot a^2$', '$a^6$', '$a^8$', ['$2a^6$', '$a^2$'], 'a^4*a^2', 'a^8'),
  q('M14', 'A', 'Hisoblang: $7^0$', '$1$', '$0$', ['$7$', '$70$'], '7^0', '0'),
  q('M14', 'B', 'Hisoblang: $5^0 + 5^1$', '$6$', '$5$', ['$10$', '$1$'], '5^0+5^1', '0+5'),
  q('M15', 'A', 'Tenglamani yeching: $3x = 12$', '$x = 4$', '$x = 9$', ['$x = 36$', '$x = 15$'], '12/3', '12-3'),
  q('M15', 'B', 'Tenglamani yeching: $4x = 20$', '$x = 5$', '$x = 16$', ['$x = 80$', '$x = 24$'], '20/4', '20-4'),
  q('M16', 'A', 'Qaysi son katta: $-5$ yoki $-2$?', '$-2$', '$-5$', ['Ikkalasi teng', 'Taqqoslab bo‘lmaydi'], 'max(-5,-2)', 'min(-5,-2)'),
  q('M16', 'B', 'Ertalab havo −8°C, kechqurun −3°C edi. Qachon sovuqroq bo‘lgan?', 'Ertalab ($-8$°C)', 'Kechqurun ($-3$°C)', ['Ikkalasida bir xil', 'Aniqlab bo‘lmaydi'], 'min(-8,-3)', 'max(-8,-3)'),
];

export const QUESTION_BY_ID = new Map(QUESTIONS.map((x) => [x.id, x]));
