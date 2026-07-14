import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  addItemSchema,
  applyCouponSchema,
  cartItemParamsSchema,
  updateItemSchema,
} from '../validators/cart.validator';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/items', validate(addItemSchema), cartController.addItem);
router.patch('/items/:productoId', validate(updateItemSchema), cartController.updateItemQuantity);
router.delete('/items/:productoId', validate(cartItemParamsSchema), cartController.removeItem);
router.delete('/', cartController.clearCart);
router.post('/coupon', validate(applyCouponSchema), cartController.applyCoupon);
router.delete('/coupon', cartController.removeCoupon);

export default router;
