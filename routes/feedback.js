import express from 'express';
// import Feedback from '../models/Feedback.js'; 

const feedRouter = express.Router();

feedRouter.post('/', async (req, res) => {

  res.clearCookie("token");
  try {
    const { rating, comment } = req.body;
    const newFeedback = new Feedback({ rating, comment });
    await newFeedback.save();
    res.status(201).send('Feedback saved successfully');
  } catch (error) {
    res.status(400).send('Error saving feedback');
  }
});

export default feedRouter;
