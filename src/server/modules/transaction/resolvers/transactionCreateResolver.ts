import { redisClient } from "../../../config/redis";
import { Account, IAccount } from "../../account/AccountModel";
import { AmountNonPositive } from "../errors/AmountNonPositiveType";
import { SenderNotEnoughBalance } from "../errors/SenderNotEnoughBalanceType";
import { TransactionAccountsNotFound } from "../errors/TransactionAccountsNotFoundType";
import { TTransactionCreateInput } from "../inputs/TransactionCreateInput";
import { ITransaction, Transaction } from "../TransactionModel";
import mongoose from "mongoose";

type Input = {
  input: TTransactionCreateInput
}

type Result = ITransaction 
 | AmountNonPositive
 | TransactionAccountsNotFound
 | SenderNotEnoughBalance

export const transactionCreateResolver = async ({ input }: Input): Promise<Result> => {

  const foundIdempotencyId = await redisClient.get(input.idempotencyId);

  if(foundIdempotencyId) {
    return await Transaction
      .findOne({
        sender: {_id: input.senderId},
        receiver: {_id: input.receiverId},
        amount: input.amount
      })
      .populate("sender")
      .populate("receiver")
      .sort({createdAt: -1}) as ITransaction
  }
  
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

    await redisClient.setEx(
      input.idempotencyId, 2, input.idempotencyId
    );

    return transaction

  } catch (error) {
    await session.abortTransaction();
    throw error
  } finally {
    session.endSession()
  }

}

const senderHasEnoughMoney = (account: IAccount, amount: number) => 
  account.balance > amount


const incrementBalance = (account: IAccount, amount: number) => 
  account.balance + amount;


const decrementBalance = (account: IAccount, amount: number) => 
  account.balance - amount;


