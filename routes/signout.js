import express from 'express';

const signOutRouter = express.Router();

signOutRouter.get('/', (req, res) => {

    res.clearCookie("token");

    res.status(200).send('Logged out successfully');
});

export default signOutRouter;
