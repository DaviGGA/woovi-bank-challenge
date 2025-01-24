import { redisClient } from "../../../config/redis";
import { Account, IAccount } from "../../account/AccountModel";
import { AmountNonPositive, AmountNonPositiveType } from "../errors/AmountNonPositiveType";
import { SenderNotEnoughBalance } from "../errors/SenderNotEnoughBalanceType";
import { TransactionAccountsNotFound } from "../errors/TransactionAccountsNotFoundType";
import { TCreateTransactionInput } from "../inputs/CreateTransactionInput";
import { ITransaction, Transaction } from "../TransactionModel";
import mongoose from "mongoose";

type Input = {
  input: TCreateTransactionInput
}

type Result = ITransaction 
 | AmountNonPositive
 | TransactionAccountsNotFound
 | SenderNotEnoughBalance

export const createTransactionResolver = async ({ input }: Input): Promise<Result> => {
  
  const isAmountNonPositive = input.amount <= 0
  if(isAmountNonPositive) {
    return {
      name: "AmountNonPositive",
      message: "The amount provided must be a positive number.",
      amount: input.amount
    }
  }

  const senderPromise = Account.findById(input.senderId);
  const receiverPromise = Account.findById(input.receiverId);

  const [sender, receiver] = await Promise.all([
    senderPromise, 
    receiverPromise
  ])

  const accountsNotFound = !sender || !receiver
  if(accountsNotFound) {
    return {
      name: "TransactionAccountsNotFound",
      message: "One or more of the ids you provided didn't matched with any database account",
      senderFound: !!sender,
      receiverFound: !!receiver
    }
  }


  // transaction e lenta trava tabela
  const session = await mongoose.startSession()
  session.startTransaction();

  if(!senderHasEnoughMoney(sender, input.amount)) {
    return {
      name: "SenderNotEnoughBalance",
      message: "User doesn't have enough balance to finish this transaction",
      sender,
      amount: input.amount
    }
  }

  try {
    receiver.balance = incrementBalance(receiver, input.amount);
    sender.balance = decrementBalance(sender, input.amount);

    await sender.save();
    await receiver.save();

    const transaction = await new Transaction({
      amount: input.amount,
      sender,
      receiver
    }).save()

    return transaction

  } catch (error) {
    await session.abortTransaction();
    throw error
  } finally {
    session.endSession()
  }

}

export const generateUniqueTransactionKey = (input: TCreateTransactionInput): string =>
  input.senderId + ":" + input.receiverId + ":" + input.amount 

const senderHasEnoughMoney = (account: IAccount, amount: number) => 
  account.balance > amount


const incrementBalance = (account: IAccount, amount: number) => 
  account.balance + amount;


const decrementBalance = (account: IAccount, amount: number) => 
  account.balance - amount;


