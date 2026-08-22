import 'dotenv/config';
import { z } from 'zod';

const normalizeUrl = (val: unknown, fallback: string) => {
  if (typeof val !== 'string' || !val.trim()) return fallback;
  let str = val.trim();
  if (!/^https?:\/\//i.test(str)) {
    str = `https://${str}`;
  }
  return str.replace(/\/+$/, '');
};

const rawFrontendUrl = normalizeUrl(process.env.FRONTEND_URL, 'http://localhost:5173');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  API_BASE_URL: z.string().optional().transform((v) => v ? normalizeUrl(v, 'http://localhost:5000') : undefined),
  FRONTEND_URL: z.string().default(rawFrontendUrl).transform((v) => normalizeUrl(v, 'http://localhost:5173')),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(16).default('e33d86b891b6e73e24b4088f6dd55bcf16989a96e22fc5339b11a651c2c220284c6762c9377b2bf34779c65b777bf2e205c464921b5c9859dd28c42815db65eb'),
  JWT_REFRESH_SECRET: z.string().min(16).default('2694f489d2a68ab1d5a9f30df77165fe0b763af2ee26f427f8aa04ca4e45db585f1bab4b744a3fdb4cefa6628342a6d4a3c344da5ec96c406eea718abee5e988'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  EMAIL_FROM: z.string().default('Dayflow HRMS <no-reply@dayflow.io>'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_VERIFICATION_URL: z.string().optional().transform((v) => normalizeUrl(v, `${rawFrontendUrl}/verify-email`)),
  PASSWORD_RESET_URL: z.string().optional().transform((v) => normalizeUrl(v, `${rawFrontendUrl}/reset-password`)),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  HR_SIGNUP_INVITE_CODE: z.string().default('8ad11e9e4412fca9c66112a465c0b9ed6c67f21423f39078bc8bd2871ea22bb5'),
  ATTENDANCE_TIMEZONE: z.string().default('Asia/Kolkata')
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

export const env = parsed.data;