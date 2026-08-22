import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

const configured = Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
if (configured) cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET });
export { configured };
export function uploadBuffer(buffer: Buffer, folder: string): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => cloudinary.uploader.upload_stream({ folder, resource_type: 'auto' }, (error, result) => error || !result ? reject(error ?? new Error('Cloudinary upload failed')) : resolve({ secure_url: result.secure_url, public_id: result.public_id })).end(buffer));
}
export const deleteAsset = (publicId: string) => cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
