import express from "express";
import databaseClient from "../configs/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";
import authenticateToken from "../middlewares/authenticatetoken.js";
import { ObjectId } from "mongodb";
const accountRouter = express.Router();

accountRouter.patch("/", authenticateToken, async (req, res) => {
  const { email } = req.data.user;
  const updateData = req.body;
  try {
    // Convert activityId from string to ObjectId for the query
    const result = await databaseClient.db().collection("users").updateOne(
      { email }, // Ensure the activity belongs to the user
      { $set: updateData } // Use $set operator to update the fields
    );

    if (result.matchedCount === 0) {
      // No document found to update
      res.status(404).send("You do not have permission to update it.");
    } else if (result.modifiedCount === 0) {
      // Document found but no changes made (possibly due to the update data being the same as the existing data)
      res.status(200).send("No changes were made to the user.");
    } else {
      // Document updated successfully
      res.status(200).send("User updated successfully.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the activity.");
  }
});
export default accountRouter;
