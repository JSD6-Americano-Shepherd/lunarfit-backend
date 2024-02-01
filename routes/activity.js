import express from "express";
import databaseClient from "../configs/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";
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
activityRouter.get("/", (req, res) => res.send("This is routeractivity "));

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

export default activityRouter;
