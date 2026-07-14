import { Router } from 'express';
import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import brandRoutes from './brand.routes';
import cartRoutes from './cart.routes';
import categoryRoutes from './category.routes';
import couponRoutes from './coupon.routes';
import favoriteRoutes from './favorite.routes';
import orderRoutes from './order.routes';
import productRoutes from './product.routes';
import { productReviewRouter, reviewRouter } from './review.routes';
import uploadRoutes from './upload.routes';
import userRoutes from './user.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/products/:productId/reviews', productReviewRouter);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/uploads', uploadRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRouter);
router.use('/favorites', favoriteRoutes);
router.use('/coupons', couponRoutes);
router.use('/admin', adminRoutes);

export default router;
