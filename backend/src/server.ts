import * as dotenv from "dotenv";
import app from "./app";
import { prisma } from "./lib/prisma";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Connecting to DB...");
    await prisma.$connect();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();