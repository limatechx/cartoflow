import { Router } from 'express';
import { ServicesController } from '../controllers/services.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { permit } from '../middlewares/permit.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', ServicesController.list);
router.get('/:id', ServicesController.getById);
router.post('/', ServicesController.create);
router.put('/:id', ServicesController.update);
router.delete('/:id', permit('Administrador'), ServicesController.remove);

export default router;
