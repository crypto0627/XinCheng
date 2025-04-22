import { Hono } from 'hono';
import {
  getUser,
  deleteUser,
  updateUser
} from '../controllers/user.controller';
import { apiKeyAuth } from '../middleware/auth';

const router = new Hono();

// Public routes
router.post('/getUser', apiKeyAuth, getUser);
router.post('/deleteUser', apiKeyAuth, deleteUser);
router.post('/updateUser', apiKeyAuth, updateUser);

export default router;
