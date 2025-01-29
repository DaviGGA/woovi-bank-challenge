import { connectDatabase, disconnectDatabase } from "../server/config/db";
import { Account } from "../server/modules/account/AccountModel";
import { Transaction } from "../server/modules/transaction/TransactionModel";

async function run () {

  await connectDatabase();

  const [davi, miguel, system] = await Account.create([
    {
      name: "Davi",
      cpf: "128.042.680-20"
    },
    {
      name: "miguel",
      cpf: "536.861.120-00"
    },
    {
      name: "System",
      cpf: "166.227.190-55"
    }
  ])

  await Transaction.create([
    {
      senderId: system._id,
      receiverId: davi._id,
      type: "d",
      amount: 100
    },
    {
      senderId: system._id,
      receiverId: miguel._id,
      type: "d",
      amount: 100
    }, 
    {
      senderId: system._id,
      receiverId: davi._id,
      type: "c",
      amount: 100
    },
    {
      senderId: system._id,
      receiverId: miguel._id,
      type: "c",
      amount: 100
    },
  ])

  await disconnectDatabase();

  process.exit()
}

run();