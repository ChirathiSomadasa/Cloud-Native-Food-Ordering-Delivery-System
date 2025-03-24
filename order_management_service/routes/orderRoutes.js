const express = require('express');
const { placeOrder, getOrder, getOrdersForRestaurant, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

// router.post('/', verifyToken, verifyRole(['customer']), placeOrder);
// router.get('/:id', verifyToken, verifyRole(['customer', 'restaurantAdmin']), getOrder);
// router.get('/', verifyToken, verifyRole(['restaurantAdmin']), getOrdersForRestaurant);
// router.put('/:id/status', verifyToken, verifyRole(['restaurantAdmin']), updateOrderStatus);
// router.delete('/:id', verifyToken, verifyRole(['customer']), cancelOrder);

router.post('/', placeOrder);//place a order
router.get('/:id', getOrder);//get specific order by orderid
router.get('/restaurant', getOrdersForRestaurant);//get specific order by restuarentid
router.put('/:id/status', updateOrderStatus);//update status
router.delete('/:id', cancelOrder);//cancel the order

module.exports = router;
