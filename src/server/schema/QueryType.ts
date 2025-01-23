import { GraphQLObjectType, GraphQLString } from "graphql";

export const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    hello: {
      type: GraphQLString,
    }
  }
})