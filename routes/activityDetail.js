import express from "express";
import databaseClient from "../configs/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";
import authenticateToken from "../middlewares/authenticatetoken.js";
import { ObjectId } from "mongodb";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import { calculateDuration } from "../utils/calDuration.js";
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
    const userData = await databaseClient
      .db()
      .collection("users")
      .findOne({ email });

    const userId = userData._id;
    try {
      // Convert activityId from string to ObjectId for the query
      const activityData = await databaseClient
        .db()
        .collection("activities")
        .findOne({
          _id: new ObjectId(activityId),
          userId: new ObjectId(userId),
        }); // No .toArray() needed
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
    // Corrected to access user details from req.user instead of req.data.user
    const { email } = req.data.user;
    const { image } = req.body;
    let updateData = req.body; // The data to update the activity with

    try {
      const userData = await databaseClient
        .db()
        .collection("users")
        .findOne({ email });

      if (!userData) {
        return res.status(404).send("User not found.");
      }

      if (image) {
        if (image !== "") {
          const cloudinaryResult = await uploadToCloudinary(image);
          const imageUrl = cloudinaryResult.secure_url;
          updateData.image = imageUrl;
        } else {
          updateData.image = "";
        }
      }

      const duration = calculateDuration(
        updateData.start,
        updateData.end
      ).toString();
      updateData.duration = duration;

      const [year, month, day] = updateData.date.split("-").map(Number);
      updateData.day = day.toString();
      updateData.month = month.toString();
      updateData.year = year.toString();

      const userId = userData._id;

      const result = await databaseClient
        .db()
        .collection("activities")
        .updateOne(
          { _id: new ObjectId(activityId), userId: new ObjectId(userId) },
          { $set: updateData }
        );

      if (result.matchedCount === 0) {
        return res
          .status(404)
          .send(
            "Activity not found or you do not have permission to update it."
          );
      } else if (result.modifiedCount === 0) {
        return res.status(200).send("No changes were made to the activity.");
      } else {
        return res.status(200).send("Activity updated successfully.");
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while updating the activity.");
    }
  }
);

export default activityDetailRouter;
