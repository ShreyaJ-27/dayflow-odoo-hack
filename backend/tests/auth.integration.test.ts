import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const email = `test-${suffix}@example.com`;
const employeeId = `TEST-${suffix}`;
const password = 'StrongPassword123!';
let userId = '';
let accessToken = '';
let refreshToken = '';

describe('authentication and RBAC workflows', () => {
  it('rejects unauthenticated protected requests', async () => {
    expect((await request(app).get('/api/employees/me')).status).toBe(401);
  });

  it('signs up, rejects duplicates, verifies, and signs in', async () => {
    const signup = await request(app).post('/api/auth/signup').send({ employeeId, email, password, firstName: 'Test', lastName: 'Employee' });
    expect(signup.status).toBe(201);
    userId = signup.body.data.user.id;
    const duplicateEmail = await request(app).post('/api/auth/signup').send({ employeeId: `${employeeId}-2`, email, password, firstName: 'Test', lastName: 'Duplicate' });
    expect(duplicateEmail.status).toBe(409);
    const duplicateEmployee = await request(app).post('/api/auth/signup').send({ employeeId, email: `other-${suffix}@example.com`, password, firstName: 'Test', lastName: 'Duplicate' });
    expect(duplicateEmployee.status).toBe(409);
    const token = signup.body.data.verificationToken;
    expect((await request(app).get('/api/auth/verify-email').query({ token })).status).toBe(200);
    const signin = await request(app).post('/api/auth/signin').send({ email, password });
    expect(signin.status).toBe(200);
    accessToken = signin.body.data.accessToken;
    refreshToken = signin.body.data.refreshToken;
    expect((await request(app).get('/api/auth/me').set('Authorization', `Bearer ${accessToken}`)).status).toBe(200);
  });

  it('rotates refresh tokens and rejects the previous token', async () => {
    const rotated = await request(app).post('/api/auth/refresh').send({ refreshToken });
    expect(rotated.status).toBe(200);
    const oldToken = await request(app).post('/api/auth/refresh').send({ refreshToken });
    expect(oldToken.status).toBe(401);
    refreshToken = rotated.body.data.refreshToken;
  });

  it('prevents employee access to admin resources and logs out', async () => {
    expect((await request(app).get('/api/dashboard/admin').set('Authorization', `Bearer ${accessToken}`)).status).toBe(403);
    expect((await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${accessToken}`).send({ refreshToken })).status).toBe(204);
  });
});

afterAll(async () => {
  if (userId) await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
});