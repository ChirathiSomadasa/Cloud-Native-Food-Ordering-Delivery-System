const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConfig');
const { PORT } = require('./config/envConfig');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());




// Connect to the database and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start the server:', err.message);
});


// Routes
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/payment', paymentRoutes);