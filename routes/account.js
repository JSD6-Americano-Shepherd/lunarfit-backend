import express from "express";
import databaseClient from "../configs/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";
import authenticateToken from "../middlewares/authenticatetoken.js";
import { ObjectId } from "mongodb";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
const accountRouter = express.Router();

accountRouter.patch("/", authenticateToken, async (req, res) => {
  const { email } = req.data.user;
  const updateData = req.body;
  const { profileimg } = req.body;

  try {
    if (profileimg) {
      if (profileimg !== "") {
        const cloudinaryResult = await uploadToCloudinary(profileimg);
        const imageUrl = cloudinaryResult.secure_url;
        updateData.profileimg = imageUrl;
      } else {
        updateData.profileimg = "";
      }
    }

    const result = await databaseClient
      .db()
      .collection("users")
      .updateOne({ email }, { $set: updateData });

    if (result.matchedCount === 0) {
      res.status(404).send("You do not have permission to update it.");
    } else if (result.modifiedCount === 0) {
      res.status(200).send("No changes were made to the user.");
    } else {
      res.status(200).send("User updated successfully.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the user.");
  }
});

export default accountRouter;
