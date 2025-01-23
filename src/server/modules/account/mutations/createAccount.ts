import { GraphQLFieldConfig, GraphQLNonNull } from "graphql";
import { CreateAccountInput } from "../inputs/CreateAccountInput";
import { CreateAccountResultType } from "../AccountType";

export const createAccount: GraphQLFieldConfig<any, any> = {
  type: CreateAccountResultType,
  args: {
    input: {
      type: new GraphQLNonNull(CreateAccountInput)
    } 
  },
}