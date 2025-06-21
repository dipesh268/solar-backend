
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas connection string format
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://dlocal:dipesh123@cluster0.5j7ylqw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
