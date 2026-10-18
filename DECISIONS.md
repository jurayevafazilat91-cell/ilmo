# Decisions

- Product name **ILMO** (from the user's design mock); the brief's "XatoDNK" concept and "Xato DNK" wording stay inside the product.
- Visual design follows the user's ILMO mock (cream paper, forest green, gold, serif headings) instead of the brief's palette; the brief's semantic colors survive as `xato` (vermilion) and `fixed` (green).
- Fonts: system stacks (Georgia headings, Segoe UI/system sans body). `next/font/google` failed on the venue-like slow network and broke the page; system fonts need no download and include the ‘ character.
- App lives in `hackhaton/ilmo/` because `hackhaton/` already held an unrelated, un-versioned project (kun-tartibi) that must not be overwritten.
- 1-hour budget: P0 vertical slice first. No Gemini yet; Bobur runs in scripted cards mode.
- Storage behind a small `Repo` interface in `lib/store.ts`: MongoDB (`lib/store-mongo.ts`, Mongoose) when `MONGODB_URI` is set, in-memory otherwise, so the demo never breaks without secrets. Memory mode only works on one Node process.
- Mongo documents use our own UUID strings as `_id`, so app code keeps plain string ids.
- The demo class is seeded lazily on first use of code `NAMUNA` (plus `npm run seed:demo`); a unique index on `code` stops two instances seeding twice.
- Demo students share one recovery-code hash (they never rejoin) to keep seeding fast.
- Test questions are built in server components and passed already stripped and KaTeX-rendered to the client, instead of a `GET /api/test/[phase]` route. Same guarantee (no correct flags reach the browser), less code, no KaTeX JS in the client bundle.
- Scripted cards live inside `content/misconceptions.ts` (`cards`) rather than a separate `bobur-scripts.ts`.
- Each `Question.check` holds both `expr` (correct) and `wrong` (the misconception's wrong rule); the validator evaluates both with mathjs at two variable scopes so algebraic options are checked too.
- A pre-test diagnosis rests on one item per misconception, so the UI calls it "ehtimoliy xato ishonch" until the post-test re-checks it.
- `boshqa_xato` (wrong, but not the mapped distractor) does not count as an active misconception in the DNK chain.
- Demo class code `NAMUNA`, demo teacher key `NAMUNA-USTOZ` (public by design, demo only). Demo data is generated from a seeded PRNG and always labeled.
- Missing `SESSION_SECRET` falls back to a random per-process key (sessions reset on restart).
- `cacheComponents` turned off (scaffold default) because every page reads the session cookie.
