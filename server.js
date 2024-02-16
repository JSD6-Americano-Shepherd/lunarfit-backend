import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import databaseClient from "./configs/database.mjs";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import logging from "morgan";
import authenticateToken from "./middlewares/authenticatetoken.js";
import apiRoute from "./api/api.js";

const PORT = process.env.PORT || 3000;

dotenv.config();
const webServer = express();

// const allowedOrigins = [
//   "http://localhost:5173/",
//   "https://lunarfit-frontend.vercel.app/",
// ];
// กำหนด cors options
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true, // อนุญาตให้ส่ง cookies และ headers ระหว่างโดเมน
// };

// ใช้ cors middleware โดยใช้ options ที่กำหนด
// webServer.use(cors(corsOptions));

webServer.use(
  cors({
    origin: true,
    credentials: true,
  })
);
webServer.use(express.json({ limit: "1gb" })); // for parsing application/json
webServer.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//webServer.use(helmet());
webServer.use(cookieParser());
webServer.use(morgan("dev"));
webServer.use(logging("combined"));

//  DATA_KEYS
const USER_DATA_KEYS = ["username", "password", "name", "age", "weight"];
const LOGIN_DATA_KEYS = ["username", "password"];

// server routes
webServer.use("/api", apiRoute);
webServer.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: errorMessage,
  });
});
// initilize web server
const currentServer = webServer.listen(PORT, () => {
  console.log(
    `DATABASE IS CONNECTED: NAME => ${databaseClient.db().databaseName}`
  );
  console.log(`SERVER IS ONLINE => server is live on port ${PORT}`);
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
