import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    category: {
      type: String,
      enum: ['food', 'bills', 'travel', 'shopping', 'entertainment', 'health', 'education', 'transfer', 'other'],
      default: 'other',
    },
    description: {
      type: String,
      default: '',
    },
    isSuspicious: {
      type: Boolean,
      default: false,
    },
    fraudReason: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);