import mongoose, { Model, ObjectId } from "mongoose";
import { IAccount } from "../account/AccountModel";

export type ITransaction = {
  receiverId: ObjectId,
  type: "c" | "d",
  amount: number,
  createdAt: Date,
	updatedAt: Date
} & Document

const Schema = new mongoose.Schema<ITransaction>(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
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

