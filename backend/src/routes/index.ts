import { Router } from 'express';
import productosRouter from './productos.js';
import pedidosRouter from './pedidos.js';
import turnosRouter from './turnos.js';

const router = Router();

router.use('/productos', productosRouter);
router.use('/pedidos', pedidosRouter);
router.use('/turnos', turnosRouter);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
