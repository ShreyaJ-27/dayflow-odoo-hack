import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { comparePassword, hashPassword, randomToken, signAccess, signRefresh, tokenHash, verifyRefresh } from '../utils/security.js';
import { requireAuth } from '../middleware/auth.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../lib/mailer.js';

const router = Router();
const signupSchema = z.object({ employeeId: z.string().trim().min(2).max(40), email: z.string().email().transform((value) => value.toLowerCase()), password: z.string().min(8).max(72), role: z.enum(['EMPLOYEE', 'HR']).default('EMPLOYEE'), inviteCode: z.string().optional(), firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80) });
const signinSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const safeUser = (user: { id: string; employeeId: string; email: string; role: string; emailVerified: boolean; isActive: boolean; profile?: unknown }) => ({ id: user.id, employeeId: user.employeeId, email: user.email, role: user.role, emailVerified: user.emailVerified, isActive: user.isActive, profile: user.profile });

async function issueTokens(user: { id: string; email: string; role: 'ADMIN' | 'HR' | 'EMPLOYEE' }) {
  const accessToken = signAccess({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = signRefresh(user.id);
  await prisma.refreshToken.create({ data: { userId: user.id, tokenHash: tokenHash(refreshToken), expiresAt: new Date(Date.now() + 7 * 86400000) } });
  return { accessToken, refreshToken };
}

router.post('/signup', async (request, response, next) => {
  try {
    const input = signupSchema.parse(request.body);
    if (input.role === 'HR' && input.inviteCode !== env.HR_SIGNUP_INVITE_CODE) { response.status(403).json({ success: false, message: 'Valid HR invite code required', error: { code: 'HR_INVITE_REQUIRED' } }); return; }
    const user = await prisma.user.create({
      data: {
        employeeId: input.employeeId,
        email: input.email,
        passwordHash: await hashPassword(input.password),
        role: input.role,
        emailVerified: true,
        isActive: true,
        profile: {
          create: {
            firstName: input.firstName,
            lastName: input.lastName,
            employmentStatus: 'ACTIVE',
            designation: input.role === 'HR' ? 'HR Officer' : 'Employee'
          }
        }
      },
      include: { profile: true }
    });
    const rawToken = randomToken();
    await prisma.emailVerificationToken.create({ data: { userId: user.id, tokenHash: tokenHash(rawToken), expiresAt: new Date(Date.now() + 86400000) } });
    void sendVerificationEmail(user.email, rawToken);
    const tokens = await issueTokens(user);
    response.status(201).json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      data: {
        user: safeUser(user),
        verificationToken: rawToken,
        ...tokens
      }
    });
  } catch (error) { next(error); }
});

router.post('/signin', async (request, response, next) => {
  try {
    const input = signinSchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() }, include: { profile: true } });
    if (!user || !(await comparePassword(input.password, user.passwordHash))) { response.status(401).json({ success: false, message: 'Invalid credentials', error: { code: 'AUTH_INVALID_CREDENTIALS' } }); return; }
    if (!user.emailVerified && user.role !== 'ADMIN') { response.status(403).json({ success: false, message: 'Email verification required', error: { code: 'EMAIL_NOT_VERIFIED' } }); return; }
    if (!user.isActive) { response.status(403).json({ success: false, message: 'Account is inactive', error: { code: 'ACCOUNT_INACTIVE' } }); return; }
    response.json({ success: true, message: 'Signed in successfully', data: { user: safeUser(user), ...(await issueTokens(user)) } });
  } catch (error) { next(error); }
});

router.post('/refresh', async (request, response, next) => {
  try {
    const input = z.object({ refreshToken: z.string().min(1) }).parse(request.body);
    const claims = verifyRefresh(input.refreshToken);
    const stored = await prisma.refreshToken.findFirst({ where: { userId: claims.sub, tokenHash: tokenHash(input.refreshToken), revokedAt: null, expiresAt: { gt: new Date() } }, include: { user: true } });
    if (!stored || !stored.user.isActive) { response.status(401).json({ success: false, message: 'Invalid refresh token', error: { code: 'AUTH_INVALID_REFRESH' } }); return; }
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    response.json({ success: true, data: await issueTokens(stored.user) });
  } catch (error) { next(error); }
});

router.post('/logout', requireAuth, async (request, response, next) => {
  try { const token = z.object({ refreshToken: z.string().min(1) }).parse(request.body).refreshToken; await prisma.refreshToken.updateMany({ where: { userId: request.user!.id, tokenHash: tokenHash(token), revokedAt: null }, data: { revokedAt: new Date() } }); response.status(204).send(); } catch (error) { next(error); }
});
router.get('/me', requireAuth, async (request, response, next) => { try { const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user!.id }, include: { profile: true } }); response.json({ success: true, data: safeUser(user) }); } catch (error) { next(error); } });

router.get('/verify-email', async (request, response, next) => { try { const token = z.string().min(1).parse(request.query.token); const record = await prisma.emailVerificationToken.findFirst({ where: { tokenHash: tokenHash(token), usedAt: null, expiresAt: { gt: new Date() } } }); if (!record) { response.status(400).json({ success: false, message: 'Verification token is invalid or expired', error: { code: 'VERIFICATION_INVALID' } }); return; } await prisma.$transaction([prisma.user.update({ where: { id: record.userId }, data: { emailVerified: true } }), prisma.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } })]); response.json({ success: true, message: 'Email verified successfully' }); } catch (error) { next(error); } });
router.post('/resend-verification', async (request, response) => { const email = z.object({ email: z.string().email() }).parse(request.body).email.toLowerCase(); const user = await prisma.user.findUnique({ where: { email } }); if (user && !user.emailVerified) { const rawToken = randomToken(); await prisma.emailVerificationToken.create({ data: { userId: user.id, tokenHash: tokenHash(rawToken), expiresAt: new Date(Date.now() + 86400000) } }); void sendVerificationEmail(user.email, rawToken); } response.json({ success: true, message: 'If the account exists, a verification email will be sent' }); });

router.post('/forgot-password', async (request, response, next) => { try { const email = z.object({ email: z.string().email() }).parse(request.body).email.toLowerCase(); const user = await prisma.user.findUnique({ where: { email } }); let resetToken: string | undefined; if (user) { resetToken = randomToken(); await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: tokenHash(resetToken), expiresAt: new Date(Date.now() + 3600000) } }); void sendPasswordResetEmail(user.email, resetToken); } response.json({ success: true, message: 'If the account exists, password reset instructions will be sent', resetToken: env.NODE_ENV !== 'production' ? resetToken : undefined }); } catch (error) { next(error); } });
router.post('/reset-password', async (request, response, next) => { try { const input = z.object({ token: z.string().min(1), password: z.string().min(8).max(72) }).parse(request.body); const record = await prisma.passwordResetToken.findFirst({ where: { tokenHash: tokenHash(input.token), usedAt: null, expiresAt: { gt: new Date() } } }); if (!record) { response.status(400).json({ success: false, message: 'Reset token is invalid or expired', error: { code: 'RESET_INVALID' } }); return; } await prisma.$transaction([prisma.user.update({ where: { id: record.userId }, data: { passwordHash: await hashPassword(input.password) } }), prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }), prisma.refreshToken.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: new Date() } })]); response.json({ success: true, message: 'Password reset successfully' }); } catch (error) { next(error); } });
export default router;
