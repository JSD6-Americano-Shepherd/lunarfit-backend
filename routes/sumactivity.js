import express from "express";
import authenticateToken from "../middlewares/authenticatetoken.js";
import databaseClient from "./configs/database.mjs";


const sumActivityRouter = express.Router();

//middleware authenticateToken 
sumActivityRouter.get('/', authenticateToken , async (req,res) => {
    //same as const email = req.data.user.email
    const { email } = req.data.user;




    
})

export default sumActivityRouter;