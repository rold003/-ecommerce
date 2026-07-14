import multer, { FileFilterCallback } from 'multer';
import type { Request } from 'express';
import { AppError } from '../utils/AppError';

const storage = multer.memoryStorage();

function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  if (!file.mimetype.startsWith('image/')) {
    cb(new AppError('Solo se permiten archivos de imagen', 400));
    return;
  }
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
