import mongoose, { Model } from "mongoose";

export type IAccount = {
  name: string,
  cpf: string,
  balance: number,
  createdAt: Date,
	updatedAt: Date
} & Document

const Schema = new mongoose.Schema<IAccount>(
  {
    name: {
      type: String,
      description: "The name of the account owner."
    },
    cpf: {
      type: String,
      description: "CPF document of the account owner"
    },
    balance: {
      type: Number,
      default: 1000, // starting with 1k for test purposes
      description: "Amount of cash this user has in his account",
    }
  },
  {
    collection: "Account",
    timestamps: true
  }
)

export const Account:Model<IAccount> = mongoose.model('Account', Schema);

