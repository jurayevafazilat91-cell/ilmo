# Plan

## Milestone 1 — P0 vertical slice (done in this pass)
- [x] Content: 16 misconceptions, 32 questions (A/B), machine validator (`npm run validate`)
- [x] Diagnosis engine (pure, unit-tested): grading, active misconceptions, pre/post statuses
- [x] Join (class code + nickname, one-click demo), recovery code, rejoin, signed httpOnly cookie
- [x] Oldingi / keyingi test: one question per screen, progress, KaTeX, server-side grading
- [x] Natija: DNK chain (16 nodes), counterexample step reveal, "Xato DNK: X → Y"
- [x] Sen ustozsan (Bobur) in scripted cards mode, max 3 turns, teaching card fallback
- [x] Teacher: create class, login, misconception map with n and click-through nicknames
- [x] Demo class (20 synthetic students) with a permanent demo banner

## Milestone 2 — make it deployable
- [x] Mongoose models + `lib/db.ts` (cached connection), `Repo` in `lib/store.ts`
- [x] `seed:demo` script against Atlas
- [x] `/api/health` with a real DB ping
- [ ] Verify against a real Atlas cluster (needs the user's `MONGODB_URI`)

## Milestone 3 — AI (P0 live mode)
- [ ] `LLMProvider` interface, `GeminiProvider` (`@google/genai`, model checked in current docs), `ScriptedProvider`
- [ ] Guard (400-char cap, control chars, injection), per-student / per-class daily caps, queue

## Milestone 4 — P1
- [ ] Kechki savol parent link + note
- [ ] Savol rentgeni (p, D, distractor table, flags)
- [ ] Teacher Oldin/Keyin page with n
- [ ] Sinf tavsiyasi (AI + template)
- [ ] docs/PITCH.md
