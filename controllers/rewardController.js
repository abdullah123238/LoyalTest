const Reward = require('../models/Reward');
const asyncHandler = require('express-async-handler');


const getRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find({});
  res.json(rewards);
});

module.exports = { getRewards };
