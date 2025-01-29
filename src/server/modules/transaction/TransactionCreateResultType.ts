import { GraphQLFloat, GraphQLObjectType, GraphQLString, GraphQLUnionType } from "graphql"
import { AmountNonPositiveType } from "./errors/AmountNonPositiveType"
import { TransactionAccountsNotFoundType } from "./errors/TransactionAccountsNotFoundType"
import { SenderNotEnoughBalanceType } from "./errors/SenderNotEnoughBalanceType"

export type TransactionCreated = {
  senderId: string,
  receiverId: string,
  amount: number
}

export const TransactionCreatedType = new GraphQLObjectType<TransactionCreated>({
  name: "TransactionCreated",
  description: "Transaction of the user",
  fields: () => ({
    message: {
      type: GraphQLString,
      resolve: () => "Transaction was created successfully"
    },
    senderId: {
      type: GraphQLString,
    },
    receiverId: {
      type: GraphQLString,
    },
    amount: {
      type: GraphQLFloat
    }
    
  })
})

export const TransactionCreatedResultType = new GraphQLUnionType({
  name: "TransactionResult",
  types: [
    TransactionCreatedType,
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

    return TransactionCreatedType.name

  }
})