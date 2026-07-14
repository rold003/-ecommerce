import { Router } from 'express';
import authRoutes from './auth.routes';
import brandRoutes from './brand.routes';
import cartRoutes from './cart.routes';
import categoryRoutes from './category.routes';
import orderRoutes from './order.routes';
import productRoutes from './product.routes';
import uploadRoutes from './upload.routes';
import userRoutes from './user.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/uploads', uploadRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

// Los routers de los siguientes módulos (reseñas, favoritos, admin...) se montarán aquí
// a medida que se desarrollen: router.use('/reviews', reviewRoutes);

export default router;
