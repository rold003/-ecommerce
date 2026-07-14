import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Los routers de cada módulo (auth, productos, carrito, pedidos...) se montarán aquí
// a medida que se desarrollen: router.use('/auth', authRouter);

export default router;
