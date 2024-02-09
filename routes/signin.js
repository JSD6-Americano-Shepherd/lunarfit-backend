import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { checkMissingField } from "../utils/requestUtils.js";
import databaseClient from "../configs/database.mjs";
const signInRouter = express.Router();








const LOGIN_DATA_KEYS = ["email", "password"];









signInRouter.get("/", (req, res) => res.send("This is signInRouter "));







signInRouter.post("/", async (req, res) => {
    try {
        let { email, password } = req.body;
        const [isBodyChecked, missingFields] = checkMissingField(
            LOGIN_DATA_KEYS,
            req.body
        );
        if (!isBodyChecked) {
            return res.status(400).send(`Missing Fields: ${missingFields.join(', ')}`);
        }

        const user = await databaseClient
            .db()
            .collection("users")
            .findOne({ email: email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        // if (!validPassword) {
        //     return res.status(400).send({ error: { message: "Invalid email or password" } });
        // }
        const checkpassword = (password === user.password)
        if (!checkpassword) {
            return res.status(400).send({ error: { message: "Invalid email or password" } });
        }

        const token = createJwt(user);


        res.cookie('tokenByJarnBank', token, {
            maxAge: 300000000,
            secure: true,
            httpOnly: true,
            sameSite: "none",
        })

        res.status(200).send({ message: 'Login successful', token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ error: { message: "Internal server error" } });
    }
});

function createJwt(user) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const payload = {
        user: {
            email: user.email,
        },
    };
    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "1h" });
    return token;
}












export default signInRouter;