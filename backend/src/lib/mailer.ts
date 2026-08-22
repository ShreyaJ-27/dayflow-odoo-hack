import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '../config/env.js';

let transporter: Transporter | undefined;

function getTransporter(): Transporter | undefined {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) return undefined;
  transporter ??= nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_PORT === 465, auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } });
  return transporter;
}

function layout(title: string, body: string): string {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1f2937"><h2>${title}</h2><div>${body}</div><p style="color:#6b7280;font-size:12px">Dayflow HRMS</p></div>`;
}

export async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  if (env.NODE_ENV === 'test') return false;
  const transport = getTransporter();
  if (!transport) return false;
  try { await transport.sendMail({ from: env.EMAIL_FROM, to, subject, html }); return true; } catch (error) { console.error('SMTP delivery failed', error instanceof Error ? error.message : 'unknown error'); return false; }
}

export async function verifySmtp(): Promise<{ configured: boolean; verified: boolean }> {
  const transport = getTransporter();
  if (!transport) return { configured: false, verified: false };
  try { await transport.verify(); return { configured: true, verified: true }; } catch { return { configured: true, verified: false }; }
}

export const sendVerificationEmail = (to: string, token: string) => sendMail(to, 'Verify your Dayflow account', layout('Verify your email', `<p>Confirm your Dayflow account by clicking the link below.</p><p><a href="${env.EMAIL_VERIFICATION_URL}?token=${encodeURIComponent(token)}">Verify email</a></p>`));
export const sendPasswordResetEmail = (to: string, token: string) => sendMail(to, 'Reset your Dayflow password', layout('Reset your password', `<p>This link expires in one hour.</p><p><a href="${env.PASSWORD_RESET_URL}?token=${encodeURIComponent(token)}">Reset password</a></p>`));
export const sendLeaveSubmittedEmail = (to: string, startDate: Date, endDate: Date) => sendMail(to, 'Leave request submitted', layout('Leave request submitted', `<p>Your request from ${startDate.toISOString().slice(0, 10)} to ${endDate.toISOString().slice(0, 10)} is pending review.</p>`));
export const sendLeaveDecisionEmail = (to: string, approved: boolean, comment?: string) => sendMail(to, `Leave request ${approved ? 'approved' : 'rejected'}`, layout(`Leave ${approved ? 'approved' : 'rejected'}`, `<p>Your leave request was ${approved ? 'approved' : 'rejected'}.</p>${comment ? `<p>Comment: ${comment}</p>` : ''}`));
export const sendPayrollUpdateEmail = (to: string) => sendMail(to, 'Payroll updated', layout('Payroll updated', '<p>Your salary structure has been updated in Dayflow.</p>'));
