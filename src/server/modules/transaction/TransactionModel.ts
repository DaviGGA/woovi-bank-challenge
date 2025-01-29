import mongoose, { Model, ObjectId } from "mongoose";

export type ITransaction = {
  receiverId: ObjectId,
  senderId: ObjectId,
  type: "c" | "d",
  amount: number,
  createdAt: Date,
	updatedAt: Date
} & Document

const Schema = new mongoose.Schema<ITransaction>(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: String,
      enum: ["c", "d"],
      required: true
    },
    amount: {
      type: Number,
      description: "",
      required: true
    }
  },
  {
    collection: "Transaction",
    timestamps: true
  }
)

export const Transaction: Model<ITransaction> = mongoose.model('Transaction', Schema);

