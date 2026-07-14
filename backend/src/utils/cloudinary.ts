import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

export const cloudinaryConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

interface UploadResult {
  url: string;
  publicId: string;
}

export function uploadImageBuffer(buffer: Buffer, folder: string): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ width: 1600, height: 1600, crop: 'limit' }] },
      (error, result) => {
        if (error || !result) {
          reject(error instanceof Error ? error : new Error('Error subiendo imagen a Cloudinary'));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

export function deleteImageByPublicId(publicId: string): Promise<unknown> {
  return cloudinary.uploader.destroy(publicId);
}
