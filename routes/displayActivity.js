import express from "express";
import authenticateToken from "../middlewares/authenticatetoken.js";
import databaseClient from "../configs/database.mjs";
import { ObjectId } from "mongodb";
const displayActivityRouter = express.Router();
displayActivityRouter.get("/", authenticateToken, async (req, res) => {
  try {
    // _id and year are extracted from the request
    const { email } = req.data.user;
    //databaseClient = connect to database
    const userData = await databaseClient
      .db()
      .collection("users")
      .findOne({ email });
    // console.log(userData);
    const userId = userData._id;
    //   res.send(userId);
    const currentYear = new Date().getFullYear();
    // Aggregate activities data using the provided aggregation pipeline
    const aggregatedData = await databaseClient
      .db()
      .collection("activities")
      .aggregate([
        {
          $match: { userId: userId, year: currentYear.toString },
        },
        {
          $group: {
            _id: { type: "$type", month: "$month" },
            totalDuration: { $sum: { $toInt: "$duration" } },
            frequency: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.type": 1, "_id.month": 1 },
        },
        {
          $group: {
            _id: "$_id.type",
            monthlyData: {
              $push: {
                month: "$_id.month",
                duration: "$totalDuration",
                frequency: "$frequency",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            type: "$_id",
            monthlyData: 1,
          },
        },
      ])
      .toArray();
    // Post-process the aggregated data to format durationData and frequencyData
    console.log(aggregatedData);
    const formattedResults = aggregatedData.map((result) => {
      let durationData = new Array(12).fill(0);
      let frequencyData = new Array(12).fill(0);
      result.monthlyData.forEach((monthData) => {
        // Convert month to a zero-based index
        let index = parseInt(monthData.month) - 1;
        durationData[index] = monthData.duration;
        frequencyData[index] = monthData.frequency;
      });
      return {
        type: result.type,
        durationData: durationData,
        frequencyData: frequencyData,
      };
    });
    // Send the formatted results as response
    res.status(200).json(formattedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
export default displayActivityRouter;
