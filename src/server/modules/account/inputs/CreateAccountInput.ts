import { GraphQLInputObjectType, GraphQLString } from "graphql";


export type TCreateAccountInput = {
  name: string,
  cpf: string
}

export const CreateAccountInput = new GraphQLInputObjectType({
  name: 'CreateAccountInput',
  fields: {
     name: {
       type: GraphQLString,
     },
     cpf: {
       type: GraphQLString,
     },
  },
});