import express from "express";
import authenticateToken from "../middlewares/authenticatetoken.js";
import databaseClient from "../configs/database.mjs";
import { ObjectId } from "mongodb";

const sumActivityRouter = express.Router();

//middleware authenticateToken
sumActivityRouter.get("/", authenticateToken, async (req, res) => {
  //same as const email = req.data.user.email
  const { email } = req.data.user;
  //databaseClient = connect to database
  const userData = await databaseClient
    .db()
    .collection("users")
    .findOne({ email });

  console.log(userData);

  const userId = userData._id;
//   res.send(userId);

  const sumActivity = await databaseClient
    .db()
    .collection("activities")
    .aggregate([
      {
        $match: { userId: new ObjectId(userId) },
      },
      {
        $group: {
          _id: { type: "$type" },
          activities: { $sum: 1 },
          totalDuration: { $sum: { $toInt: "$duration" } },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id.type",
          activities: 1,
          totalDuration: 1,
        },
      },
    ])
    .toArray();
    res.status(200).json(sumActivity);
});

export default sumActivityRouter;
