import mongoose from "mongoose";
import 'dotenv/config'

const conn = async () => {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("MongoDB connected");
}
export default conn;