import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { cloudinaryConfigured, uploadImageBuffer } from '../utils/cloudinary';

export const uploadProductImage = asyncHandler(async (req: Request, res: Response) => {
  if (!cloudinaryConfigured) {
    throw new AppError(
      'Cloudinary no está configurado en el servidor. Define CLOUDINARY_CLOUD_NAME, ' +
        'CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en el .env para habilitar la subida de imágenes.',
      503,
    );
  }
  if (!req.file) throw new AppError('No se envió ningún archivo', 400);

  const result = await uploadImageBuffer(req.file.buffer, 'ecommerce/productos');
  res.status(201).json({ status: 'success', data: result });
});
