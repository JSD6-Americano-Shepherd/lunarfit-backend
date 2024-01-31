import express from "express";
const activityRouter = express.Router();

activityRouter.get("/", (req, res) => res.send("This is routeractivity "));



export default activityRouter;

