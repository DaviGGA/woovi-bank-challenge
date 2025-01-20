import Koa from "koa"
import Router from "koa-router";
import bodyParser from 'koa-bodyparser';
import { createHandler } from "graphql-http/lib/use/koa"
import { buildSchema } from "graphql";
import { renderGraphiQL } from "@graphql-yoga/render-graphiql";

const app = new Koa();
const router = new Router();

const schema = buildSchema(`
  type Query {
    hello: String
  }  
`)

const resolvers = {
  hello: () => "Hello, GraphQL!"
}

router.all(
  "graphql",
  createHandler({
    schema,
    rootValue: resolvers
  })
)

app.use(bodyParser())
app.use(router.routes())

export { app }