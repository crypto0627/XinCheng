import { Hono } from 'hono';
import { apiKeyAuth } from '../middleware/auth';
import { orderProduct, orderStatus } from '../controllers/order.controller';

const router = new Hono();

// Public routes
router.post('/orderProduct', apiKeyAuth, orderProduct);
router.post('/orderStatus', apiKeyAuth, orderStatus);

export default router;
