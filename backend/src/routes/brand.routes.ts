import { Router } from 'express';
import * as brandController from '../controllers/brand.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { brandParamsSchema, createBrandSchema, updateBrandSchema } from '../validators/brand.validator';

const router = Router();

router.get('/', brandController.listBrands);
router.get('/:slug', brandController.getBrandBySlug);

router.post('/', authenticate, authorize('ADMIN'), validate(createBrandSchema), brandController.createBrand);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateBrandSchema),
  brandController.updateBrand,
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(brandParamsSchema),
  brandController.deleteBrand,
);

export default router;
