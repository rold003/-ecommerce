import { Router } from 'express';
import { uploadProductImage } from '../controllers/upload.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { uploadImage } from '../middlewares/upload';

const router = Router();

router.post('/image', authenticate, authorize('ADMIN'), uploadImage.single('image'), uploadProductImage);

export default router;
