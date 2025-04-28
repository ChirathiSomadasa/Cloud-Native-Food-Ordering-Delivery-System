const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConfig');
const { PORT } = require('./config/envConfig');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const sendOrderConfirmationEmail = require('./services/emailService');


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/order',orderRoutes);
app.use('/api/cart', cartRoutes);

app.post('/api/email/send', (req, res) => {
  const { email, orderDetails } = req.body;

  if (!email) {
      return res.status(400).send('Email address is required.');
  }

  sendOrderConfirmationEmail(email, orderDetails);
  res.status(200).send('Order confirmation email sent.');
});


// Connect to the database and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start the server:', err.message);
});