// Seeds the demo class (NAMUNA) into the database from MONGODB_URI. Safe to run twice.
// Run: npm run seed:demo  (reads .env.local)
import mongoose from 'mongoose';
import { DEMO_CODE, classByCode, classOverview, dbMode } from '../lib/store';

async function main() {
  if (dbMode !== 'mongodb') throw new Error('MONGODB_URI is not set. Put it in .env.local first.');
  const klass = await classByCode(DEMO_CODE); // creates the demo class if missing
  const { n, total } = await classOverview(klass!.id);
  console.log(`Demo class ${DEMO_CODE}: ${total} students, ${n} with attempts.`);
}

main()
  .catch((e) => {
    console.error((e as Error).message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
