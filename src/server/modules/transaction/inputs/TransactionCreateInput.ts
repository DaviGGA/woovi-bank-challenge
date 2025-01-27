import { GraphQLFloat, GraphQLInputObjectType, GraphQLString } from "graphql";

export type TTransactionCreateInput = {
  senderId: string,
  receiverId: string,
  amount: number,
  idempotencyId: string,
}

export const TransactionCreateInput = new GraphQLInputObjectType({
  name: 'TransactionCreateInput',
  fields: {
    senderId: {
      type: GraphQLString,
    },
    receiverId: {
      type: GraphQLString,
    },
    amount: {
      type: GraphQLFloat
    },
    idempotencyId: {
      type: GraphQLString
    }
  },
});