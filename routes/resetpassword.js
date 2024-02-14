import express from "express";
import databaseClient from "../configs/database.mjs";
import authenticateToken from "../middlewares/authenticatetoken.js";
import bcrypt from "bcrypt";
const resetPasswordRouter = express.Router();

resetPasswordRouter.patch("/", authenticateToken, async (req, res) => {
  const { email } = req.data.user; // Assuming req.data.user is correctly populated
  const { confirmNewPassword, currentPassword, newPassword } =
    req.body.updateData;
  console.log(confirmNewPassword, newPassword);
  if (newPassword !== confirmNewPassword) {
    res.status(400).send("New password and confirm password do not match.");
    return; // Stop execution if the new passwords do not match
  }

  try {
    // Find the user by email
    const user = await databaseClient
      .db()
      .collection("users")
      .findOne({ email }, { projection: { password: 1 } });

    if (!user) {
      res.status(404).send("User not found.");
      return;
    }

    // Compare the currentPassword with the user's hashed password
    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      res.status(401).send("Current password is incorrect.");
      return;
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password with the new hashed password
    await databaseClient
      .db()
      .collection("users")
      .updateOne({ email }, { $set: { password: hashedPassword } });

    res.status(200).send("Password updated successfully.");
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send("An error occurred while updating the password.");
  }
});

export default resetPasswordRouter;
