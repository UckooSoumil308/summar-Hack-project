import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables early
dotenv.config();

/**
 * Connects to the local MongoDB instance.
 * Exits the process if the connection fails to prevent agentic pipeline execution without a database.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[ DATABASE ] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[ DATABASE ] Connection failed: ${error.message}`);
    process.exit(1);
  }
};
