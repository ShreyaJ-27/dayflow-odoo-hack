import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword, signAccess } from '../src/utils/security.js';

const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
let employeeToken = '';
let adminToken = '';
let employeeId = '';
let leaveId = '';

beforeAll(async () => {
  const [employee, admin] = await Promise.all([
    prisma.user.create({ data: { employeeId: `BUS-${suffix}`, email: `business-${suffix}@example.com`, passwordHash: await hashPassword('StrongPassword123!'), emailVerified: true, profile: { create: { firstName: 'Business', lastName: 'Employee', department: 'Engineering' } } } }),
    prisma.user.create({ data: { employeeId: `ADM-${suffix}`, email: `admin-${suffix}@example.com`, passwordHash: await hashPassword('StrongPassword123!'), role: 'ADMIN', emailVerified: true, profile: { create: { firstName: 'Business', lastName: 'Admin' } } } })
  ]);
  employeeId = employee.id;
  employeeToken = signAccess({ sub: employee.id, email: employee.email, role: employee.role });
  adminToken = signAccess({ sub: admin.id, email: admin.email, role: admin.role });
});

describe('employee, attendance, leave, payroll, notification, and report workflows', () => {
  it('enforces profile ownership and admin listing', async () => {
    expect((await request(app).get('/api/employees/me').set('Authorization', `Bearer ${employeeToken}`)).status).toBe(200);
    expect((await request(app).get('/api/employees').set('Authorization', `Bearer ${employeeToken}`)).status).toBe(403);
    expect((await request(app).get('/api/employees').query({ search: 'Business', department: 'Engineering' }).set('Authorization', `Bearer ${adminToken}`)).status).toBe(200);
  });

  it('enforces attendance check-in and check-out invariants', async () => {
    expect((await request(app).post('/api/attendance/check-in').set('Authorization', `Bearer ${employeeToken}`)).status).toBe(201);
    expect((await request(app).post('/api/attendance/check-in').set('Authorization', `Bearer ${employeeToken}`)).status).toBe(409);
    expect((await request(app).get('/api/attendance/me/daily').set('Authorization', `Bearer ${employeeToken}`)).status).toBe(200);
    expect((await request(app).post('/api/attendance/check-out').set('Authorization', `Bearer ${employeeToken}`)).status).toBe(200);
    expect((await request(app).get('/api/attendance').query({ status: 'PRESENT' }).set('Authorization', `Bearer ${adminToken}`)).status).toBe(200);
  });

  it('approves leave transactionally and reflects it in attendance', async () => {
    const startDate = new Date(Date.now() + 3 * 86400000).toISOString();
    const created = await request(app).post('/api/leaves').set('Authorization', `Bearer ${employeeToken}`).send({ type: 'PAID', startDate, endDate: startDate, remarks: 'Personal leave' });
    expect(created.status).toBe(201);
    leaveId = created.body.data.id;
    expect((await request(app).post(`/api/leaves/${leaveId}/approve`).set('Authorization', `Bearer ${employeeToken}`).send({ comment: 'No' })).status).toBe(403);
    expect((await request(app).post(`/api/leaves/${leaveId}/approve`).set('Authorization', `Bearer ${adminToken}`).send({ comment: 'Approved' })).status).toBe(200);
    const profile = await prisma.employeeProfile.findUniqueOrThrow({ where: { userId: employeeId } });
    expect((await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId: profile.id, date: new Date(startDate.slice(0, 10)) } } }))?.status).toBe('LEAVE');
    expect((await request(app).get('/api/notifications/unread-count').set('Authorization', `Bearer ${employeeToken}`)).body.data.count).toBeGreaterThan(0);
  });

  it('keeps payroll private and reports role-protected', async () => {
    const profile = await prisma.employeeProfile.findUniqueOrThrow({ where: { userId: employeeId } });
    await prisma.salaryStructure.create({ data: { employeeId: profile.id, basicSalary: 1000, allowances: 100, deductions: 50, grossSalary: 1100, netSalary: 1050, effectiveDate: new Date() } });
    expect((await request(app).get('/api/payroll/me').set('Authorization', `Bearer ${employeeToken}`)).status).toBe(200);
    expect((await request(app).put(`/api/payroll/${profile.id}`).set('Authorization', `Bearer ${employeeToken}`).send({ basicSalary: 999, effectiveDate: new Date().toISOString() })).status).toBe(403);
    expect((await request(app).get('/api/reports/payroll').set('Authorization', `Bearer ${adminToken}`)).status).toBe(200);
    expect((await request(app).get('/api/reports/payroll').set('Authorization', `Bearer ${employeeToken}`)).status).toBe(403);
  });
});

afterAll(async () => { await prisma.user.deleteMany({ where: { employeeId: { in: [`BUS-${suffix}`, `ADM-${suffix}`] } } }); await prisma.$disconnect(); });
