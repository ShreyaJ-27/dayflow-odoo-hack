import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { configured, deleteAsset, uploadBuffer } from '../lib/cloudinary.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_request, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) });
router.use(requireAuth);

router.post('/employees/me/profile-picture', upload.single('file'), async (request, response, next) => {
  try {
    if (!configured) { response.status(503).json({ success: false, message: 'File storage is not configured', error: { code: 'STORAGE_UNAVAILABLE' } }); return; }
    if (!request.file) { response.status(422).json({ success: false, message: 'A JPEG, PNG, or WebP image is required', error: { code: 'PROFILE_PICTURE_REQUIRED' } }); return; }
    const profile = await prisma.employeeProfile.findUniqueOrThrow({ where: { userId: request.user!.id } });
    const asset = await uploadBuffer(request.file.buffer, 'dayflow/profile-pictures');
    const updated = await prisma.employeeProfile.update({ where: { id: profile.id }, data: { profilePictureUrl: asset.secure_url, profilePicturePublicId: asset.public_id }, select: { id: true, profilePictureUrl: true } });
    if (profile.profilePicturePublicId) await deleteAsset(profile.profilePicturePublicId);
    response.json({ success: true, message: 'Profile picture updated', data: updated });
  } catch (error) { next(error); }
});

router.post('/employees/:id/profile-picture', requireRole('ADMIN', 'HR'), upload.single('file'), async (request, response, next) => {
  try {
    if (!configured) { response.status(503).json({ success: false, message: 'File storage is not configured', error: { code: 'STORAGE_UNAVAILABLE' } }); return; }
    if (!request.file) { response.status(422).json({ success: false, message: 'A JPEG, PNG, or WebP image is required', error: { code: 'PROFILE_PICTURE_REQUIRED' } }); return; }
    const profile = await prisma.employeeProfile.findUniqueOrThrow({ where: { id: z.string().parse(request.params.id) } });
    const asset = await uploadBuffer(request.file.buffer, 'dayflow/profile-pictures');
    const updated = await prisma.employeeProfile.update({ where: { id: profile.id }, data: { profilePictureUrl: asset.secure_url, profilePicturePublicId: asset.public_id }, select: { id: true, profilePictureUrl: true } });
    if (profile.profilePicturePublicId) await deleteAsset(profile.profilePicturePublicId);
    response.json({ success: true, message: 'Profile picture updated', data: updated });
  } catch (error) { next(error); }
});
export default router;
