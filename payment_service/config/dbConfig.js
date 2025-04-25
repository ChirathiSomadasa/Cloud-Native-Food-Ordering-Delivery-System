const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = { 
      dbName: "foodOrderDeliverydb", 
      serverSelectionTimeoutMS: 30000  
    }; 
    await mongoose.connect(process.env.MONGO_URL, options);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error; // Let the caller handle it
  }
};

module.exports = connectDB;
