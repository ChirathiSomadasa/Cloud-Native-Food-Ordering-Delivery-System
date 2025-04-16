const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConfig');
const { PORT } = require('./config/envConfig');
const deliveryRoutes = require('./routes/deliveryRoutes');
const driverRoutes = require('./routes/driverRoutes');


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

global.io = io; // So you can use io in controllers if needed

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
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