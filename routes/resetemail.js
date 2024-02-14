import express from "express";
import databaseClient from "../configs/database.mjs";
import authenticateToken from "../middlewares/authenticatetoken.js";
import { createJwt } from "../utils/jwtUtils.js";
const resetEmailRouter = express.Router();

resetEmailRouter.patch("/", authenticateToken, async (req, res) => {
  const { currentEmail, newEmail, confirmNewEmail } = req.body.userData;
  const { email } = req.data.user;
  console.log(currentEmail);
  console.log(email);
  try {
    // เช็คว่า currentEmail ตรงกับอีเมลที่ได้จาก req.data.user หรือไม่
    if (currentEmail !== email) {
      return res.status(400).send("Current email does not match");
    }
    // เช็คว่า newemail และ confirmNewEmail เป็นไปตามเงื่อนไข
    if (newEmail !== confirmNewEmail) {
      return res.status(400).send("New email and confirm email do not match");
    }
    // อัพเดตอีเมลใหม่ในฐานข้อมูล
    const filter = { email: currentEmail };
    const update = { $set: { email: newEmail } };
    await databaseClient.db().collection("users").updateOne(filter, update);
    // if (result.matchedCount === 0) {
    //   return res.status(400).send("Current email is incorrect");
    // }
    // Generate new token
    const newToken = createJwt(newEmail); // สร้าง token ใหม่ด้วยอีเมลใหม่
    // Update token in cookie
    res.clearCookie("token");
    // res.cookie("token", newToken, { maxAge: 900000, httpOnly: true }); // Example: Set cookie for 15 minutes
    res.status(200).send("Email updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default resetEmailRouter;
