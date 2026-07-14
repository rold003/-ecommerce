import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Los routers de los siguientes módulos (productos, carrito, pedidos...) se montarán
// aquí a medida que se desarrollen: router.use('/products', productRoutes);

export default router;
