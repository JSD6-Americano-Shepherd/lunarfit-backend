import express from "express";
import databaseClient from "../configs/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";
import authenticateToken from "../middlewares/authenticatetoken.js";
const activityRouter = express.Router();
const ACTIVITY_DATA_KEYS = [
  "userId",
  "type",
  "name",
  "date",
  "start",
  "end",
  "note",
  "image",
];

activityRouter.get("/", authenticateToken, async (req, res) => {
  const { email } = req.data.user;
  const activityData = await databaseClient
    .db()
    .collection("activities")
    .find({ email }) // Add a query filter to select documents where userId is "01"
    .toArray();
  res.json(activityData);
});

activityRouter.post("/", async (req, res) => {
  let activity = req.body;
  const [isBodyChecked, missingFields] = checkMissingField(
    ACTIVITY_DATA_KEYS,
    activity
  );

  if (!isBodyChecked) {
    res.send(`Missing Fields: ${"".concat(missingFields)}`);
    return;
  }

  await databaseClient.db().collection("activities").insertOne(activity);
  res.send("Create activity data successfully");
});

activityRouter.post("/", async (req, res) => {
  let body = req.body;
  const [isBodyChecked, missingFields] = checkMissingField(
    HEALTH_DATA_KEYS,
    body
  );
  if (!isBodyChecked) {
    res.send(`Missing Fields: ${"".concat(missingFields)}`);
    return;
  }

  body["user_id"] = new ObjectId(body.user_id);

  await databaseClient.db().collection("health-history").insertOne(body);
  res.send("Create health data successfully");
});

export default activityRouter;
