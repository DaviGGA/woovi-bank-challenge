import mongoose, { Model } from "mongoose";
import { IAccount } from "../account/AccountModel";

export type ITransaction = {
  receiver: IAccount,
  type: "c" | "d",
  amount: number,
  createdAt: Date,
	updatedAt: Date
} & Document

const Schema = new mongoose.Schema<ITransaction>(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      description: "User who is receiving the amount",
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

