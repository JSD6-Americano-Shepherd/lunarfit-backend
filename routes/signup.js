import express from "express";
import databaseClient from "../configs/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";
const signUpRouter = express.Router();
const USER_DATA_KEYS = ["firstName", "lastName", "email", "password"];

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

  const data = {
    ...user,
    weight: 0,
    height: 0,
    age: 0,
    gender: "",
  };
  await databaseClient.db().collection("users").insertOne(data);




  res.status(200).send("Create user data successfully");
  //   res.redirect("/home");
});

export default signUpRouter;
