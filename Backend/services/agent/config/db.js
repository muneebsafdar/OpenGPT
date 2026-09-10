import mongoose from "mongoose";
import "dotenv/config";

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default conn;