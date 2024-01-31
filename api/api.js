import express from "express";
const apiRoute = express.Router();

import activityRouter from "../routes/activity.js";
import resetPasswordRouter from "../routes/resetpassword.js";
import settingRouter from "../routes/setting.js";
import signInRouter from "../routes/signin.js";
import signUpRouter from "../routes/signup.js";
import dashboardRouter from "../routes/dashboard.js";

apiRoute.get("/", (req, res) => res.send("This is apiroute "));


apiRoute.use("/dashboard", dashboardRouter);
apiRoute.use("/activity", activityRouter);
apiRoute.use("/setting", settingRouter);
apiRoute.use("/resetpassword", resetPasswordRouter);
apiRoute.use("/signin", signInRouter);
apiRoute.use("/signup", signUpRouter);

export default apiRoute;

