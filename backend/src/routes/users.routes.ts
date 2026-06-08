import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { permit } from '../middlewares/permit.middleware';

const router = Router();

router.use(authMiddleware);
router.use(permit('Administrador'));

router.get('/', UsersController.list);
router.get('/:id', UsersController.getById);
router.post('/', UsersController.create);
router.put('/:id', UsersController.update);
router.delete('/:id', UsersController.remove);

export default router;
