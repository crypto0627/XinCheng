import { Hono } from 'hono';
import {
  deleteUser,
  updateUser
} from '../controllers/user.controller';
import { apiKeyAuth } from '../middleware/auth';

const router = new Hono();

// Public routes
router.post('/deleteUser', apiKeyAuth, deleteUser);
router.post('/updateUser', apiKeyAuth, updateUser);

export default router;
