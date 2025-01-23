import mongoose, { Model } from "mongoose";
import { IAccount } from "../account/AccountModel";
import { Account } from "../account/AccountModel";

export type ITransaction = {
  sender: IAccount,
  receiver: IAccount,
  amount: number,
  createdAt: Date,
	updatedAt: Date
} & Document

const Schema = new mongoose.Schema<ITransaction>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      description: "User who is sending the amount"
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      description: "User who is receiving the amount"
    },
    amount: {
      type: Number,
      description: "",
    }
  },
  {
    collection: "Transaction",
    timestamps: true
  }
)

export const Transaction: Model<ITransaction> = mongoose.model('Transaction', Schema);

