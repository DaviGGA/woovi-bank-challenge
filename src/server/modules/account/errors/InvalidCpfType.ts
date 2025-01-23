import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql/type";


export type InvalidCpf = {
  name: "InvalidCpf",
  message: "The provided cpf is not valid.",
  cpf: string
}

export const InvalidCpfType = new GraphQLObjectType<InvalidCpf>({
  name: "InvalidCpf",
  description: "Error that ocurres when someone tries to create a user with a invalid cpf",
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