# ILMO

ILMO finds the wrong belief behind a student's mistake (for example "−3² = 9"), breaks it with a counterexample, and then lets the student teach a confused classmate, Bobur, who holds the same belief. Diagnosis is deterministic; no AI decides anything.

**Uzbek summary:** ILMO o‘quvchining xatosi ortidagi noto‘g‘ri ishonchni topadi, uni qarshi misol bilan buzadi va o‘quvchiga shu ishonchdagi sinfdoshi Boburni o‘rgatish imkonini beradi.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and click **Sinab ko‘rish**. The demo teacher panel is at `/demo` (class `NAMUNA`, key `NAMUNA-USTOZ`).

Checks: `npm run lint`, `npm run test`, `npm run validate`, `npm run build`.

## Storage

- `MONGODB_URI` set → MongoDB Atlas (required for Vercel).
- Not set → in-memory store: works offline for local demos, resets on restart.
- `GET /api/health` tells you which one is active (`db: "mongodb" | "memory" | "down"`).

## Connect MongoDB Atlas (free M0)

1. Sign in at https://cloud.mongodb.com → **Create** → choose the free **M0** cluster, any nearby region (e.g. Frankfurt).
2. **Database Access** → Add New Database User → username + a **strong generated password** → role "Read and write to any database".
3. **Network Access** → Add IP Address:
   - local only: "Add current IP address";
   - for Vercel: `0.0.0.0/0` (Vercel uses dynamic IPs). This lets anyone *try* to connect, so the strong password is what protects the data.
4. **Clusters** → Connect → Drivers → copy the `mongodb+srv://...` string. Replace `<db_password>` and add the database name before `?`:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/ilmo?retryWrites=true&w=majority`
5. Create `.env.local` in this folder (never commit it; `.env*` is git-ignored):
   ```
   MONGODB_URI=mongodb+srv://...
   SESSION_SECRET=<a long random string>
   ```
6. Seed the demo class and check:
   ```bash
   npm run seed:demo
   npm run dev
   ```
   Open http://localhost:3000/api/health → `"db":"mongodb"`.
7. Vercel: Project → Settings → Environment Variables → add `MONGODB_URI` and `SESSION_SECRET`, redeploy, then open `/api/health`.

**O‘zbekcha qisqacha:** Atlas'da bepul M0 klaster oching, foydalanuvchi va kuchli parol yarating, Network Access'ga IP (Vercel uchun `0.0.0.0/0`) qo‘shing, ulanish satrini `.env.local` faylidagi `MONGODB_URI` ga yozing, keyin `npm run seed:demo` va `/api/health` bilan tekshiring.

## Manual QA checklist

- [ ] 360px viewport: Sinab ko‘rish → 8 questions → Natija → 2 Bobur chats → Keyingi test → "Xato DNK: X → Y"
- [ ] Reload mid-test keeps the same question order
- [ ] View page source of `/test/oldingi`: no `correct` / `maps` fields
- [ ] Keyboard only: every button and option reachable, focus ring visible
- [ ] Teacher: create class, note code + key, log in, see the map with n; demo panel shows the demo banner
