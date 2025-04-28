const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `udeshiblsry@gmail.com`,
    pass: `angj nirw ayme jmgu`
  }
});


const sendOrderConfirmationEmail = (userEmail, orderDetails) => {
  // Create dynamic list of items from orderDetails
  const itemsList = orderDetails.map(item => `
    <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
  <tbody>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Order ID:</td>
      <td style="padding: 8px 0;">${item.orderId}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Customer ID:</td>
      <td style="padding: 8px 0;">${item.customerID}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Item Name:</td>
      <td style="padding: 8px 0;">${item.itemName}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Item Quantity:</td>
      <td style="padding: 8px 0;">${item.quantity}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Item Price:</td>
      <td style="padding: 8px 0;">LKR. ${item.price}</td>
    </tr>
  </tbody>
</table>



`).join('');

  const totalAmount = orderDetails.reduce((sum, item) => sum + item.totalPrice, 0);

  const mailOptions = {
    from: 'udeshiblsry@gmail.com',
    to: userEmail,
    subject: 'Order Confirmation - Thank you for your delicious order!',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h1 style="color:rgb(255, 204, 0); text-align: center;">FoodSprint</h1>
            <p style="font-size: 16px;">Dear Customer,</p>
            <p style="font-size: 16px;">Thank you for your order! We are preparing your food with love and care. Here are your order details:</p>
            <hr style="margin-top: 30px;">
            <h3 style="color: #555;text-align:center;"> Order Details</h3>
            <hr style="margin-top: 10px;">
            <ul style="list-style: none; padding: 0;">
                ${itemsList}
            </ul>

            <h2 style="color: rgb(255, 204, 0); margin-top: 20px;">Total: LKR.${totalAmount}</h2>

            <p style="margin-top: 30px;">We hope you enjoy your meal! 🍽️<br><strong>FoodSprint Team</strong></p>
            <hr style="margin-top: 30px;">
            <p style="font-size: 12px; color: #888;">If you have any questions, reply to this email or contact our support team.</p>
        </div>
    `
  };



  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendOrderConfirmationEmail;
