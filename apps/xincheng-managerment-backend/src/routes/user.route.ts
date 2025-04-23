import { Hono } from 'hono';
import { updateUser, deleteUSer } from '../controllers/user.controller';
import { apiKeyAuth } from '../middleware/auth';
import { ENV } from '../config/env.config';

const router = new Hono<{ Bindings: ENV }>();

// Public routes
router.post('/updateUser', apiKeyAuth, updateUser);
router.post('/deleteUser', apiKeyAuth, deleteUSer)

export default router;
