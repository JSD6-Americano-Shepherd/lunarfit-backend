import express from "express";
const signUpRouter = express.Router();

signUpRouter.get("/", (req, res) => res.send("This is signUpRouter "));



export default signUpRouter;