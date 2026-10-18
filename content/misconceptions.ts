// Grade 7 algebra misconception library. Text is Uzbek; math is KaTeX inside $...$.

export type GroupId = 'daraja' | 'manfiy' | 'kasr' | 'ifoda' | 'tenglama';

export type Card = { id: string; text: string; correct: boolean; boburReply: string };

export type Misconception = {
  id: string;
  topic: string;
  group: GroupId;
  wrongBelief: string;
  correctIdea: string;
  counterexample: string[]; // revealed step by step
  boburLine: string;
  rubric: string[];
  cards: Card[]; // 1 correct + 2 plausible-but-wrong
};

export const GROUPS: Record<GroupId, string> = {
  daraja: 'Darajalar',
  manfiy: 'Manfiy sonlar',
  kasr: 'Kasrlar',
  ifoda: 'Ifodalar',
  tenglama: 'Tenglamalar',
};

export const MISCONCEPTIONS: Misconception[] = [
  {
    id: 'M01', topic: 'Daraja va ishora', group: 'daraja',
    wrongBelief: '$-3^2 = 9$',
    correctIdea: 'Daraja faqat 3 ga tegishli: $-3^2 = -(3\\cdot 3) = -9$. Faqat $(-3)^2 = 9$.',
    counterexample: ['$(-3)^2 = (-3)\\cdot(-3) = 9$', '$-3^2 = -(3\\cdot 3) = -9$', 'Qavs bor yoki yo‘qligi javobni o‘zgartiradi.'],
    boburLine: 'Menimcha $-3^2 = 9$, chunki kvadrat har doim musbat-ku!',
    rubric: ['daraja minusga emas, faqat 3 ga tegishli', 'qavs bo‘lsa $(-3)^2 = 9$, qavssiz $-9$'],
    cards: [
      { id: 'c1', correct: true, text: 'Daraja faqat 3 ga tegishli: avval $3^2 = 9$, keyin minus qo‘yiladi va $-9$ chiqadi. Faqat $(-3)^2 = 9$.', boburReply: 'Aha! Minus darajaga kirmaydi, qavs bo‘lsagina kiradi. Endi tushundim: $-3^2 = -9$.' },
      { id: 'c2', correct: false, text: 'Kitobda shunday yozilgan, shuning uchun $-9$.', boburReply: 'Kitobga ishonaman, lekin nega? Minus qayerga ketadi?' },
      { id: 'c3', correct: false, text: '$-3^2 = -6$, chunki $3\\cdot 2 = 6$.', boburReply: 'Kvadrat 2 ga ko‘paytirish emas-ku? $3^2$ nechaga teng?' },
    ],
  },
  {
    id: 'M02', topic: 'Daraja ma’nosi', group: 'daraja',
    wrongBelief: '$2^3 = 6$',
    correctIdea: 'Daraja bir xil sonni necha marta ko‘paytirishni bildiradi: $2^3 = 2\\cdot 2\\cdot 2 = 8$.',
    counterexample: ['Kubni tasavvur qiling: har qirrasida 2 ta kichik kub.', 'Pastki qavat: $2\\cdot 2 = 4$ ta kub.', 'Ikki qavat: $4\\cdot 2 = 8$ ta kub. Demak $2^3 = 8$, 6 emas.'],
    boburLine: '$2^3$ bu $2\\cdot 3$, ya’ni 6. Oddiy-ku!',
    rubric: ['daraja ko‘rsatkichi necha marta ko‘paytirishni bildiradi', '$2\\cdot 2\\cdot 2 = 8$, $2\\cdot 3$ emas'],
    cards: [
      { id: 'c1', correct: true, text: '$2^3$ — 2 ni uch marta o‘ziga ko‘paytirish: $2\\cdot 2\\cdot 2 = 8$. $2\\cdot 3$ esa 2 ni uch marta qo‘shish.', boburReply: 'Voy, men qo‘shish bilan ko‘paytirishni aralashtiribman. $2^3 = 8$!' },
      { id: 'c2', correct: false, text: '$2^3 = 2 + 3 = 5$ bo‘ladi.', boburReply: '5 qayerdan chiqdi? Daraja qo‘shish ekanmi?' },
      { id: 'c3', correct: false, text: 'Katta son chiqishi kerak, shuning uchun 9.', boburReply: '9 qayerdan keldi? $2\\cdot 2\\cdot 2$ ni hisoblab ko‘rsatgin-chi.' },
    ],
  },
  {
    id: 'M03', topic: 'Manfiy sonni ayirish', group: 'manfiy',
    wrongBelief: '$5 - (-3) = 2$',
    correctIdea: 'Manfiy sonni ayirish — qarama-qarshi sonni qo‘shish: $5 - (-3) = 5 + 3 = 8$.',
    counterexample: ['Sonlar o‘qida 5 da turibmiz.', '$-3$ ni ayirish chapga yurishning teskarisi: o‘ngga 3 qadam.', '$5 + 3 = 8$. Tekshiramiz: $8 + (-3) = 5$.'],
    boburLine: '$5 - (-3)$ — bu 5 dan 3 ni olish, ya’ni 2.',
    rubric: ['ayirish qarama-qarshi sonni qo‘shishga teng', '$-(-3) = +3$'],
    cards: [
      { id: 'c1', correct: true, text: 'Ayirishni qo‘shish bilan tekshiramiz: javob 2 bo‘lsa, $2 + (-3) = -1$, 5 emas. To‘g‘risi 8, chunki $8 + (-3) = 5$.', boburReply: 'Tekshirish ishlarkan! Manfiyni ayirish — qo‘shish ekan: $5 - (-3) = 8$.' },
      { id: 'c2', correct: false, text: 'Ikki minus yonma-yon kelsa, javob manfiy bo‘ladi: $-8$.', boburReply: '5 musbat edi-ku, qanday qilib manfiy bo‘lib qoldi?' },
      { id: 'c3', correct: false, text: 'Qavsni shunchaki olib tashlaymiz: $5 - 3 = 2$.', boburReply: 'Men ham shunday qilganman. Qavs ichidagi minus qayerga ketdi?' },
    ],
  },
  {
    id: 'M04', topic: 'Ishoralar ko‘paytmasi', group: 'manfiy',
    wrongBelief: '$(-2)\\cdot(-4) = -8$',
    correctIdea: 'Ikki manfiy sonning ko‘paytmasi musbat: $(-2)\\cdot(-4) = 8$.',
    counterexample: ['$(-2)\\cdot 2 = -4$', '$(-2)\\cdot 1 = -2$', '$(-2)\\cdot 0 = 0$', 'Har qadamda javob 2 ga oshyapti: $(-2)\\cdot(-1) = 2$, $(-2)\\cdot(-4) = 8$.'],
    boburLine: 'Minus marta minus — yana minus. Ikkalasi ham manfiy-ku!',
    rubric: ['naqsh: ko‘paytuvchi 1 ga kamayganda javob 2 ga oshadi', 'minus · minus = plus'],
    cards: [
      { id: 'c1', correct: true, text: 'Naqshni davom ettiramiz: $(-2)\\cdot 2 = -4$, $(-2)\\cdot 1 = -2$, $(-2)\\cdot 0 = 0$. Javob har safar 2 ga oshadi, demak $(-2)\\cdot(-4) = 8$.', boburReply: 'Naqsh to‘xtamaydi-ku! Demak minus marta minus plus beradi: 8.' },
      { id: 'c2', correct: false, text: 'Qoida shunday, yodlab olish kerak.', boburReply: 'Yodlash qiyin. Nega aynan plus? Ko‘rsatib bera olasanmi?' },
      { id: 'c3', correct: false, text: 'Minuslar qo‘shiladi: $-2 + (-4) = -6$.', boburReply: 'Bu qo‘shish-ku, biz ko‘paytiryapmiz. Ko‘paytirishda nima bo‘ladi?' },
    ],
  },
  {
    id: 'M05', topic: 'Qavs oldidagi minus', group: 'ifoda',
    wrongBelief: '$-(x - 4) = -x - 4$',
    correctIdea: 'Qavs oldidagi minus ichidagi har bir hadning ishorasini o‘zgartiradi: $-(x - 4) = -x + 4$.',
    counterexample: ['$x = 10$ deb olamiz.', '$-(10 - 4) = -6$', '$-10 - 4 = -14$, lekin $-10 + 4 = -6$. Demak to‘g‘risi $-x + 4$.'],
    boburLine: 'Minusni faqat birinchi hadga qo‘yaman: $-x - 4$.',
    rubric: ['minus qavs ichidagi har bir hadga tegishli', '$x$ o‘rniga son qo‘yib tekshirish'],
    cards: [
      { id: 'c1', correct: true, text: '$x = 10$ qo‘yamiz: $-(10 - 4) = -6$. Sening javobing $-10 - 4 = -14$ beradi, $-10 + 4$ esa $-6$. Minus ikkala hadga ta’sir qiladi.', boburReply: 'Son qo‘yib ko‘rsam, farq yaqqol ko‘rinarkan. $-(x - 4) = -x + 4$!' },
      { id: 'c2', correct: false, text: 'Minus faqat $x$ ga tegishli, 4 ga emas.', boburReply: 'Men ham shunday o‘ylayman! Unda nega son qo‘ysak javoblar har xil chiqadi?' },
      { id: 'c3', correct: false, text: 'Qavsni ochganda hamma ishoralar plus bo‘ladi: $x + 4$.', boburReply: 'Hammasi plusmi? Unda $x$ oldidagi minus qayerga ketdi?' },
    ],
  },
  {
    id: 'M06', topic: 'Kasrlarni qo‘shish', group: 'kasr',
    wrongBelief: '$\\frac{1}{2} + \\frac{1}{3} = \\frac{2}{5}$',
    correctIdea: 'Kasrlarni qo‘shish uchun umumiy maxraj kerak: $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$.',
    counterexample: ['$\\frac{1}{2}$ — bu yarim.', 'Yarimga nimadir qo‘shsak, yarimdan ko‘p bo‘lishi kerak.', 'Lekin $\\frac{2}{5}$ yarimdan kam.', 'Umumiy maxraj: $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$.'],
    boburLine: 'Suratni suratga, maxrajni maxrajga qo‘shaman: $\\frac{1+1}{2+3} = \\frac{2}{5}$.',
    rubric: ['umumiy maxrajga keltirish', 'yig‘indi qo‘shiluvchidan kichik bo‘la olmaydi'],
    cards: [
      { id: 'c1', correct: true, text: 'Yarimga yana nimadir qo‘shsak, yarimdan ko‘p bo‘ladi, $\\frac{2}{5}$ esa yarimdan kam. To‘g‘risi: $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$.', boburReply: 'To‘g‘ri, yig‘indi kichrayib qolishi mumkin emas. Avval maxrajni tenglash kerak ekan!' },
      { id: 'c2', correct: false, text: 'Maxrajlarni ko‘paytirib, suratlarni qo‘shamiz: $\\frac{2}{6}$.', boburReply: '$\\frac{2}{6}$ ham yarimdan kam-ku. Bu ham to‘g‘ri emasmi?' },
      { id: 'c3', correct: false, text: 'Kattaroq maxrajni olamiz: $\\frac{2}{3}$.', boburReply: 'Nega aynan 3? Bo‘laklar har xil kattalikda-ku.' },
    ],
  },
  {
    id: 'M07', topic: 'Kasrlarni taqqoslash', group: 'kasr',
    wrongBelief: '$\\frac{1}{8} > \\frac{1}{5}$',
    correctIdea: 'Bir butun ko‘proq bo‘lakka bo‘linsa, har bir bo‘lak kichikroq: $\\frac{1}{8} < \\frac{1}{5}$.',
    counterexample: ['Bir xil pitsani 5 kishiga bo‘lamiz.', 'Xuddi shunday pitsani 8 kishiga bo‘lamiz.', '8 kishi bo‘lganda har kim kichikroq bo‘lak oladi: $\\frac{1}{8} < \\frac{1}{5}$.'],
    boburLine: '8 soni 5 dan katta, demak $\\frac{1}{8}$ ham $\\frac{1}{5}$ dan katta.',
    rubric: ['maxraj — bo‘laklar soni', 'bo‘lak ko‘p bo‘lsa, har biri kichik'],
    cards: [
      { id: 'c1', correct: true, text: 'Pitsani 8 bo‘lakka bo‘lsak, har bo‘lak 5 bo‘lakka bo‘lgandagidan kichik. Shuning uchun $\\frac{1}{8} < \\frac{1}{5}$.', boburReply: 'Pitsa misoli zo‘r! Maxraj katta bo‘lsa, bo‘lak kichik bo‘ladi.' },
      { id: 'c2', correct: false, text: 'Suratlari bir xil, demak kasrlar teng.', boburReply: 'Lekin maxrajlar har xil-ku. Bo‘laklar bir xil kattalikdami?' },
      { id: 'c3', correct: false, text: 'Maxraji katta kasr har doim katta bo‘ladi.', boburReply: 'Men ham shunday deyman! Unda pitsa misolida nega boshqacha?' },
    ],
  },
  {
    id: 'M08', topic: 'Qavsni ochish', group: 'ifoda',
    wrongBelief: '$2(x + 3) = 2x + 3$',
    correctIdea: 'Qavs oldidagi son ichidagi har bir hadga ko‘paytiriladi: $2(x + 3) = 2x + 6$.',
    counterexample: ['$x = 1$ qo‘yamiz.', '$2(1 + 3) = 2\\cdot 4 = 8$', '$2\\cdot 1 + 3 = 5$, lekin $2\\cdot 1 + 6 = 8$. Demak to‘g‘risi $2x + 6$.'],
    boburLine: '2 ni faqat $x$ ga ko‘paytiraman: $2x + 3$.',
    rubric: ['son qavs ichidagi har bir hadga ko‘paytiriladi', 'son qo‘yib tekshirish'],
    cards: [
      { id: 'c1', correct: true, text: '$x = 1$ bo‘lsa, $2(1 + 3) = 8$. Sening ifodang $2\\cdot 1 + 3 = 5$ beradi. 2 ikkala hadga ko‘paytiriladi: $2x + 6$.', boburReply: '8 va 5 — farq katta! 2 ni 3 ga ham ko‘paytirish kerak ekan.' },
      { id: 'c2', correct: false, text: '2 faqat birinchi hadga tegishli.', boburReply: 'Shunday deb o‘ylaganman. Unda nega $x = 1$ da javoblar farq qiladi?' },
      { id: 'c3', correct: false, text: 'Hammasini qo‘shamiz: $x + 5$.', boburReply: 'Ko‘paytirish qayerda qoldi? 2 qavs oldida turibdi-ku.' },
    ],
  },
  {
    id: 'M09', topic: 'O‘xshash hadlar', group: 'ifoda',
    wrongBelief: '$3x + 4y = 7xy$',
    correctIdea: 'Faqat o‘xshash hadlar qo‘shiladi: $3x + 4y$ soddalashmaydi.',
    counterexample: ['$x = 2$, $y = 1$ qo‘yamiz.', '$3\\cdot 2 + 4\\cdot 1 = 10$', '$7\\cdot 2\\cdot 1 = 14$. $10 \\ne 14$, demak $3x + 4y \\ne 7xy$.'],
    boburLine: '3 ta $x$ va 4 ta $y$ — hammasi 7 ta $xy$.',
    rubric: ['faqat bir xil harfli hadlar qo‘shiladi', 'son qo‘yib tekshirish'],
    cards: [
      { id: 'c1', correct: true, text: '$3x$ — uchta olma, $4y$ — to‘rtta nok, ularni «7 ta olma-nok» deb bo‘lmaydi. $x = 2$, $y = 1$ da $3x + 4y = 10$, $7xy = 14$.', boburReply: 'Olma bilan nokni qo‘shib bo‘lmas ekan. $3x + 4y$ shundayligicha qoladi.' },
      { id: 'c2', correct: false, text: 'Harflarni ham ko‘paytirish kerak: $12xy$.', boburReply: '12 qayerdan chiqdi? Qo‘shish edi-ku.' },
      { id: 'c3', correct: false, text: 'Sonlarni qo‘shib, harflarni yonma-yon yozamiz.', boburReply: 'Men aynan shunday qildim! Bunda xato nima?' },
    ],
  },
  {
    id: 'M10', topic: 'Tenglamada o‘tkazish', group: 'tenglama',
    wrongBelief: '$x + 5 = 12 \\Rightarrow x = 17$',
    correctIdea: 'Ikki tomondan 5 ni ayiramiz: $x = 12 - 5 = 7$.',
    counterexample: ['$x = 17$ ni tekshiramiz: $17 + 5 = 22$.', '$22 \\ne 12$, demak 17 javob emas.', 'Ikki tomondan 5 ni ayiramiz: $x = 7$. Tekshiramiz: $7 + 5 = 12$.'],
    boburLine: '5 ni narigi tomonga o‘tkazaman va qo‘shaman: $12 + 5 = 17$.',
    rubric: ['o‘tkazganda ishora o‘zgaradi: ikki tomondan bir xil son ayiriladi', 'javobni qo‘yib tekshirish'],
    cards: [
      { id: 'c1', correct: true, text: '17 ni qo‘yib ko‘ramiz: $17 + 5 = 22$, 12 emas. Ikki tomondan 5 ni ayirsak, $x = 7$ va $7 + 5 = 12$.', boburReply: 'Qo‘yib tekshirish juda qulay ekan! $x = 7$.' },
      { id: 'c2', correct: false, text: 'Sonlarni bir tomonga yig‘amiz: $x = 5 + 12$.', boburReply: 'Men ham shunday qildim-ku! Nega bu noto‘g‘ri?' },
      { id: 'c3', correct: false, text: 'Ikki tomonni 5 ga bo‘lamiz.', boburReply: '$x$ ga 5 qo‘shilgan, ko‘paytirilmagan-ku. Bo‘lish to‘g‘rimi?' },
    ],
  },
  {
    id: 'M11', topic: 'Amallar tartibi', group: 'ifoda',
    wrongBelief: '$2 + 3\\cdot 4 = 20$',
    correctIdea: 'Avval ko‘paytirish, keyin qo‘shish: $2 + 12 = 14$.',
    counterexample: ['Daftar 2 ming so‘m, 3 ta ruchka 4 ming so‘mdan.', 'Ruchkalar: $3\\cdot 4 = 12$ ming.', 'Jami: $2 + 12 = 14$ ming so‘m, 20 emas.'],
    boburLine: 'Chapdan o‘ngga hisoblayman: $2 + 3 = 5$, $5\\cdot 4 = 20$.',
    rubric: ['ko‘paytirish qo‘shishdan oldin bajariladi', 'hayotiy misol'],
    cards: [
      { id: 'c1', correct: true, text: 'Daftar 2 ming, 3 ta ruchka 4 ming so‘mdan. Ruchkalar $3\\cdot 4 = 12$ ming, jami $2 + 12 = 14$ ming. Shuning uchun avval ko‘paytiramiz.', boburReply: 'Do‘konda 20 ming to‘lasam, ortiqcha berib qo‘yarkanman! Avval ko‘paytirish.' },
      { id: 'c2', correct: false, text: 'Har doim chapdan o‘ngga hisoblanadi.', boburReply: 'Men ham shunday qilaman! Unda nega 14 chiqadi?' },
      { id: 'c3', correct: false, text: 'Hamma sonlarni qo‘shamiz: $2 + 3 + 4 = 9$.', boburReply: 'Ko‘paytirish belgisi qayerga ketdi?' },
    ],
  },
  {
    id: 'M12', topic: 'Yig‘indi kvadrati', group: 'ifoda',
    wrongBelief: '$(a + b)^2 = a^2 + b^2$',
    correctIdea: '$(a + b)^2 = a^2 + 2ab + b^2$.',
    counterexample: ['$a = 2$, $b = 3$ qo‘yamiz.', '$(2 + 3)^2 = 5^2 = 25$', '$2^2 + 3^2 = 4 + 9 = 13$. $25 \\ne 13$: $2ab = 12$ yetishmayapti.'],
    boburLine: 'Kvadratni har biriga alohida qo‘yaman: $a^2 + b^2$.',
    rubric: ['$(a + b)(a + b)$ ni to‘liq ko‘paytirish', '$2ab$ hadi'],
    cards: [
      { id: 'c1', correct: true, text: '$a = 2$, $b = 3$: $(2 + 3)^2 = 25$, lekin $4 + 9 = 13$. Farq $12 = 2\\cdot 2\\cdot 3$, ya’ni $2ab$. Demak $(a + b)^2 = a^2 + 2ab + b^2$.', boburReply: 'Farq aynan $2ab$ ekan! Endi o‘rtadagi hadni unutmayman.' },
      { id: 'c2', correct: false, text: 'Kvadrat — ikkiga ko‘paytirish: $2a + 2b$.', boburReply: '$5^2$ 10 ga teng emas-ku. Kvadrat nima o‘zi?' },
      { id: 'c3', correct: false, text: 'Qavsdagi har bir son kvadratga ko‘tariladi, shunday qoida bor.', boburReply: 'Men ham shu qoidani bilaman! Unda nega 25 va 13 chiqdi?' },
    ],
  },
  {
    id: 'M13', topic: 'Darajalarni ko‘paytirish', group: 'daraja',
    wrongBelief: '$x^2\\cdot x^3 = x^6$',
    correctIdea: 'Asoslar bir xil bo‘lsa, ko‘rsatkichlar qo‘shiladi: $x^2\\cdot x^3 = x^5$.',
    counterexample: ['$x^2 = x\\cdot x$', '$x^3 = x\\cdot x\\cdot x$', '$x^2\\cdot x^3 = x\\cdot x\\cdot x\\cdot x\\cdot x$ — 5 ta $x$, ya’ni $x^5$.'],
    boburLine: 'Ko‘paytirayotgan bo‘lsak, ko‘rsatkichlarni ham ko‘paytiramiz: $x^6$.',
    rubric: ['$x$ larni sanash', 'ko‘rsatkichlar qo‘shiladi'],
    cards: [
      { id: 'c1', correct: true, text: '$x^2$ — ikkita $x$, $x^3$ — uchta $x$. Hammasi birga 5 ta $x$ ko‘paytmasi: $x^5$, oltita emas.', boburReply: 'Sanab ko‘rsam, rostdan 5 ta! Ko‘rsatkichlar qo‘shilar ekan.' },
      { id: 'c2', correct: false, text: 'Ko‘rsatkichlar ko‘paytiriladi, chunki amal ko‘paytirish.', boburReply: 'Aynan shunday deb o‘ylayman! Unda nega 5 ta $x$ chiqyapti?' },
      { id: 'c3', correct: false, text: 'Asoslar ham qo‘shiladi: $2x^5$.', boburReply: 'Nega 2? Biz qo‘shmayapmiz, ko‘paytiryapmiz-ku.' },
    ],
  },
  {
    id: 'M14', topic: 'Nol daraja', group: 'daraja',
    wrongBelief: '$a^0 = 0$',
    correctIdea: '$a \\ne 0$ bo‘lsa, $a^0 = 1$.',
    counterexample: ['$2^3 = 8$', '$2^2 = 4$', '$2^1 = 2$', 'Har qadamda 2 ga bo‘linyapti: $2^0 = 2 : 2 = 1$.'],
    boburLine: 'Nol marta ko‘paytirsa, hech narsa qolmaydi — 0.',
    rubric: ['ketma-ketlikda har safar asosga bo‘linadi', '$a^0 = 1$'],
    cards: [
      { id: 'c1', correct: true, text: '$2^3 = 8$, $2^2 = 4$, $2^1 = 2$ — har safar 2 ga bo‘linadi. Keyingisi $2^0 = 2 : 2 = 1$. Shuning uchun $a^0 = 1$.', boburReply: 'Ketma-ketlik 0 ga emas, 1 ga olib keldi. Ajoyib!' },
      { id: 'c2', correct: false, text: 'Nol darajada son o‘zgarmaydi: $a^0 = a$.', boburReply: 'Unda $2^1$ ham 2, $2^0$ ham 2 bo‘lib qoladimi?' },
      { id: 'c3', correct: false, text: 'Nolga ko‘paytirish har doim 0 beradi.', boburReply: 'Men ham shuni aytyapman! Unda nega 1 chiqadi?' },
    ],
  },
  {
    id: 'M15', topic: 'Tenglamaning ikki tomoni', group: 'tenglama',
    wrongBelief: '$3x = 12 \\Rightarrow x = 9$',
    correctIdea: 'Ikki tomonni 3 ga bo‘lamiz: $x = 4$.',
    counterexample: ['$x = 9$ ni tekshiramiz: $3\\cdot 9 = 27$.', '$27 \\ne 12$.', 'Ikki tomonni 3 ga bo‘lamiz: $x = 12 : 3 = 4$. Tekshiramiz: $3\\cdot 4 = 12$.'],
    boburLine: '3 ni narigi tomonga o‘tkazaman: $12 - 3 = 9$.',
    rubric: ['$3x$ — ko‘paytma, shuning uchun bo‘linadi', 'qo‘yib tekshirish'],
    cards: [
      { id: 'c1', correct: true, text: '$3x$ — 3 marta $x$. $x = 9$ bo‘lsa, $3\\cdot 9 = 27$, 12 emas. Ikki tomonni 3 ga bo‘lamiz: $x = 4$.', boburReply: '3 qo‘shilmagan, ko‘paytirilgan ekan! Shuning uchun bo‘lamiz: $x = 4$.' },
      { id: 'c2', correct: false, text: 'O‘tkazganda ishora o‘zgaradi, shuning uchun ayiramiz.', boburReply: 'Men ham shunday qildim! 3 qo‘shilganmi yoki ko‘paytirilganmi?' },
      { id: 'c3', correct: false, text: 'Ikkalasini ko‘paytiramiz: $x = 36$.', boburReply: '36 ni qo‘ysak, $3\\cdot 36$ juda katta-ku.' },
    ],
  },
  {
    id: 'M16', topic: 'Manfiy sonlarni solishtirish', group: 'manfiy',
    wrongBelief: '$-5 > -2$',
    correctIdea: 'Sonlar o‘qida o‘ngdagi son katta: $-5 < -2$.',
    counterexample: ['Ertalab −5°C, tushda −2°C.', 'Qachon sovuqroq? −5°C da.', 'Sovuqroq — kichikroq harorat: $-5 < -2$.'],
    boburLine: '5 soni 2 dan katta, demak $-5$ ham $-2$ dan katta.',
    rubric: ['sonlar o‘qida o‘ngdagi son katta', 'harorat misoli'],
    cards: [
      { id: 'c1', correct: true, text: '−5°C da −2°C dan sovuqroq bo‘ladi. Sonlar o‘qida $-5$ chaproqda turadi, shuning uchun $-5 < -2$.', boburReply: 'Qishda −5°C da ko‘proq sovqotaman, to‘g‘ri! $-5 < -2$.' },
      { id: 'c2', correct: false, text: 'Minuslarni olib tashlab solishtiramiz.', boburReply: 'Men ham shunday qilaman! Unda nega $-5$ kichik chiqadi?' },
      { id: 'c3', correct: false, text: 'Manfiy sonlarning hammasi teng, chunki ular noldan kichik.', boburReply: '$-100$ va $-1$ bir xilmi? Qaysi biri sovuqroq?' },
    ],
  },
];

export const MISCONCEPTION_BY_ID = new Map(MISCONCEPTIONS.map((m) => [m.id, m]));
