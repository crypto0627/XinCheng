import { Hono } from 'hono';
import { apiKeyAuth } from '../middleware/auth';
import { 
  orderProduct, 
  orderStatus,  
  updateOrderStatus, 
  getAllOrders
} from '../controllers/order.controller';

const router = new Hono();

router.post('/orderProduct', apiKeyAuth, orderProduct);
router.post('/orderStatus', apiKeyAuth, orderStatus);


// 新增的商家訂單管理API
router.post('/updateOrderStatus', apiKeyAuth, updateOrderStatus);
router.post('/getAllOrders', apiKeyAuth, getAllOrders);

export default router;
