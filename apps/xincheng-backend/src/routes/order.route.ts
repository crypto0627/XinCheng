import { Hono } from 'hono';
import { apiKeyAuth } from '../middleware/auth';
import { 
  orderProduct, 
  orderStatus, 
  orderCheck, 
  updateOrderStatus, 
  getOrderDetails, 
  getAllOrders, 
  getRevenue 
} from '../controllers/order.controller';

const router = new Hono();

router.post('/orderProduct', apiKeyAuth, orderProduct);
router.post('/orderStatus', apiKeyAuth, orderStatus);

router.post('/orderCheck', apiKeyAuth, orderCheck);

// 新增的商家訂單管理API
router.post('/updateOrderStatus', apiKeyAuth, updateOrderStatus);
router.post('/getOrderDetails', apiKeyAuth, getOrderDetails);
router.post('/getAllOrders', apiKeyAuth, getAllOrders);
router.post('/getRevenue', apiKeyAuth, getRevenue);

export default router;
