import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/authRoutes";

app.use("/api/auth", authRoutes);

import userRoutes from "./routes/userRoutes";

app.use("/api/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("QuickPayX API running...");
});

export default app;