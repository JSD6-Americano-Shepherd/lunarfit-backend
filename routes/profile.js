import express from 'express';


const profileRouter = express.Router();

profileRouter.get('/', (req, res) => {

    res.send("Hello World!");

});

export default profileRouter;