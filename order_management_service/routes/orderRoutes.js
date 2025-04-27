const express = require('express');
const { placeOrder, 
     getOrder, 
     getOrdersForRestaurant,
     deleteOrderForRestaurant,
     updateOrderStatus, 
     updateOrder,
     cancelOrder,
     getOrdersForCustomer,
     getRestaurantOrders,
     getNewOrderCount } = require('../controllers/orderController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Customer Order Routes
//create new order
router.post('/add',verifyToken,verifyRole(['customer']), placeOrder);//checked
//router.get('/:id', verifyToken, verifyRole(['customer', 'restaurantAdmin']), getOrder);//checked
//delete order by customer
router.delete('/:id', verifyToken, verifyRole(['customer']), cancelOrder);//checked
//get orders by specific customer
router.get('/:customerId',  getOrdersForCustomer); 
//update order by customer
router.put("/:id/update", verifyToken,verifyRole(['customer']), updateOrder);

// Restaurant Admin Routes
//router.get('/restaurant/:restaurantId', getOrdersForRestaurant);
//update order status by restaurant admin
router.put('/update-status/:orderId', verifyToken, verifyRole(['restaurantAdmin']), updateOrderStatus);//checked
//get orders by specific restaurant admin
router.get('/restaurant/:restaurantId', verifyToken, verifyRole(['restaurantAdmin']), getRestaurantOrders);
//delete order by restaurant admin
router.delete('/delete/:orderId', verifyToken, verifyRole(['restaurantAdmin']), deleteOrderForRestaurant);//checked
router.get('/new-count', verifyToken, verifyRole(['restaurantAdmin']),getNewOrderCount);

 


module.exports = router;
