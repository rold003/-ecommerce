import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate, authorize, optionalAuthenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  categoryParamsSchema,
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.validator';

const router = Router();

router.get('/', optionalAuthenticate, categoryController.listCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createCategorySchema),
  categoryController.createCategory,
);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateCategorySchema),
  categoryController.updateCategory,
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(categoryParamsSchema),
  categoryController.deleteCategory,
);

export default router;
