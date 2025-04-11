import { Hono } from 'hono';
import {
  getUser,
  deleteUser
} from '../controllers/user.controller';
import { apiKeyAuth } from '../middleware/auth';

const router = new Hono();

// Public routes
router.post('/getUser', apiKeyAuth, getUser);
router.post('/deleteUser', apiKeyAuth, deleteUser);

export default router;
