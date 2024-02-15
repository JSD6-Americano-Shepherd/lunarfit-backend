import express from "express";
const apiRoute = express.Router();

import activityRouter from "../routes/activity.js";
import resetPasswordRouter from "../routes/resetpassword.js";
import resetEmailRouter from "../routes/resetemail.js";
import settingRouter from "../routes/setting.js";
import signInRouter from "../routes/signin.js";
import signUpRouter from "../routes/signup.js";
import dashboardRouter from "../routes/dashboard.js";
import activityDetailRouter from "../routes/activityDetail.js";
import accountRouter from "../routes/account.js";
import feedRouter from '../routes/feedback.js'; // new route
import signOutRouter from '../routes/signout.js';
import profileRouter from "../routes/profile.js";


apiRoute.get("/", (req, res) => res.send("This is apiroute "));
apiRoute.use("/profile", profileRouter);

apiRoute.use("/dashboard", dashboardRouter);
apiRoute.use("/activity", activityRouter);
apiRoute.use("/activityDetail", activityDetailRouter);
apiRoute.use("/setting", settingRouter);
apiRoute.use("/account", accountRouter);
apiRoute.use("/resetpassword", resetPasswordRouter);
apiRoute.use("/resetemail", resetEmailRouter);
apiRoute.use("/signin", signInRouter);
apiRoute.use("/signup", signUpRouter);
// Use the sign-out route
apiRoute.use("/signout", signOutRouter);
// set up route for feedback
apiRoute.use("/feedback", feedRouter);


export default apiRoute;



