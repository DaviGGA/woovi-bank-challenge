import Koa from "koa"
import Router from "koa-router";
import bodyParser from 'koa-bodyparser';
import { graphqlHTTP } from 'koa-graphql';
import { schema } from "./schema/schema";
import { resolvers } from "./schema/resolvers";
import logger from "koa-logger";

const app = new Koa();
const router = new Router();

router.all(
  "/graphql",
  graphqlHTTP(() => ({
    schema,
    graphiql: true,
    rootValue: resolvers,
  }))
)

app.use(logger());
app.use(bodyParser());
app.use(router.routes());

export { app }