import { GraphQLFieldConfig, GraphQLNonNull } from "graphql";
import { TransactionCreateInput } from "../inputs/TransactionCreateInput";
import { TransactionCreatedResultType } from "../TransactionCreateResultType";

export const transactionCreate: GraphQLFieldConfig<any, any> = {
  type: TransactionCreatedResultType,
  args: {
    input: {
      type: new GraphQLNonNull(TransactionCreateInput)
    } 
  },
}

