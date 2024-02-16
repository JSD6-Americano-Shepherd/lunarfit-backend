import express from "express";
import { createJwt } from "../utils/jwtUtils.js";
import authenticateToken from "../middlewares/authenticatetoken.js";
const signOutRouter = express.Router();

signOutRouter.get("/", authenticateToken, (req, res) => {
  const newToken = createJwt(null); // สร้าง token ใหม่ด้วยอีเมลใหม่
  const tenDaysInMilliseconds = 10 * 24 * 60 * 60 * 1000;
  res.cookie("token", newToken, {
    maxAge: tenDaysInMilliseconds,
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  res.status(200).send("Logged out successfully");
});

export default signOutRouter;
