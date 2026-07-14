import { Router } from 'express';
import authRoutes from './auth.routes';
import brandRoutes from './brand.routes';
import categoryRoutes from './category.routes';
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

// Los routers de los siguientes módulos (carrito, pedidos...) se montarán aquí a medida
// que se desarrollen: router.use('/cart', cartRoutes);

export default router;
