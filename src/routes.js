import { Router } from 'express';

import authMiddleware from './app/middleware/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const router = new Router();

router.post('/users', UserController.store);
router.post('/sessions', SessionController.store);

router.use(authMiddleware);
router.put('/users', UserController.uptade);

export default router;
