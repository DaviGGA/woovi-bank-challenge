import { accountResolvers } from "../modules/account/resolvers/accountResolvers";
import { transactionResolvers } from "../modules/transaction/resolvers/transactionResolvers";

export const resolvers = {
  ...accountResolvers,
  ...transactionResolvers
}