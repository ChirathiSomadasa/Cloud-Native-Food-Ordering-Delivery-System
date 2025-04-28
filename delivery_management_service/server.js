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

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Attach io to each request (optional but useful)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// WebSocket logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinRoom', (deliveryId) => {
    socket.join(deliveryId);
    console.log(`Socket ${socket.id} joined room ${deliveryId}`);
  });

  socket.on('leaveRoom', (deliveryId) => {
    socket.leave(deliveryId);
    console.log(`Socket ${socket.id} left room ${deliveryId}`);
  });
});

// Routes

app.use('/delivery', deliveryRoutes);
app.use('/driver', driverRoutes);

// Start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start the server:', err.message);
});
