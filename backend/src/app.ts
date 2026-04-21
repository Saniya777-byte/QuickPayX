import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { prisma } from "./lib/prisma";

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

import analyticsRoutes from "./routes/analyticsRoutes";
app.use("/api/analytics", analyticsRoutes);

import savingsGoalRoutes from "./routes/savingsGoalRoutes";
app.use("/api/savings-goals", savingsGoalRoutes);

import investmentRoutes from "./routes/investmentRoutes";
app.use("/api/investment", investmentRoutes);

import financialInsightsRoutes from "./routes/financialInsightsRoutes";
app.use("/api/insights", financialInsightsRoutes);

import securityRoutes from "./routes/securityRoutes";
app.use("/api/security", securityRoutes);

import stockDataRoutes from "./routes/stockDataRoutes";
app.use("/api/stocks", stockDataRoutes);

import newsRoutes from "./routes/newsRoutes";
app.use("/api/news", newsRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

app.get("/test-db", async (req: Request, res: Response) => {
  try {
    await prisma.$connect();
    res.json({ status: 'connected' });
  } catch (error: any) {
    res.json({ status: 'disconnected', error: error.message });
  }
});

app.get("/prisma-users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.use(errorHandler);

export default app;