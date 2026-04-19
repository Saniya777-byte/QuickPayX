import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    virtualBalance: {
      type: Number,
      default: 10000,
    },
    portfolio: [
      {
        symbol: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        averagePrice: {
          type: Number,
          required: true,
        },
        currentPrice: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Investment", investmentSchema);
