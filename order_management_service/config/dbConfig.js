const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      dbName: "foodOrderDeliverydb",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 50000,
      // Set a larger pool size if you're handling many concurrent operations
      maxPoolSize: 50,
      // Keep trying to send operations for 5 seconds
      waitQueueTimeoutMS: 5000,
    };
    
    await mongoose.connect(process.env.MONGO_URL, options);
    console.log("Connected to database");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;