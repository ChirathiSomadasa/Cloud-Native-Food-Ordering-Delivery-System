const express = require('express');
const { placeOrder, getOrder, getOrdersForRestaurant, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', verifyToken, verifyRole(['customer']), placeOrder);//checked
router.get('/:id', verifyToken, verifyRole(['customer', 'restaurantAdmin']), getOrder);//checked
// router.get('/', verifyToken, verifyRole(['restaurantAdmin']), getOrdersForRestaurant);
router.put('/:id/status', verifyToken, verifyRole(['restaurantAdmin']), updateOrderStatus);//checked
router.delete('/:id', verifyToken, verifyRole(['customer']), cancelOrder);//checked


module.exports = router;
