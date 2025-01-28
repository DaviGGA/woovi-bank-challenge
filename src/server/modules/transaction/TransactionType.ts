import { GraphQLFloat, GraphQLObjectType, GraphQLString, GraphQLUnionType } from "graphql";
import { ITransaction } from "./TransactionModel";

export const TransactionType = new GraphQLObjectType<ITransaction>({
  name: "Transaction",
  description: "Transaction of the user",
  fields: () => ({
    _id: {
      type: GraphQLString
    },
    receiverId: {
      type: GraphQLString
    },
    senderId: {
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

