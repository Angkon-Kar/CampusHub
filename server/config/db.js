import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Requirement: Arrow Function + Destructuring from process.env
export const connectDB = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is missing in .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    const { host } = conn.connection;
    console.log(`✅ [PID: ${process.pid}] MongoDB Connected: ${host}`);
  } catch (error) {
    const { message } = error;
    console.error(`❌ MongoDB Connection Error: ${message}`);
    process.exit(1);
  }
};
