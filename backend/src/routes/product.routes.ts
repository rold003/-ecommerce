import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate, authorize, optionalAuthenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  createProductSchema,
  listProductsSchema,
  productImageParamsSchema,
  productParamsSchema,
  updateProductSchema,
} from '../validators/product.validator';

const router = Router();

router.get('/', validate(listProductsSchema), productController.listProducts);
router.get('/search/autocomplete', productController.autocomplete);
router.get(
  '/admin',
  authenticate,
  authorize('ADMIN'),
  validate(listProductsSchema),
  productController.listProductsAdmin,
);
router.get('/:slug', optionalAuthenticate, productController.getProductBySlug);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createProductSchema),
  productController.createProduct,
);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateProductSchema),
  productController.updateProduct,
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(productParamsSchema),
  productController.deleteProduct,
);
router.delete(
  '/:id/images/:imageId',
  authenticate,
  authorize('ADMIN'),
  validate(productImageParamsSchema),
  productController.deleteProductImage,
);

export default router;
