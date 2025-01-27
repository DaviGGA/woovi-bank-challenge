import { GraphQLFieldConfig, GraphQLNonNull } from "graphql";
import { TransactionCreateInput } from "../inputs/TransactionCreateInput";
import { TransactionResultType } from "../TransactionType";

export const transactionCreate: GraphQLFieldConfig<any, any> = {
  type: TransactionResultType,
  args: {
    input: {
      type: new GraphQLNonNull(TransactionCreateInput)
    } 
  },
}

