const express = require('express');
const { placeOrder, getOrder, getOrdersForRestaurant,deleteOrderForRestaurant,
     updateOrderStatus, updateOrder,cancelOrder,getOrdersForCustomer,getRestaurantOrders,getNewOrderCount } = require('../controllers/orderController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Customer Order Routes
router.post('/add',verifyToken,verifyRole(['customer']), placeOrder);//checked
//router.get('/:id', verifyToken, verifyRole(['customer', 'restaurantAdmin']), getOrder);//checked
router.delete('/:id', verifyToken, verifyRole(['customer']), cancelOrder);//checked
router.get('/customer/orders', verifyToken, verifyRole(['customer']), getOrdersForCustomer); // Get all orders for a customer
router.put("/:id/update", verifyToken,verifyRole(['customer']), updateOrder);

// Restaurant Admin Routes
//router.get('/restaurant/:restaurantId', getOrdersForRestaurant);
router.put('/update-status/:orderId', verifyToken, verifyRole(['restaurantAdmin']), updateOrderStatus);//checked
router.get('/restaurant/:restaurantId', verifyToken, verifyRole(['restaurantAdmin']), getRestaurantOrders);
router.delete('/delete/:orderId', verifyToken, verifyRole(['restaurantAdmin']), deleteOrderForRestaurant);//checked
router.get('/new-count', verifyToken, verifyRole(['restaurantAdmin']),getNewOrderCount);

 


module.exports = router;
