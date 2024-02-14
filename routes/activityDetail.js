import express from "express";
import databaseClient from "../configs/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";
import authenticateToken from "../middlewares/authenticatetoken.js";
import { ObjectId } from "mongodb";
const activityDetailRouter = express.Router();

const ACTIVITY_DATA_KEYS = [
  "type",
  "name",
  "date",
  "start",
  "end",
  "note",
  "image",
  "email",
];

activityDetailRouter.get(
  "/:activityId",
  authenticateToken,
  async (req, res) => {
    const { email } = req.data.user; // Assuming authenticateToken attaches user info to req.user
    const { activityId } = req.params;

    try {
      // Convert activityId from string to ObjectId for the query
      const activityData = await databaseClient
        .db()
        .collection("activities")
        .findOne({ _id: new ObjectId(activityId), email }); // No .toArray() needed

      if (activityData) {
        res.json(activityData);
      } else {
        res
          .status(404)
          .send("Activity not found or you do not have permission to view it.");
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send("An error occurred while fetching the activity data.");
    }
  }
);

activityDetailRouter.patch(
  "/:activityId",
  authenticateToken,
  async (req, res) => {
    const { activityId } = req.params;
    const { email } = req.data.user; // Assuming authenticateToken middleware attaches user details to req.user
    const updateData = req.body; // The data to update the activity with

    try {
      // Convert activityId from string to ObjectId for the query
      const result = await databaseClient
        .db()
        .collection("activities")
        .updateOne(
          { _id: new ObjectId(activityId), email }, // Ensure the activity belongs to the user
          { $set: updateData } // Use $set operator to update the fields
        );

      if (result.matchedCount === 0) {
        // No document found to update
        res
          .status(404)
          .send(
            "Activity not found or you do not have permission to update it."
          );
      } else if (result.modifiedCount === 0) {
        // Document found but no changes made (possibly due to the update data being the same as the existing data)
        res.status(200).send("No changes were made to the activity.");
      } else {
        // Document updated successfully
        res.status(200).send("Activity updated successfully.");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while updating the activity.");
    }
  }
);

export default activityDetailRouter;
