const Payment = require('../models/Payment');
const axios = require('axios');




// Create new payment 
const createPayment = async (req, res) => {
    try {
        const { orderId, amount, restaurantId, paymentMethod } = req.body;

        // Validate order, user, and restaurant existence
        // const orderResponse = await axios.get(`http://localhost:5003/api/order/${orderId}`);
        // const userResponse = await axios.get(`http://localhost:5001/api/user/${customerId}`);
        // const restaurantResponse = await axios.get(`http://localhost:5002/api/restaurants/${restaurantId}`);

        // if (!orderResponse.data || !userResponse.data || !restaurantResponse.data) {
        //     return res.status(400).json({ error: 'Invalid order, user, or restaurant data' });
        // }
        
        if (!restaurantId || !orderId || !paymentMethod || !amount) {
            return res.status(400).json({ error: "Invalid order data" });
        }

        const customerId = req.user?.id; // Ensure req.user exists
        if (!customerId) {
            return res.status(401).json({ error: "Unauthorized - No customer ID" });
        }

        const newPayment = new Payment({
            orderId,
            amount,
            customerId,
            restaurantId,
            paymentMethod,
            status: 'pending'
        });

        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
        // console.error('Error creating payment:', error.message); // Log the error for debugging
    }
};


// Get payment by ID
const getPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update payment status
const updatePaymentStatus = async (req, res) => {
    try {
        const { status, paymentReference } = req.body;
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status, paymentReference },
            { new: true }
        );
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Initialize online payment
const initializeOnlinePayment = async (req, res) => {
    try {
        const { orderId, amount, customerEmail, customerName } = req.body;

        // Example PayHere configuration (replace with your payment gateway)
        const paymentConfig = {
            merchant_id: process.env.PAYMENT_MERCHANT_ID,
            return_url: process.env.PAYMENT_RETURN_URL,
            cancel_url: process.env.PAYMENT_CANCEL_URL,
            notify_url: process.env.PAYMENT_NOTIFY_URL,
            order_id: orderId,
            items: "Order Payment",
            amount: amount,
            currency: "LKR",
            first_name: customerName,
            email: customerEmail,
            phone: "0771234567", // You might want to add this to your form
            address: "Customer Address", // You might want to add this to your form
            city: "Colombo", // You might want to add this to your form
            country: "Sri Lanka",
        };

        // Generate payment URL (this will depend on your payment gateway)
        const paymentUrl = generatePaymentGatewayUrl(paymentConfig);

        res.json({ 
            paymentUrl,
            orderId 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Handle payment notification
const handlePaymentNotification = async (req, res) => {
    try {
        const { order_id, payment_id, status } = req.body;

        // Verify payment signature/hash from payment gateway
        if (verifyPaymentSignature(req.body)) {
            // Update payment status in database
            await Payment.findOneAndUpdate(
                { orderId: order_id },
                { 
                    status: status === 'success' ? 'completed' : 'failed',
                    paymentReference: payment_id
                }
            );

            res.json({ status: 'success' });
        } else {
            res.status(400).json({ status: 'invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const fetchOrderAndCustomerDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Fetch order details
        const orderResponse = await axios.get(`http://localhost:5003/api/order/${orderId}`);
        const order = orderResponse.data;

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Fetch customer details using customerId from the order
        const customerResponse = await axios.get(`http://localhost:5001/api/user/${order.customerId}`);
        const customer = customerResponse.data;

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Return order and customer details
        res.json({
            orderId: order._id,
            customerName: customer.name,
            customerEmail: customer.email,
        });
    } catch (error) {
        console.error('Error fetching order or customer details:', error.message);
        res.status(500).json({ error: 'Error fetching order or customer details' });
    }
};


module.exports = {
    createPayment,
    getPayment,
    updatePaymentStatus,
    initializeOnlinePayment,
    handlePaymentNotification,
    fetchOrderAndCustomerDetails
};