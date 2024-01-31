import express from "express";
const resetPasswordRouter = express.Router();

resetPasswordRouter.get("/", (req, res) => res.send("This is resetPasswordRouter "));



export default resetPasswordRouter;