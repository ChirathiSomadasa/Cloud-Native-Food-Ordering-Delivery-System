const Payment = require('../models/Payment');
const crypto = require('crypto');

const paymentController = {

    // Initialize payment
    initiatePayment: async (req, res) => {
        try {
            const {
                amount,
                customerEmail,
                customerName,
                orderId
            } = req.body;

            // Create new payment record
            const payment = new Payment({
                orderId,
                amount,
                customerEmail,
                customerName
            });

            await payment.save();

            // PayHere payment configuration
            const merchantId = process.env.PAYHERE_MERCHANT_ID;
            const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
            
            const paymentData = {
                merchant_id: merchantId,
                return_url: 'https://yoursite.com/payment/success',
                cancel_url: 'https://yoursite.com/payment/cancel',
                notify_url: 'https://yoursite.com/payment/notify',
                order_id: orderId,
                items: 'Payment for Order',
                amount: amount,
                currency: 'LKR',
                first_name: customerName,
                email: customerEmail
            };

            res.json({
                status: 'success',
                data: paymentData,
                payment_url: 'https://sandbox.payhere.lk/pay/checkout' // Use 'https://www.payhere.lk/pay/checkout' for production
            });

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    validatePayment: async (req, res, next) => {
        try {
            const { amount, customerEmail, customerName, orderId } = req.body;
            
            if (!amount || !customerEmail || !customerName || !orderId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing required fields'
                });
            }

            if (amount <= 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid amount'
                });
            }

            next();
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Handle PayHere notification
    handleNotification: async (req, res) => {
        try {
            const {
                merchant_id,
                order_id,
                payment_id,
                payhere_amount,
                payhere_currency,
                status_code,
                md5sig
            } = req.body;

            // Verify PayHere signature
            const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
            const localMd5Sig = crypto
                .createHash('md5')
                .update(
                    merchant_id + 
                    order_id + 
                    payhere_amount + 
                    payhere_currency + 
                    status_code + 
                    merchantSecret
                )
                .digest('hex')
                .toUpperCase();

            if (localMd5Sig !== md5sig) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid signature'
                });
            }

            // Update payment status
            const payment = await Payment.findOne({ orderId: order_id });
            if (!payment) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Payment not found'
                });
            }

            payment.status = status_code === '2' ? 'completed' : 'failed';
            payment.paymentReference = payment_id;
            await payment.save();

            res.json({ status: 'success' });

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Get payment status
    getPaymentStatus: async (req, res) => {
        try {
            const { orderId } = req.params;
            const payment = await Payment.findOne({ orderId });

            if (!payment) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Payment not found'
                });
            }

            res.json({
                status: 'success',
                data: payment
            });

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

};

module.exports = paymentController;