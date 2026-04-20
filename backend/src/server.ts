import express from "express";
import mongoose from "mongoose";

const app = express();

app.get("/", (req, res) => {
  res.send("API is running ");
});

app.get("/test-db", async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    res.json({ success: true, collections });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default app;