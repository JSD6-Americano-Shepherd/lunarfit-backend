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

// const allowedOrigins = ["https://lunarfit-frontend.vercel.app/"];

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
webServer.use(express.json()); // for parsing application/json
webServer.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//webServer.use(helmet());
webServer.use(cookieParser());
webServer.use(morgan("dev"));
webServer.use(logging("combined"));

//  DATA_KEYS
const USER_DATA_KEYS = ["username", "password", "name", "age", "weight"];
const LOGIN_DATA_KEYS = ["username", "password"];

// server routes
webServer.get("/", authenticateToken, (req, res) => {
  const usersData = {
    id: 1,
    fullName: "Karin2",
    age: 25,
    weight: 65,
    height: 168,
    gender: "male",
    activity: [
      {
        type: "Run",
        time: "12:00 - 12:30 PM",
        name: "Run with dad",
        duration: "120",
      },
      {
        type: "Swim",
        time: "10:10 - 10:40 AM",
        name: "Swim with mom",
        duration: "30",
      },
      {
        type: "Walk",
        time: "6:00 - 7:00 PM",
        name: "Walk with dog",
        duration: "60",
      },
      {
        type: "Hike",
        time: "14:00 - 20:00 PM",
        name: "Hike with friend",
        duration: "500",
      },
      {
        type: "Bike",
        time: "14:00 - 20:00 PM",
        name: "Bike with brother",
        duration: "200",
      },
    ],
  };

  res.json(usersData);
});

webServer.use("/api", apiRoute);

webServer.get("/profile", authenticateToken, async (req, res) => {
  88;

  //console.log(req.user);

  const activityData = await databaseClient
    .db()
    .collection("activities")
    .find({ userId: "01" }) // Add a query filter to select documents where userId is "01"
    .toArray();
  res.json(activityData);

  console.log(`datauser: ${user}`);
  //res.json(user.email);
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
