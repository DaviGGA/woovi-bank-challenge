import { GraphQLFloat, GraphQLObjectType, GraphQLString, GraphQLUnionType } from "graphql";
import { IAccount } from "./AccountModel";
import { InvalidCpfType } from "./errors/InvalidCpfType";
import { AccountAlrealdyExistType } from "./errors/AccountAlrealdyExistType";

export const AccountType = new GraphQLObjectType<IAccount>({
  name: "Account",
  description: "Bank account of the user",
  fields: () => ({
    _id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString,
    },
    cpf: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (account) => account.createdAt.toISOString()
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (account) => account.updatedAt.toISOString()
    },
  })
})

export const AccountCreateResultType = new GraphQLUnionType({
  name: "AccountCreateResult",
  types: [
    AccountType,
    InvalidCpfType,
    AccountAlrealdyExistType
  ],
  resolveType(value) {
  
    if(value.name === InvalidCpfType.name) {
      return InvalidCpfType.name
    }

    if(value.name === AccountAlrealdyExistType.name) {
      return AccountAlrealdyExistType.name
    }

    return AccountType.name
  }
})
