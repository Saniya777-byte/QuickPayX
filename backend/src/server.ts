import * as dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// connectDB();

console.log("Connecting to DB...");
connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});