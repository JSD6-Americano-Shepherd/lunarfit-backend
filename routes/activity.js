import express from "express";
import databaseClient from "../configs/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";
import authenticateToken from "../middlewares/authenticatetoken.js";
import { ObjectId } from "mongodb";
import { calculateDuration } from "../utils/calDuration.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
const activityRouter = express.Router();
const ACTIVITY_DATA_KEYS = [
  "type",
  "name",
  "date",
  "start",
  "end",
  "note",
  "image",
  "duration",
  "year",
  "month",
  "day",
  "userId",
];

activityRouter.get("/", authenticateToken, async (req, res) => {
  const { email } = req.data.user;
  const userData = await databaseClient
    .db()
    .collection("users")
    .findOne({ email });
  const userId = userData._id;
  const activityData = await databaseClient
    .db()
    .collection("activities")
    .find({ userId: new ObjectId(userId) }) // Add a query filter to select documents where userId is "01"
    .toArray();
  res.json(activityData);
});

activityRouter.post("/", authenticateToken, async (req, res) => {
  const { email } = req.data.user;
  const { image } = req.body;
  let activity = req.body;

  const userData = await databaseClient
    .db()
    .collection("users")
    .findOne({ email });

  const userId = userData._id;
  const duration = calculateDuration(activity.start, activity.end).toString();

  const [year, month, day] = activity.date.split("-").map(Number);
  console.log("Duration: ", duration);
  console.log(year, month, day);

  const sumActivity = {
    ...activity,
    duration: duration,
    year: year.toString(),
    month: month.toString(),
    day: day.toString(),
    userId: new ObjectId(userId),
  };
  const [isBodyChecked, missingFields] = checkMissingField(
    ACTIVITY_DATA_KEYS,
    sumActivity
  );

  if (!isBodyChecked) {
    res.send(`Missing Fields: ${"".concat(missingFields)}`);
    return;
  }
  const cloudinaryResult = await uploadToCloudinary(image);
  const imageUrl = cloudinaryResult.secure_url;
  sumActivity.image = imageUrl;
  await databaseClient.db().collection("activities").insertOne(sumActivity);
  res.send("Create activity data successfully");
});

activityRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Hello");
  try {
    const result = await databaseClient
      .db()
      .collection("activities")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Activity successfully deleted" });
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ message: "Error deleting activity" });
    throw error;
  }
});

export default activityRouter;
