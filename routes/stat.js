import express from "express";
import databaseClient from "../configs/database.mjs";
import authenticateToken from "../middlewares/authenticatetoken.js";
import { ObjectId } from "mongodb";
const statRouter = express.Router();

statRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const { email } = req.data.user;
    const userData = await databaseClient
      .db()
      .collection("users")
      .findOne({ email });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userData._id;
    const activityData = await databaseClient
      .db()
      .collection("activities")
      .aggregate([
        {
          $match: { userId: new ObjectId(userId) },
        },
        {
          $group: {
            _id: { year: "$year", month: "$month", type: "$type" },
            activities: { $sum: 1 },
            totalDuration: { $sum: { $toInt: "$duration" } },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            type: "$_id.type",
            activities: 1,
            totalDuration: 1,
          },
        },
      ])
      .toArray();

    if (!activityData || activityData.length === 0) {
      return res.status(200).json({ message: "No data available" });
    }

    res.status(200).json(activityData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default statRouter;
