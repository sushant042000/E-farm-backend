import { DATABASE_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}/${DATABASE_NAME}`);
    console.log(`MongoDB connected !! DB HOST :${connectionInstance.connection.host}`);

  } catch (error) {
    
    console.log(`\n Database connection failed`, error);
    process.exit(1);
  }
};

export default connectDB;
