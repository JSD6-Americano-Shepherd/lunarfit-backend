import express from "express";
import databaseClient from "../configs/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";
import authenticateToken from "../middlewares/authenticatetoken.js";
import { ObjectId } from "mongodb";
const dashboardRouter = express.Router();

dashboardRouter.get("/", authenticateToken, async (req, res) => {
  const { email } = req.data.user;
  const userData = await databaseClient
    .db()
    .collection("users")
    .findOne({ email }, { projection: { _id: 0, password: 0 } }); // Add a query filter to select documents where userId is "01"
  res.json(userData);
});

export default dashboardRouter;
