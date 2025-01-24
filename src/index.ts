import { app } from "./server/app";
import http from "http";
import { connectDatabase } from "./server/config/db";
import { connectToRedis } from "./server/config/redis";

const server = http.createServer(app.callback());

connectDatabase();
connectToRedis();

server.listen(4000, () => console.log("Server running at port 4000"));