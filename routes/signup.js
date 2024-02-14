import express from "express";
import databaseClient from "../configs/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";
const signUpRouter = express.Router();
const USER_DATA_KEYS = ["firstName", "lastName", "email", "password"];
import bcrypt from "bcrypt";

signUpRouter.get("/", (req, res) => res.send("This is signUpRouter "));

signUpRouter.post("/", async (req, res) => {
  let user = req.body;
  const [isBodyChecked, missingFields] = checkMissingField(
    USER_DATA_KEYS,
    user
  );
  if (!user.firstName) {
    res.status(400).send("Firstname cannot empty");
    return;
  }
  if (!isBodyChecked) {
    res.status(404).send(`Missing Fields: ${"".concat(missingFields)}`);
    return;
  }

  try {
    // Define the number of salt rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const data = {
      ...user,
      password: hashedPassword, // Use the hashed password instead of the plain one
      weight: 0,
      height: 0,
      age: 0,
      gender: "",
    };

    await databaseClient.db().collection("users").insertOne(data);
    res.status(200).send("Create user data successfully");
    // res.redirect("/home"); // Uncomment if you want to redirect after sign up
  } catch (error) {
    console.error("Error hashing password or inserting user data:", error);
    res.status(500).send("An error occurred during sign up.");
  }
});

export default signUpRouter;
