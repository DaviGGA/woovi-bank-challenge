import { GraphQLFieldConfig, GraphQLNonNull } from "graphql";
import { CreateTransactionInput } from "../inputs/CreateTransactionInput";
import { TransactionResultType, TransationType } from "../TransactionType";

export const createTransaction: GraphQLFieldConfig<any, any> = {
  type: TransactionResultType,
  args: {
    input: {
      type: new GraphQLNonNull(CreateTransactionInput)
    } 
  },
}

