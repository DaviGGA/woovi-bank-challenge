import { redisClient } from "../../../config/redis";
import { Account, IAccount } from "../../account/AccountModel";
import { AmountNonPositive } from "../errors/AmountNonPositiveType";
import { SenderNotEnoughBalance } from "../errors/SenderNotEnoughBalanceType";
import { TransactionAccountsNotFound } from "../errors/TransactionAccountsNotFoundType";
import { TTransactionCreateInput } from "../inputs/TransactionCreateInput";
import { ITransaction, Transaction } from "../TransactionModel";
import { TransactionCreated } from "../TransactionCreateResultType"

type Input = {
  input: TTransactionCreateInput
}

type Result = TransactionCreated 
 | AmountNonPositive
 | TransactionAccountsNotFound
 | SenderNotEnoughBalance

export const transactionCreateResolver = async ({ input }: Input): Promise<Result> => {

  const foundIdempotencyId = await redisClient.get(input.idempotencyId);

  if(foundIdempotencyId) return input
  
  const isAmountNonPositive = input.amount <= 0
  if(isAmountNonPositive) {
    return {
      name: "AmountNonPositive",
      message: "The amount provided must be a positive number.",
      amount: input.amount
    }
  }

  // @Sib como garantir rollback das operações caso uma falhe sem transaction?

  const accounts = await Account.find({
    $or: [
      {_id: input.senderId},
      {_id: input.receiverId}
    ]
  }).populate("transactions")
  
  const sender = accounts
    .find(acc => acc._id.toString() === input.senderId);
  
  const receiver = accounts
    .find(acc => acc._id.toString() === input.receiverId);

  
  const accountsNotFound = !sender || !receiver
  if(accountsNotFound) {
    return {
      name: "TransactionAccountsNotFound",
      message: "One or more of the ids you provided didn't matched with any database account",
      senderFound: !!sender,
      receiverFound: !!receiver
    }
  }

  if(!senderHasEnoughMoney(sender, input.amount)) {
    return {
      name: "SenderNotEnoughBalance",
      message: "User doesn't have enough balance to finish this transaction",
      sender,
      amount: input.amount
    }
  }

  const [creditTransaction, debitTransaction] = await Transaction.create([
    {
      receiverId: input.receiverId,
      senderId: input.senderId,
      amount: input.amount,
      type: "c"
    },
    {
      receiverId: input.receiverId,
      senderId: input.senderId,
      amount: input.amount,
      type: "d"
    }
  ])

  await Account.findByIdAndUpdate(input.senderId, {
    balance: decrementBalance(sender, input.amount),
    transactions: [...sender.transactions, creditTransaction]
  }, {new: true})

  await Account.findByIdAndUpdate(input.receiverId, {
    balance: incrementBalance(receiver, input.amount),
    transactions: [...receiver.transactions, debitTransaction]
  })

  await redisClient.setEx(
    input.idempotencyId, 2, input.idempotencyId
  );

  return input;
}

const senderHasEnoughMoney = (account: IAccount, amount: number) => 
  account.balance > amount


const incrementBalance = (account: IAccount, amount: number) => 
  account.balance + amount;


const decrementBalance = (account: IAccount, amount: number) => 
  account.balance - amount;


