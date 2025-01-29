import mongoose, { Model } from "mongoose";
import { ITransaction } from "../transaction/TransactionModel";

export type IAccount = {
  name: string,
  cpf: string,
  balance: number,
  createdAt: Date,
  transactions: ITransaction[],
	updatedAt: Date
} & Document

const Schema = new mongoose.Schema<IAccount>(
  {
    name: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 1000, // starting with 1k for test purposes
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        default: []
      }
    ]
  },
  {
    collection: "Account",
    timestamps: true
  }
)

export const Account:Model<IAccount> = mongoose.model('Account', Schema);

