import { Router } from 'express';
import { pedidoController } from '../controllers/pedidoController.js';

const router = Router();

router.post('/', pedidoController.create);
router.get('/', pedidoController.getAll);
router.get('/:id', pedidoController.getById);
router.put('/:id/estado', pedidoController.updateEstado);

export default router;
