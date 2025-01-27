import { GraphQLFieldConfig, GraphQLNonNull } from "graphql";
import { AccountCreateInput } from "../inputs/AccountCreateInput";
import { AccountCreateResultType } from "../AccountType";

export const accountCreate: GraphQLFieldConfig<any, any> = {
  type: AccountCreateResultType,
  args: {
    input: {
      type: new GraphQLNonNull(AccountCreateInput)
    } 
  },
}