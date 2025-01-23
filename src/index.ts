import { app } from "./server/app";
import http from "http";
import { connectDatabase } from "./server/config/db";
import mongoose from "mongoose";
import { Account } from "./server/modules/account/AccountModel";


const server = http.createServer(app.callback());
connectDatabase()



server.listen(4000, () => console.log("Server running at port 4000"));
