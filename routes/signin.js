import express from "express";
const signInRouter = express.Router();

signInRouter.get("/", (req, res) => res.send("This is signInRouter "));



export default signInRouter;