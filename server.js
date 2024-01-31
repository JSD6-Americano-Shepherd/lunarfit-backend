import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import databaseClient from "./configs/database.mjs";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import logging from "morgan";
import { checkMissingField } from "./utils/requestUtils.js";



const HOSTNAME = process.env.SERVER_IP || "127.0.0.1";
const PORT = process.env.SERVER_PORT || 3000;

dotenv.config();
const webServer = express();
webServer.use(cors());
webServer.use(express.json()); // for parsing application/json
webServer.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
webServer.use(helmet());
webServer.use(cookieParser());
webServer.use(morgan("dev"));
webServer.use(logging("tiny"));





//  DATA_KEYS
const USER_DATA_KEYS = ["username", "password", "name", "age", "weight"];
const LOGIN_DATA_KEYS = ["username", "password"];

// server routes
webServer.get("/", (req, res) => res.send("This is Lunarfit"));





// initilize web server
const currentServer = webServer.listen(PORT, HOSTNAME, () => {
    console.log(
        `DATABASE IS CONNECTED: NAME => ${databaseClient.db().databaseName}`
    );
    console.log(`SERVER IS ONLINE => http://${HOSTNAME}:${PORT}`);
});

const cleanup = () => {
    currentServer.close(() => {
        console.log(
            `DISCONNECT DATABASE: NAME => ${databaseClient.db().databaseName}`
        );
        try {
            databaseClient.close();
        } catch (error) {
            console.error(error);
        }
    });
};

// cleanup connection such as database
process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);