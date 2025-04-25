const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Order = require("../../order_management_service/models/Order");
const axios = require("axios");
const { sendPaymentConfirmation } = require("../services/emailService");
const paypalClient = require("../config/paypalConfig");

mongoose.set("debug", true);

// Create new payment //check
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
      status: "pending",
    });

    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
    // console.error('Error creating payment:', error.message); // Log the error for debugging
  }
};

// Get payment by ID  //check
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.id });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
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
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// 8,@-YwE,
// PayPal  // check // Capture PayPal payment details and save to DB
// const capturePayPalDetails = async (req, res) => {
//     try {
//         console.log("Request Body:", req.body); // Log the incoming request body

//         const { paypalOrderId, restaurantOrderId, payerName, amount, currency, paymentDetails } = req.body;

//         if (!paypalOrderId || !restaurantOrderId || !payerName || !amount || !currency || !paymentDetails) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         // Find the corresponding order by PayPal orderId
//         console.log("Searching for order with restaurantOrderId:", restaurantOrderId);
//         const order = await Order.findOne({ _id: restaurantOrderId }).maxTimeMS(20000);
//         console.log("Order retrieved successfully:", order);

//         if (!order) {
//             console.error("Order not found for restaurantOrderId:", restaurantOrderId);
//             return res.status(404).json({ message: "Order not found", orderId: restaurantOrderId });
//         }

//         console.log("✅ Order found:", order._id);

//         const newPayment = new Payment({
//             customerId: req.user?.id, // This comes from the JWT
//             restaurantOrderId,//: order._id, // This is the order ID from the Order service
//             paypalOrderId, // This is the PayPal order ID
//             payerName,
//             amount,
//             currency,
//             paymentDetails,
//             paidAt: new Date(),
//         });

//         await newPayment.validate();
//         await newPayment.save();
//         console.log("💾 Payment saved successfully:", newPayment._id);
//         res.status(201).json({ message: "Payment recorded successfully" });
//     } catch (err) {
//         console.error("Error saving payment:", err);
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// };
const capturePayPalDetails = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const {
            paypalOrderId,
            restaurantOrderId,
            payerName,
            amount,
            currency,
            paymentDetails,
        } = req.body;

        if (
            !paypalOrderId ||
            !restaurantOrderId ||
            !payerName ||
            !amount ||
            !currency ||
            !paymentDetails
        ) {
            return res.status(400).json({ message: "❌ Missing required fields" });
        }

        // Find the corresponding order
        console.log("Searching for order with restaurantOrderId:", restaurantOrderId);
        
        // const order = await Order.findOne({ _id: restaurantOrderId }).maxTimeMS(20000);
        // console.log("Order retrieved successfully:", order);
        // if (!order) {
        //     console.error("❌ Order not found:", restaurantOrderId);
        //     return res.status(404).json({ message: "Order not found", orderId: restaurantOrderId });
        // }

        // Create and save payment
        const newPayment = new Payment({
            customerId: req.user?.id,
            restaurantOrderId,
            paypalOrderId,
            payerName,
            amount,
            currency,
            paymentDetails,
            paidAt: new Date(),
        });

        // await newPayment.validate();
        await newPayment.save();
        console.log("💾 Payment saved:", newPayment._id);

        // Attempt to fetch user email and send confirmation
        try {
            const userResponse = await axios.get(
                `http://localhost:5001/api/auth/me`,
                {
                    headers: { 
                        Authorization: `Bearer ${req.headers.authorization}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 5000 // Add a timeout
                }
            );

            // Add debug logging
            console.log("Token received in payment service:", req.headers.authorization);
            console.log("User response:", userResponse.data);

            if (!userResponse.data) {
                console.error("No data received from auth service");
                throw new Error('No data received from auth service');
            }
        
            if (!userResponse.data?.data?.email) {
                console.error("User data structure:", userResponse.data);
                throw new Error('Email not found in user data');
            }

            const userEmail = userResponse.data.data.email;

            const emailSent = await sendPaymentConfirmation(userEmail, {
                restaurantOrderId,
                amount,
                currency,
                paidAt: newPayment.paidAt,
                paypalOrderId,
            });

            if (!emailSent) {
                return res.status(201).json({
                    message: "✅ Payment recorded, but email notification failed",
                });
            }

            return res.status(201).json({
                message: "✅ Payment recorded and email sent successfully",
            });

        } catch (emailErr) {
            console.error("⚠️ Detailed error during email process:", {
                message: emailErr.message,
                response: emailErr.response?.data,
                status: emailErr.response?.status,
                headers: req.headers
            });
            return res.status(201).json({
                message: "✅ Payment recorded, but email notification failed",
                error: emailErr.message,
            });
        }
    } catch (err) {
        console.error("🔥 Server Error:", err.message);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
// PayPal - get all Paypal details
const getPayPalDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching PayPal details:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// not check, mot working
const createPayPalOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency || "USD",
            value: amount,
          },
        },
      ],
    });

    const order = await paypalClient.execute(request);
    res.status(201).json({ id: order.result.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const capturePayPalOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await paypalClient.execute(request);
    res.status(200).json({ status: "success", details: capture.result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// PayHere (Sri Lanka) - Online Payment Integration   // not check, not working
const initializeOnlinePayment = async (req, res) => {
  try {
    const { orderId, amount, customerEmail, customerName } = req.body;

    const paymentConfig = {
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      return_url: process.env.PAYMENT_RETURN_URL,
      cancel_url: process.env.PAYMENT_CANCEL_URL,
      notify_url: process.env.PAYMENT_NOTIFY_URL,
      order_id: orderId,
      items: "Order Payment",
      amount: amount,
      currency: "LKR",
      first_name: customerName,
      email: customerEmail,
      phone: "0771234567", // Optional
      address: "Customer Address", // Optional
      city: "Colombo", // Optional
      country: "Sri Lanka",
    };

    const paymentUrl = `https://sandbox.payhere.lk/pay/checkout?${new URLSearchParams(
      paymentConfig
    ).toString()}`;
    res.json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const handlePaymentNotification = async (req, res) => {
  try {
    const { order_id, status } = req.body;

    if (status === "success") {
      await Payment.findOneAndUpdate(
        { orderId: order_id },
        { status: "completed" }
      );
    } else {
      await Payment.findOneAndUpdate(
        { orderId: order_id },
        { status: "failed" }
      );
    }

    res.status(200).send("Notification processed");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  getPayment,
  updatePaymentStatus,

  // PayPal
  createPayPalOrder,
  capturePayPalOrder,
  capturePayPalDetails, //check
  getPayPalDetails,

  // PayHere
  initializeOnlinePayment,
  handlePaymentNotification,
};
