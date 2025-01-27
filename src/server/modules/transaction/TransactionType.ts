import { GraphQLFloat, GraphQLObjectType, GraphQLString, GraphQLUnionType } from "graphql";
import { ITransaction } from "./TransactionModel";
import { AccountType } from "../account/AccountType";
import { AmountNonPositiveType } from "./errors/AmountNonPositiveType";
import { TransactionAccountsNotFoundType } from "./errors/TransactionAccountsNotFoundType";
import { SenderNotEnoughBalanceType } from "./errors/SenderNotEnoughBalanceType";

export const TransationType = new GraphQLObjectType<ITransaction>({
  name: "Transaction",
  description: "Transaction of the user",
  fields: () => ({
    _id: {
      type: GraphQLString
    },
    receiverId: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    amount: {
      type: GraphQLFloat
    },
    createdAt: {
      type: GraphQLString,
      resolve: (transaction) => 
        transaction.createdAt ? 
        transaction.createdAt.toISOString() : null
    },
    updatedAt: {
      type: GraphQLString,
      resolve: 
        (transaction) => transaction.createdAt ? 
        transaction.updatedAt.toISOString() : null
    },
  })
})

export const TransactionResultType = new GraphQLUnionType({
  name: "TransactionResult",
  types: [
    TransationType,
    AmountNonPositiveType,
    TransactionAccountsNotFoundType,
    SenderNotEnoughBalanceType
  ],
  resolveType(value) {
  
    if(value.name === AmountNonPositiveType.name) {
      return AmountNonPositiveType.name
    }

    if(value.name === TransactionAccountsNotFoundType.name) {
      return TransactionAccountsNotFoundType.name
    }

    if(value.name === SenderNotEnoughBalanceType.name) {
      return SenderNotEnoughBalanceType.name
    }

    return TransationType.name

  }
})