import { Router } from 'express';
import * as couponController from '../controllers/coupon.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { couponParamsSchema, createCouponSchema, updateCouponSchema } from '../validators/coupon.validator';

const router = Router();

// Los cupones no son de navegación pública (se aplican por código en el carrito),
// así que todo el CRUD queda restringido a administradores.
router.use(authenticate, authorize('ADMIN'));

router.get('/', couponController.listCoupons);
router.post('/', validate(createCouponSchema), couponController.createCoupon);
router.put('/:id', validate(updateCouponSchema), couponController.updateCoupon);
router.delete('/:id', validate(couponParamsSchema), couponController.deleteCoupon);

export default router;
