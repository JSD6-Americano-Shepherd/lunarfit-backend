import express from "express";
const settingRouter = express.Router();

settingRouter.get("/", (req, res) => res.send("This is settingRouter "));

export default settingRouter;
