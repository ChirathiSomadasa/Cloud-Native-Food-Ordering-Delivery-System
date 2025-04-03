const Payment = require('../models/Payment');


// Create new payment
const createPayment = async (req, res) => {
    try {
        const { orderId, amount, customerEmail, customerName } = req.body;
            
        const newPayment = new Payment({
            orderId,
            amount,
            customerEmail,
            customerName
        });

        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
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




module.exports = {
    createPayment,
    getPayment,
    updatePaymentStatus,
    initializeOnlinePayment,
    handlePaymentNotification
};