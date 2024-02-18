import express from "express";
import bcrypt from "bcrypt";
import { createJwt } from "../utils/jwtUtils.js";
import jwt from "jsonwebtoken";

import { checkMissingField } from "../utils/requestUtils.js";
import databaseClient from "../configs/database.mjs";
const signInRouter = express.Router();
const LOGIN_DATA_KEYS = ["email", "password"];

signInRouter.get("/", (req, res) => res.send("This is signInRouter "));
signInRouter.post("/", async (req, res) => {
  try {
    let { email, password } = req.body;
    const [isBodyChecked, missingFields] = checkMissingField(
      LOGIN_DATA_KEYS,
      req.body
    );
    if (!isBodyChecked) {
      return res
        .status(400)
        .send(`Missing Fields: ${missingFields.join(", ")}`);
    }

    const user = await databaseClient
      .db()
      .collection("users")
      .findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    // if (!validPassword) {
    //     return res.status(400).send({ error: { message: "Invalid email or password" } });
    // }
    if (!validPassword) {
      return res
        .status(400)
        .send({ error: { message: "Invalid email or password" } });
    }
    // res.json(activityData);
    const userEmail = user.email;
    const token = createJwt(userEmail);
    const tenDaysInMilliseconds = 10 * 24 * 60 * 60 * 1000;
    res.cookie("token", token, {
      maxAge: tenDaysInMilliseconds,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ error: { message: "Internal server error" } });
  }
});

export default signInRouter;
