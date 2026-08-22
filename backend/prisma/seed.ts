import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/security.js';

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const employeeId = process.env.SEED_ADMIN_EMPLOYEE_ID;
  if (!email || !password || !employeeId) { console.log('Admin seed skipped: SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, and SEED_ADMIN_EMPLOYEE_ID are required.'); return; }
  await prisma.user.upsert({ where: { email }, update: { role: 'ADMIN', emailVerified: true, isActive: true }, create: { email, employeeId, passwordHash: await hashPassword(password), role: 'ADMIN', emailVerified: true, profile: { create: { firstName: 'System', lastName: 'Administrator' } } } });
  console.log('Admin seed completed.');
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
