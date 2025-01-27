import { GraphQLInputObjectType, GraphQLString } from "graphql";


export type TAccountCreateInput = {
  name: string,
  cpf: string
}

export const AccountCreateInput = new GraphQLInputObjectType({
  name: 'AccountCreateInput',
  fields: {
     name: {
       type: GraphQLString,
     },
     cpf: {
       type: GraphQLString,
     },
  },
});