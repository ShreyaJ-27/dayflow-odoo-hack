import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { configured, deleteAsset, uploadBuffer } from '../lib/cloudinary.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (_request, file, callback) => callback(null, ['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)) });
router.use(requireAuth);
const owner = async (userId: string) => prisma.employeeProfile.findUniqueOrThrow({ where: { userId } });
router.get('/documents/me', async (request, response, next) => { try { const profile = await owner(request.user!.id); const data = await prisma.document.findMany({ where: { employeeId: profile.id }, orderBy: { createdAt: 'desc' } }); response.json({ success: true, data }); } catch (error) { next(error); } });
router.get('/documents/:id', async (request, response, next) => { try { const document = await prisma.document.findUniqueOrThrow({ where: { id: z.string().parse(request.params.id) }, include: { employee: true } }); if (request.user!.role === 'EMPLOYEE' && document.employee.userId !== request.user!.id) { response.status(403).json({ success: false, message: 'Insufficient permissions', error: { code: 'FORBIDDEN' } }); return; } response.json({ success: true, data: document }); } catch (error) { next(error); } });
router.post('/documents', requireRole('ADMIN', 'HR'), upload.single('file'), async (request, response, next) => { try { if (!configured) { response.status(503).json({ success: false, message: 'File storage is not configured', error: { code: 'STORAGE_UNAVAILABLE' } }); return; } if (!request.file) { response.status(422).json({ success: false, message: 'A PDF, PNG, or JPEG file is required', error: { code: 'FILE_REQUIRED' } }); return; } const employeeId = z.string().parse(request.body.employeeId); const type = z.string().trim().min(1).max(80).parse(request.body.type); const asset = await uploadBuffer(request.file.buffer, 'dayflow/documents'); const data = await prisma.document.create({ data: { employeeId, type, originalFilename: request.file.originalname, secureUrl: asset.secure_url, publicId: asset.public_id, mimeType: request.file.mimetype, sizeBytes: request.file.size } }); response.status(201).json({ success: true, data }); } catch (error) { next(error); } });
router.delete('/documents/:id', requireRole('ADMIN', 'HR'), async (request, response, next) => { try { const id = z.string().parse(request.params.id); const document = await prisma.document.findUniqueOrThrow({ where: { id } }); await prisma.document.delete({ where: { id } }); if (document.publicId && configured) await deleteAsset(document.publicId); response.status(204).send(); } catch (error) { next(error); } });
export default router;
