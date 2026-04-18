import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({
  origin: ['http://localhost:3005', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

import authRoutes from "./routes/authRoutes";

app.use("/api/auth", authRoutes);

import userRoutes from "./routes/userRoutes";

app.use("/api/user", userRoutes);

import walletRoutes from "./routes/walletRoutes";

app.use("/api/wallet", walletRoutes);

import transactionRoutes from "./routes/transactionRoutes";

app.use("/api/transaction", transactionRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("QuickPayX API running...");
});

app.use(errorHandler);

export default app;