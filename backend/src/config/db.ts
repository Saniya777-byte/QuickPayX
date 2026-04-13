import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    console.log("✅ MongoDB Connected Successfully");
    console.log("Host:", conn.connection.host);
  } catch (error) {
    console.error("❌ DB Error:", error);
    process.exit(1);
  }
};