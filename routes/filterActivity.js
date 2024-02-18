import express from "express";
import databaseClient from "../configs/database.mjs";
import authenticateToken from "../middlewares/authenticatetoken.js";
import { ObjectId } from "mongodb";

const filterActivity = express.Router();

filterActivity.post("/", authenticateToken, async (req, res) => {
  const { email } = req.data.user;
  const { month, day } = req.body;
  const userData = await databaseClient
    .db()
    .collection("users")
    .findOne({ email });
  console.log(month, day);
  const userId = userData._id;
  const query = {
    userId: new ObjectId(userId), // Ensure activities have a userId field that matches the ObjectId type
    month: month.toString(), // Ensure the month in the query matches the format stored in the database
    day: day.toString(), // Ensure the day in the query matches the format stored in the database
  };
  const activityData = await databaseClient
    .db()
    .collection("activities")
    .find(query)
    .toArray();
  res.json(activityData);
});

export default filterActivity;
