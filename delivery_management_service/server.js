const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConfig');
const { PORT } = require('./config/envConfig');
const deliveryRoutes = require('./routes/deliveryRoutes');
const driverRoutes = require('./routes/driverRoutes');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Pass io to routes via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', deliveryRoutes);

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinDeliveryRoom', (deliveryId) => {
    socket.join(deliveryId);
    console.log(`Client joined room: ${deliveryId}`);
  });

  socket.on('leaveDeliveryRoom', (deliveryId) => {
    socket.leave(deliveryId);
    console.log(`Client left room: ${deliveryId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/delivery', deliveryRoutes);
app.use('/driver', driverRoutes);

// Connect to the database and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start the server:', err.message);
});