import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql/type";


export type AmountNonPositive = {
  name: "AmountNonPositive",
  message: "The amount provided must be a positive number.",
  amount: number
}

export const AmountNonPositiveType = new GraphQLObjectType<AmountNonPositive>({
  name: "AmountNonPositive",
  description: "Error that ocurres when someone tries to give a negative value to another account",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    message: {
      type: GraphQLString
    },
    amount: {
      type: GraphQLFloat
    }
  })
})