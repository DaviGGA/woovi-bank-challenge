import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql/type";


export type AccountAlrealdyExist = {
  name: "AccountAlrealdyExist",
  message: "Alrealdy exists an account with this cpf",
  cpf: string
}

export const AccountAlrealdyExistType = new GraphQLObjectType<AccountAlrealdyExist>({
  name: "AccountAlrealdyExist",
  description: "Error that ocurres when someone tries to create a user with a cpf that alrealdy exists in the database.",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    message: {
      type: GraphQLString
    },
    cpf: {
      type: GraphQLString
    }
  })
})