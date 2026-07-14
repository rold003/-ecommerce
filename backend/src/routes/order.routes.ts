import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  checkoutSchema,
  listOrdersSchema,
  orderParamsSchema,
  updateStatusSchema,
} from '../validators/order.validator';

const router = Router();

router.use(authenticate);

router.post('/checkout', validate(checkoutSchema), orderController.checkout);
router.get('/', validate(listOrdersSchema), orderController.listMyOrders);
router.get('/admin', authorize('ADMIN'), validate(listOrdersSchema), orderController.listAllOrders);
router.get('/:id', validate(orderParamsSchema), orderController.getOrder);
router.patch(
  '/:id/status',
  authorize('ADMIN'),
  validate(updateStatusSchema),
  orderController.updateOrderStatus,
);
router.post('/:id/cancel', validate(orderParamsSchema), orderController.cancelOrder);

export default router;
