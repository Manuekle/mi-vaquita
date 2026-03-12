import { Router } from 'express';
import { turnoController } from '../controllers/turnoController.js';

const router = Router();

router.get('/actual', turnoController.obtenerActual);
router.get('/proximo', turnoController.obtenerProximo);
router.post('/avanzar', turnoController.avanzar);

export default router;
