import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql"

export type TransactionAccountsNotFound = {
  name: "TransactionAccountsNotFound",
  message: "One or more of the ids you provided didn't matched with any database account",
  senderFound: boolean,
  receiverFound: boolean
}

export const TransactionAccountsNotFoundType = new GraphQLObjectType<TransactionAccountsNotFound>({
  name: "TransactionAccountsNotFound",
  description: "This error occur when one or more of the accounts provided by the user was not found.",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    message: {
      type: GraphQLString,
    },  
    senderFound: {
      type: GraphQLBoolean
    },
    receiverFound: {
      type: GraphQLBoolean
    }
  })
})