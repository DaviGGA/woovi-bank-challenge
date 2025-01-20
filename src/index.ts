import { app } from "./server/app";
import http from "http";

const server = http.createServer(app.callback());

server.listen(4000, () => console.log("Server running at port 4000"));
