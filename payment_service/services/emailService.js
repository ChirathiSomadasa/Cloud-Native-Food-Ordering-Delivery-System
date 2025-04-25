const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `mrt2001201@gmail.com`,
    pass: `efvs djyh lgha vctm`,
  },
});

const sendPaymentConfirmation = async (userEmail, paymentDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Payment Confirmation - Food Ordering System",
      html: `
                <h2>Payment Confirmation</h2>
                <p>Thank you for your payment!</p>
                <h3>Payment Details:</h3>
                <ul>
                    <li>Order ID: ${paymentDetails.restaurantOrderId}</li>
                    <li>Amount: ${paymentDetails.amount} ${
        paymentDetails.currency
      }</li>
                    <li>Payment Date: ${new Date(
                      paymentDetails.paidAt
                    ).toLocaleString()}</li>
                    <li>Transaction ID: ${paymentDetails.paypalOrderId}</li>
                </ul>
                <p>This is an automated email. Please do not reply.</p>
            `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = {
  sendPaymentConfirmation,
};
