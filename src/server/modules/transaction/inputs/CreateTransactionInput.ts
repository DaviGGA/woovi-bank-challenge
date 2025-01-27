import { GraphQLFloat, GraphQLInputObjectType, GraphQLString } from "graphql";

export type TCreateTransactionInput = {
  senderId: string,
  receiverId: string,
  amount: number,
  idempotencyId: string,
}

export const CreateTransactionInput = new GraphQLInputObjectType({
  name: 'CreateTransactionInput',
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