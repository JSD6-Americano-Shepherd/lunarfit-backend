import express from "express";
const activityRouter = express.Router();


activityRouter.get("/", (req, res) => res.send("This is routeractivity "));




activityRouter.post("/", async (req, res) => {
    let body = req.body;
    const [isBodyChecked, missingFields] = checkMissingField(
        HEALTH_DATA_KEYS,
        body
    );
    if (!isBodyChecked) {
        res.send(`Missing Fields: ${"".concat(missingFields)}`);
        return;
    }

    body["user_id"] = new ObjectId(body.user_id);

    await databaseClient.db().collection("health-history").insertOne(body);
    res.send("Create health data successfully");
});










export default activityRouter;

