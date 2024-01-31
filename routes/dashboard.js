import express from "express";
const dashboardRouter = express.Router();

dashboardRouter.get("/", (req, res) => res.send("This is dashboardRouter "));



export default dashboardRouter;