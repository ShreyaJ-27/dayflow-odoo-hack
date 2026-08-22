import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AccessClaims = { sub: string; role: 'ADMIN' | 'HR' | 'EMPLOYEE'; email: string };
export const hashPassword = (password: string) => bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);
export const randomToken = () => crypto.randomBytes(32).toString('hex');
export const tokenHash = (token: string) => crypto.createHash('sha256').update(token).digest('hex');
export const signAccess = (claims: AccessClaims) => jwt.sign(claims, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'] });
export const signRefresh = (userId: string) => jwt.sign({ sub: userId, kind: 'refresh', jti: randomToken() }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] });
export const verifyAccess = (token: string) => jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessClaims;
export const verifyRefresh = (token: string) => jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; kind: 'refresh' };
