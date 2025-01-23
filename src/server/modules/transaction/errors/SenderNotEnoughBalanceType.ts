import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql/type";
import { IAccount } from "../../account/AccountModel";
import { AccountType } from "../../account/AccountType";

export type SenderNotEnoughBalance = {
  name: "SenderNotEnoughBalance",
  message: "User doesn't have enough balance to finish this transaction",
  sender: IAccount,
  amount: number
}

export const SenderNotEnoughBalanceType = new GraphQLObjectType<SenderNotEnoughBalance>({
  name: "SenderNotEnoughBalance",
  description: "Error that ocurres when someone tries to send an amount greater than his balance.",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    message: {
      type: GraphQLString
    },
    sender: {
      type: AccountType
    },
    amount: {
      type: GraphQLFloat
    }
  })
})